import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom'
import axios from '../services/api'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CInputFile,
  CForm,
  CFormGroup,
  CInput,
  CFormText
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useFormik } from 'formik';


const Patient = () =>{
  const history = useHistory()
  const [PatientData, setPatientData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [status, setStatus] = useState(0)
  const [rowID, setRowID] =useState(null)
  const [rowData, setRowData] = useState([])
  const fields = ['id','picture', 'name', 'CPF', 'gender', 'birthday', 'email', 'occupation', 'comments', 'fk_license', 'deleted', 'action']
  const user_info = JSON.parse(localStorage.getItem('user_info'))
  if (user_info) {
    const ownRoles = user_info.user.roles.map(item=> item.nome)
    if (!ownRoles.includes('ROLE_TARGET_EDIT')) fields.splice(-1,1)
  }


  const hanldeShowModal = () => {
    setRowID(null)
    setShowModal(!showModal)
  }

  const addOrEdit = (id, item) => {
    setRowID(id)
    setRowData(item)
  }

  const deleteRow = (rowID) => {
    axios.delete('/patients/' + rowID, {
      headers: {
        authorization: user_info.accessToken
      }
    }).then(res => {
      alert(res.data.message)
      handleAddNew()
    }).catch(err => alert(err.message))
  }

  const dateConvertor = (dt) => {
    let date = new Date(dt);
    return (((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear());
  }

  useEffect( () => {
    async function getPermissions() {
      try {
        const res = await axios.get('/patients', {
          headers: {
            authorization: user_info.accessToken
          }
        })
        if (res.data.patient) {
          const val = res.data.patient
          setPatientData(val)
        } else {
          history.push('/login')
          localStorage.removeItem('user_info')
        }
      } catch (err) {
        alert(err.message)
      }
    }
    getPermissions()
  }, [status])

  useEffect(() => {
    if (rowID !== null){
      setShowModal(!showModal)
    }
  }, [rowID])

  function handleAddNew() {
    setStatus(status + 1)
  }

  return (
    <>
      <CRow className="justify-content-center">
        <CCol md="12">
          <CCard>
            {fields.includes('action')&&(
              <CCardHeader >
                <CRow>
                  <CCol>
                    <CButton onClick={()=>addOrEdit(-1, [])} className="px-5" color="info">+ Add New</CButton>
                    <Modal rowID={rowID} rowData = {rowData} display={showModal} api={'/patients'} handleDisplay={hanldeShowModal}  handleAddNew={handleAddNew} />
                  </CCol>
                </CRow>
              </CCardHeader>
            )}
            <CCardBody>
              <CDataTable
                items={PatientData}
                fields={fields}
                itemsPerPageSelect
                itemsPerPage={5}
                pagination
                tableFilter
                scopedSlots = {{
                  'id' : (item, index) => (
                    <td>
                      {index + 1}
                    </td>
                  ),
                  'picture': (item) => (
                    <td>
                      <div className={'c-avatar'}>
                        <img className={'c-avatar-img'} src={item.picture} alt={''}/>
                      </div>
                    </td>
                  ),
                  'gender':(item)=>(
                      <td>
                        <CBadge shape={'pill'} color={item.gender === 0? 'info' : 'success'}>
                          {item.gender === 0? "Male" : "Female"}
                        </CBadge>
                      </td>
                    ),
                  'birthday':(item) =>(
                    <td>
                      {dateConvertor(item.birthday)}
                    </td>
                  ),
                  'deleted':(item) => (
                    <td><CBadge color={item.deleted === 1? 'danger' : 'warning'}>{item.deleted === 1? 'Deleted': 'Working'}</CBadge></td>
                  ),
                  'action': (item) => (
                    <td width={102}>
                      <CRow>
                        <CCol>
                          <CButton onClick={(e)=> addOrEdit(item.id, item)} className={'btn-pill'} size={'sm'} ><CIcon className={'cust_action_edit'} name={'cilPencil'} /></CButton>
                        </CCol>
                        <CCol>
                          <CButton onClick={(e) => deleteRow(item.id)}  className={'btn-pill'} size={'sm'} ><CIcon className={'cust_action_delete'} name={'cilTrash'}/></CButton>
                        </CCol>
                      </CRow>
                    </td>
                  )
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

    </>
  );
}

const Modal = (props) => {
  const [mess, setMess] = useState('')
  const rowData = props.rowData
  function handleAddNewOne() {
    props.handleAddNew();
  }
  const handleDisplay = () => {
    setMess('')
    props.handleDisplay()
  }

  const validate = values => {
    const errors = {};
    if (!values.name ) {
      errors.password = 'Required';
    }
    if (!values.gender){
      errors.gender = 'Required';
    }
    if ( !values.birthday){
      errors.birthday = 'Required';
    }
    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    return errors;
  }
  const formik = useFormik({
      enableReinitialize: true,
      initialValues: {
        name: rowData.name || '',
        gender: rowData.gender || '',
        birthday: rowData.birthday || '',
        email: rowData.email || '',
        comment: rowData.comment || '',
        picture: rowData.picture || '',
        deleted: rowData.deleted || '',
        fk_license: rowData.fk_license || '',
        CPF: rowData.CPF || '',
        occupation: rowData.occupation || '',
      },
      validate,
      onSubmit: values => {
        add_new(values)
      }
  })

  async function add_new(values) {
    const user_info = JSON.parse(localStorage.getItem('user_info'))
    if (user_info.user){
      let response = null
      console.log(props.rowID)
      try {
        if (props.rowID === -1){
          response = await axios.post(`${props.api}`, values, {
            headers: {
              authorization: user_info.accessToken
            }
          })
        }
        if (props.rowID >= 0) {
          response = await axios.put(`${props.api}/${props.rowID}`, values, {
            headers: {
              authorization: user_info.accessToken
            }
          })
        }
        if (response.data.message === "Success"){
          handleAddNewOne();
          handleDisplay()
        } else {
          setMess(response.data.message)
        }
      } catch (e) {
        alert(e.message)
      }
    }

  }

  return (
    <>
      <CModal
        show={props.display}
        onClose={(e)=>handleDisplay()}
        size="lg"
        color={'info'}
      >
        <CModalHeader closeButton>New Professional</CModalHeader>
        <CModalBody>
          <CForm>
              <CFormGroup>
                <CRow>
                  <CCol>
                    <CInput id="name" name="name" placeholder="Name" value={formik.values.name} onChange={formik.handleChange} />
                    <p className="text-warning" >{formik.errors.name?formik.errors.name:null}</p>
                  </CCol>
                  <CCol>
                    <CInput type={'number'} id="gender" name="gender" placeholder="Gender" value={formik.values.gender} onChange={formik.handleChange}/>
                    <p className="text-warning" >{formik.errors.gender?formik.errors.gender:null}</p>
                  </CCol>
                  <CCol>
                    <CInput id="email" name="email" type="email" placeholder="Email" value={formik.values.email} onChange={formik.handleChange}/>
                    <p className="text-warning" >{formik.errors.email?formik.errors.email:null}</p>
                  </CCol>
                  <CCol>
                    <CInput id="CPF" name="CPF" type="CPF" placeholder="CPF" value={formik.values.CPF} onChange={formik.handleChange}/>
                    <p className="text-warning" >{formik.errors.CPF?formik.errors.CPF:null}</p>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CInput id="birthday" name="birthday" type={'date'} placeholder="Birthday" value={formik.values.birthday} onChange={formik.handleChange} />
                    <p className="text-warning" >{formik.errors.birthday?formik.errors.birthday:null}</p>
                  </CCol>
                  <CCol>
                    <CInput id="comment" name="comment" placeholder="Comment" value={formik.values.comment} onChange={formik.handleChange}/>
                  </CCol>
                  <CCol>
                    <CInput id="fk_license" name="fk_license" placeholder="Fk License" value={formik.values.fk_license} onChange={formik.handleChange}/>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CInput id="occupation" name="occupation" placeholder="Occupation" value={formik.values.occupation} onChange={formik.handleChange} />
                    <p className="text-warning" >{formik.errors.occupation?formik.errors.occupation:null}</p>
                  </CCol>
                  <CCol>
                    <CInput type={'number'} id="deleted" name="deleted" placeholder="Deleted" value={formik.values.deleted} onChange={formik.handleChange} />
                    <p className="text-warning" >{formik.errors.deleted?formik.errors.deleted:null}</p>
                  </CCol>
                  <CCol>
                    <CInputFile id="picture" name="picture" value={formik.values.picture} onChange={formik.handleChange}/>
                  </CCol>
                </CRow>
                <CFormText className="help-block" color={'danger'}>{mess}</CFormText>
              </CFormGroup>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton onClick={formik.handleSubmit} type="submit" color="info">Submit</CButton>{' '}
          <CButton
            color="secondary"
            onClick={(e) => handleDisplay()}
          >Cancel</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}
export default Patient
