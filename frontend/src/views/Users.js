import React, {useState, useEffect} from 'react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable, CForm, CFormGroup, CFormText, CInput,
  CModal, CModalBody, CModalFooter,
  CModalHeader,
  CRow, CSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import axios from '../services/api';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import Select from 'react-select';

const Users = () => {
  const history = useHistory()
  const [professionalData, setProfessinalData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [status, setStatus] = useState(0)
  const [rowID, setRowID] =useState(null)
  const [rowData, setRowData] = useState([])
  const [group, setGroup] = useState([])
  const fields = ['id','name', 'username','user_group', 'email', 'initcode', 'cpf', 'birthday', 'gender', 'master', 'active', 'fk_professional', 'fk_license', 'deleted', 'creation_timestamp', 'action']
  const user_info = JSON.parse(localStorage.getItem('user_info'))
  if (user_info) {
    const ownRoles = user_info.user.roles.map(item=> item.nome)
    if (!ownRoles.includes('ROLE_LIC_EDIT')) fields.splice(-1,1)
  }



  const hanldeShowModal = () => {
    setRowID(null)
    setShowModal(!showModal)
  }

  const addOrEdit = (id, item) => {
    setRowID(id)
    setRowData(item)
  }

  const redirect = () => {
    history.push('/login')
    localStorage.removeItem('user_info')
  }

  const deleteRow = (rowID) => {
    axios.delete('/' + rowID, {
      headers: {
        authorization: user_info.accessToken,
        token: user_info.refreshToken
      }
    }).then(res => {
      res.data.accessToken && changeUserInfo(res.data.accessToken, res.data.refreshToken)
      alert(res.data.message)
      handleAddNew()
    }).catch(err => {
      alert(err.message);
      redirect()
    })
  }

  const dateConvertor = (dt) => {
    let date = new Date(dt);
    return (((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear());
  }

  useEffect(() => {
      async function getAllUser(){
       try {
         const res = await axios.get('/', {
           headers: {
             authorization: user_info.accessToken,
             token: user_info.refreshToken
           }
         })
         if (res.data.users) {
           res.data.accessToken && changeUserInfo(res.data.accessToken, res.data.refreshToken)
           setProfessinalData(res.data.users)
           await getGroups()
         } else {
           alert(res.data)
           redirect();
         }
       } catch (err) {
         alert(err.message)
         redirect()
       }}

       async function getGroups(){
        try {
          const res = await axios.get('/usergroup-list', {
            headers: {
              authorization: user_info.accessToken,
              token: user_info.refreshToken
            }
          })
          if (res.data.group) {
            res.data.accessToken && changeUserInfo(res.data.accessToken, res.data.refreshToken)
            setGroup(res.data.group)
          } else {
            alert(res.data)
            redirect();
          }
        } catch (e) {
          alert(e.message)
          redirect();
        }
       }

    getAllUser()
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
                    <UserModal rowID={rowID} group={group} rowData={rowData} display={showModal} handleDisplay={hanldeShowModal}  handleAddNew={handleAddNew} />
                  </CCol>
                </CRow>
              </CCardHeader>
            )}
            <CCardBody>
              <CDataTable
                items={professionalData}
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
                  'user_group': (item) => (
                    <td>
                      <CBadge shape={'pill'}>
                        {item.user_group}
                      </CBadge>
                    </td>
                  ),
                  'gender':
                    (item)=>(
                      <td>
                        <CBadge shape={'pill'} color={item.gender === 0? 'info' : 'success'}>
                          {item.gender === 0? "Male" : "Female"}
                        </CBadge>
                      </td>
                    ),
                  'birthday':(item)=>(
                    <td>
                      {dateConvertor(item.birthday)}
                    </td>
                  ),
                  'active':(item) => (
                    <td><CBadge color={item.active === 1? 'success' : 'dark'}>{item.deleted === 1? 'Online': 'Offline'}</CBadge></td>
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
                          {item.id !== 1 ? <CButton onClick={(e) => deleteRow(item.id)}  className={'btn-pill'} size={'sm'} ><CIcon className={'cust_action_delete'} name={'cilTrash'}/></CButton> : null}
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

const UserModal = (props) => {
  console.log(props.group)

  const [mess, setMess] = useState('')
  const [selectedOption, setSelectedOption] = useState([])
  const history = useHistory()
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
    values.name || (errors.name = 'Required');
    values.gender || (errors.gender = 'Required');
    values.birthday || (errors.birthday = 'Required');
    values.pass || (errors.pass = 'Required');
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
      username: rowData.username || '',
      gender: rowData.gender || '',
      email: rowData.email || '',
      pass: rowData.pass || '',
      initcode: rowData.initcode || '',
      cpf: rowData.cpf || '',
      birthday: rowData.birthday || '',
      master: rowData.master || '',
      fk_professional: rowData.fk_professional || '',
      fk_license: rowData.fk_license || '',
      deleted: rowData.deleted || ''
    },
    validate,
    onSubmit: values => {
      values.usergroup = selectedOption
      add_new(values)
    }
  })

  async function add_new(values) {
    const user_info = JSON.parse(localStorage.getItem('user_info'))
    if (user_info.user){
      let res = null
      try {
        if (props.rowID === -1){
          res = await axios.post('/', values, {
            headers: {
              authorization: user_info.accessToken,
              token: user_info.refreshToken
            }
          })
        }
        if (props.rowID >= 0) {
          res = await axios.put('/' + props.rowID, values, {
            headers: {
              authorization: user_info.accessToken,
              token: user_info.refreshToken
            }
          })
        }
        res.data.accessToken && changeUserInfo(res.data.accessToken, res.data.refreshToken)
        if (res.data.message === "Success"){
          handleAddNewOne();
          handleDisplay()
        } else {
          setMess(res.data.message)
        }
      } catch (e) {
        alert(e.message)
        history.push('/login')
        localStorage.removeItem('user_info')
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
        <CModalHeader closeButton>New User</CModalHeader>
        <CModalBody>
          <CForm>
            <CFormGroup>

              <CRow>
                <CCol>
                  <CInput id="name" name="name" placeholder="Name" value={formik.values.name} onChange={formik.handleChange} />
                  <p className="text-warning" >{formik.errors.name?formik.errors.name:null}</p>
                </CCol>
                <CCol>
                  <CInput id="username" name="username" placeholder="User Name" value={formik.values.username} onChange={formik.handleChange} />
                  <p className="text-warning" >{formik.errors.username?formik.errors.username:null}</p>
                </CCol>
                <CCol>
                  <CInput id="email" name="email" type="email" placeholder="Email" value={formik.values.email} onChange={formik.handleChange}/>
                  <p className="text-warning" >{formik.errors.email?formik.errors.email:null}</p>
                </CCol>
                <CCol>
                  <CInput id="pass" name="pass" type={'password'} placeholder="pass" value={formik.values.pass} onChange={formik.handleChange} />
                  <p className="text-warning" >{formik.errors.pass?formik.errors.pass:null}</p>
                </CCol>
              </CRow>

              <CRow>
                <CCol>
                  <Select defaultValue={selectedOption}
                          onChange={setSelectedOption}
                          options={props.group}
                  />
                  <p className="text-warning" >{selectedOption.length === 0?'Please Select One of User Group':null}</p>
                </CCol>
                <CCol>
                  <CInput id="cpf" name="cpf" placeholder="Cpf" value={formik.values.cpf} onChange={formik.handleChange} />
                  <p className="text-warning" >{formik.errors.cpf?formik.errors.cpf:null}</p>
                </CCol>
                <CCol>
                  <CInput type={'date'} id="birthday" name="birthday" placeholder="Birthday" value={formik.values.birthday} onChange={formik.handleChange} />
                  <p className="text-warning" >{formik.errors.birthday?formik.errors.birthday:null}</p>
                </CCol>
                <CCol>
                  <CSelect custom name="gender" id="gender" value={formik.values.gender} onChange={formik.handleChange}>
                    <option value="2">Select gender</option>
                    <option value="0">Male</option>
                    <option value="1">Female</option>
                  </CSelect>
                  <p className="text-warning" >{formik.errors.gender?formik.errors.gender:null}</p>
                </CCol>
              </CRow>

              <CRow>
                <CCol>
                  <CSelect custom name="master" id="master" value={formik.values.master} onChange={formik.handleChange}>
                    <option value="2">Select gender</option>
                    <option value="0">Master</option>
                    <option value="1">No Master</option>
                  </CSelect>
                  <p className="text-warning" >{formik.errors.master?formik.errors.master:null}</p>
                </CCol>
                <CCol>
                  <CInput id="fk_license" name="fk_license" placeholder="Fk License" value={formik.values.fk_license} onChange={formik.handleChange}/>
                </CCol>
                <CCol>
                  <CInput id="fk_professional" name="fk_professional" placeholder="Fk Professional" value={formik.values.fk_professional} onChange={formik.handleChange}/>
                </CCol>
                <CCol>
                  <CInput id="initcode" name="initcode" placeholder="InitCode" value={formik.values.initcode} onChange={formik.handleChange} />
                  <p className="text-warning" >{formik.errors.initcode?formik.errors.initcode:null}</p>
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

export function changeUserInfo (tk_access, tk_ref){
  console.log("changeUserInfo")
  const user_info = JSON.parse(localStorage.getItem('user_info'))
  console.log(user_info.accessToken)
  user_info.accessToken = tk_access
  user_info.refreshToken = tk_ref
  localStorage.setItem('user_info', JSON.stringify(user_info))
  console.log(user_info.accessToken)
}

export function dateConvertor (dt) {
  let date = new Date(dt);
  return (date.getFullYear()+'-'+ ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())));
}

export default Users
