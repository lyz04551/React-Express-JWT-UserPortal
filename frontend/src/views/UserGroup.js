import React, {useEffect, useState} from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable, CForm, CFormGroup, CFormText, CInput,
  CModal,
  CModalBody, CModalFooter,
  CModalHeader,
  CRow
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { useHistory } from 'react-router-dom';
import axios from '../services/api';
import CBadgeGroup from './widgets/CBadgeGroup';
import { changeUserInfo } from './Users';
import { useFormik } from 'formik';
import Select from 'react-select';

const UserGroup = () => {
  const fields = ['id', 'name', 'roles', 'action']
  const history = useHistory()
  const [professionalData, setProfessinalData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [status, setStatus] = useState(0)
  const [rowID, setRowID] = useState(null)
  const [rowData, setRowData] = useState([])
  const [role, setRole] = useState([])
  const user_info = JSON.parse(localStorage.getItem('user_info'))
  if (user_info) {
    const ownRoles = user_info.user.roles.map(item=> item.nome)
    if (!ownRoles.includes('ROLE_ROOM_EDIT')) fields.splice(-1,1)
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
    axios.delete('/usergroup/' + rowID, {
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

  useEffect(() => {
    async function getUsersGroup() {
      try {
        const res = await axios.get('/usergroup', {
          headers: {
            authorization: user_info.accessToken,
            token: user_info.refreshToken
          }
        })
        if (res.data.group) {
          res.data.accessToken && changeUserInfo(res.data.accessToken, res.data.refreshToken)
          setProfessinalData(res.data.group)
          await getRoles()
        } else {
          redirect()
        }
      } catch (e) {
        alert(e.message)
        redirect()
      }
    }
    async function getRoles(){
      try {
        const res = await axios.get('/roles', {
          headers: {
            authorization: user_info.accessToken,
            token: user_info.refreshToken
          }
        })
        if (res.data.role){
          res.data.accessToken && changeUserInfo(res.data.accessToken, res.data.refreshToken)
          setRole(res.data.role)
        } else {
          alert(res.data)
          redirect()
        }
      } catch (e) {
        alert(e.message)
        redirect()
      }
    }

    getUsersGroup()
  }, [status])

  useEffect(() => {
    if (rowID !== null){
      setShowModal(!showModal)
    }
  }, [rowID])

  const handleAddNew = () =>{
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
                    <UserGroupModal rowID={rowID} rowData={rowData} role={role} display={showModal} handleDisplay={hanldeShowModal}  handleAddNew={handleAddNew} />
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
                  'roles':(item) => (
                    <td>
                      <CBadgeGroup list={item.roles}/>
                    </td>
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

const UserGroupModal = (props) => {
  const [mess, setMess] = useState('')
  const [selectedOption, setSelectedOption] = useState([]);
  const history = useHistory()

  const handleAddNewOne = () => {
    props.handleAddNew();
  }
  const handleDisplay = () => {
    setMess('')
    props.handleDisplay()
  }

  const validate = values => {
    const errors = {};
    values.name || (errors.name = 'Please enter group name');
    return errors;
  }
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: props.rowData.name || '',
    },
    validate,
    onSubmit: values => {
      values.roles = selectedOption
      console.log(values)
      handleSubmit(values)
    }
  })

  async function handleSubmit(values) {
    const user_info = JSON.parse(localStorage.getItem('user_info'))
    if (user_info.user){
      let res = null
      try {
        if (props.rowID === -1){
          res = await axios.post('/usergroup', values, {
            headers: {
              authorization: user_info.accessToken,
              token: user_info.refreshToken
            }
          })
        }
        if (props.rowID >= 0) {
          res = await axios.put('/usergroup/' + props.rowID, values, {
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
        <CModalHeader closeButton>New User Group</CModalHeader>
        <CModalBody>
          <CForm>
            <CFormGroup>

              <CRow>
                <CCol className={'col-3'}>
                  <CInput id="name" name="name" placeholder="Name" value={formik.values.name} onChange={formik.handleChange} />
                  <p className="text-warning" >{formik.errors.name?formik.errors.name:null}</p>
                </CCol>
                <CCol>
                  <Select defaultValue={selectedOption}
                          onChange={setSelectedOption}
                          options={props.role}
                          isMulti
                  />
                  <p className="text-warning" >{selectedOption.length === 0?'Please Select one of Roles':null}</p>
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


export default UserGroup
