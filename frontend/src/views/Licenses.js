import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom'
import axios from '../services/api'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CDataTable,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CRow, CCol,
  CInputFile,
  CForm,
  CFormGroup,
  CInput,
  CFormText, CSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react'

import { useFormik } from 'formik';
import { changeUserInfo } from './Users';
import { dateConvertor } from "./Users";

const License = () =>{
  const history = useHistory()
  const [licenseData, setLicenseData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [status, setStatus] = useState(0)
  const [rowID, setRowID] =useState(null)
  const [rowData, setRowData] = useState([])
  const fields = ['id','name','fk_user','creation_time','expiration_date','fixed_time','all_markers','agenda_interval','agenda_start','agenda_ending','reminder_msg_event','cat_color_active','locked','action']
  const user_info = JSON.parse(localStorage.getItem('user_info'))
  if (user_info) {
    const ownRoles = user_info.user.roles.map(item=> item.nome)
    ownRoles.includes('ROLE_LIC_EDIT') || fields.splice(-1,1);
  }


  const hanldeShowModal = () => {
    setRowID(null)
    setShowModal(!showModal)
  }

  const addOrEdit = (id, item) => {
    setRowID(id)
    item.expiration_date = dateConvertor(item.expiration_date)
    setRowData(item)
  }

  const redirect = ()=> {
    history.push('/login')
    localStorage.removeItem('user_info')
  }

  const deleteRow = (rowID) => {
    axios.delete('/licenses/' + rowID, {
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

  useEffect( () => {
    async function getPermissions() {
      try {
        const res = await axios.get('/licenses', {
          headers: {
            authorization: user_info.accessToken,
            token: user_info.refreshToken
          }
        })
        if (res.data.license) {
          res.data.accessToken && changeUserInfo(res.data.accessToken, res.data.refreshToken)
          const val = res.data.license
          setLicenseData(val)
        } else {
          redirect()
        }
      } catch (err) {
        alert(err.message)
        redirect()
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
                    <CButton onClick={()=>addOrEdit(-1,[])} className="px-5" color="info">+ Add New</CButton>
                    <Modal rowID={rowID}  display={showModal} rowData = {rowData} handleDisplay={hanldeShowModal}  handleAddNew={handleAddNew} />
                  </CCol>
                </CRow>
              </CCardHeader>
            )}

            <CCardBody>
              <CDataTable
                items={licenseData}
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
                  'creation_time':(item)=>(
                    <td>
                      {dateConvertor(item.creation_time)}
                    </td>
                  ),
                  'expiration_date':(item) => (
                    <td>
                      {dateConvertor(item.expiration_date)}
                    </td>
                  ),
                  'locked':(item) => (
                    <td><CBadge color={item.locked === 1? 'danger' : 'warning'}>{item.locked === 1? 'Locked': 'Unlocked'}</CBadge></td>
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
    values.name ||( errors.name = 'Required');
    values.fk_user || (errors.fk_user = 'Required');
    values.expiration_date || (errors.expiration_date = 'Required');
    values.fixed_time || (errors.fixed_time = 'Required');
    values.all_markers || (errors.all_markers = 'Required');
    values.agenda_start || (errors.agenda_start = 'Required');
    values.agenda_ending || (errors.agenda_ending = 'Required');
    values.agenda_interval || (errors.agenda_interval = 'Required');
    values.cat_color_active || (errors.cat_color_active = 'Required');
    (!values.locked || values.locked === '0') && (errors.locked = 'Required');
    return errors;
  }
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: rowData.name || '',
      fk_user: rowData.fk_user || '',
      creation_time: rowData.creation_time || '',
      expiration_date: rowData.expiration_date || '',
      fixed_time: rowData.fixed_time || '',
      all_markers: rowData.all_markers || '',
      agenda_interval: rowData.agenda_interval || '',
      agenda_start: rowData.agenda_start || '',
      agenda_ending: rowData.agenda_ending || '',
      reminder_msg_event: rowData.reminder_msg_event || '',
      cat_color_active: rowData.cat_color_active || '',
      locked: rowData.locked || ''
    },
    validate,
    onSubmit: values => {
      console.log("adfa")

      add_new(values)
    }
  })

  async function add_new(values) {
    const user_info = JSON.parse(localStorage.getItem('user_info'))
    if (user_info.user){
      let res = null
      console.log(props.rowID)
      try {
        if (props.rowID === -1){
          res = await axios.post('/licenses', values, {
            headers: {
              authorization: user_info.accessToken,
              token: user_info.refreshToken
            }
          })
        }
        if (props.rowID >= 0) {
          res = await axios.put('/licenses/' + props.rowID, values, {
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
        <CModalHeader closeButton>New License</CModalHeader>
        <CModalBody>
          <CForm>
            <CFormGroup>
              <CRow>
                <CCol>
                  <CInput id="name" name="name" placeholder="Name" value={formik.values.name} onChange={formik.handleChange} />
                  <p className="text-warning" >{formik.errors.name?formik.errors.name:null}</p>
                </CCol>
                <CCol>
                  <CInput id="fk_user" name="fk_user" placeholder="fk user" value={formik.values.fk_user} onChange={formik.handleChange}/>
                  <p className="text-warning" >{formik.errors.fk_user?formik.errors.fk_user:null}</p>
                </CCol>
                <CCol>
                  <CInput type={'date'} id="expiration_date" name="expiration_date" placeholder="Expiration Date" value={formik.values.expiration_date} onChange={formik.handleChange}/>
                  <p className="text-warning" >{formik.errors.expiration_date?formik.errors.expiration_date:null}</p>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CInput type={'number'} id="fixed_time" name="fixed_time" placeholder="Fixed Time" value={formik.values.fixed_time} onChange={formik.handleChange} />
                  <p className="text-warning" >{formik.errors.fixed_time?formik.errors.fixed_time:null}</p>
                </CCol>
                <CCol>
                  <CInput type={'number'} id="all_markers" name="all_markers" placeholder="All Markers" value={formik.values.all_markers} onChange={formik.handleChange}/>
                  <p className="text-warning" >{formik.errors.all_markers?formik.errors.all_markers:null}</p>
                </CCol>
                <CCol>
                  <CInput type={'time'} id="agenda_start" name="agenda_start" placeholder={'Agenda Start'} value={formik.values.agenda_start} onChange={formik.handleChange}/>
                  <p className="text-warning" >{formik.errors.agenda_start?formik.errors.agenda_start:null}</p>
                </CCol>
                <CCol>
                  <CInput type={'time'} id="agenda_ending" name="agenda_ending" placeholder={'Agenda Ending'} value={formik.values.agenda_ending} onChange={formik.handleChange}/>
                  <p className="text-warning" >{formik.errors.agenda_ending?formik.errors.agenda_ending:null}</p>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CInput type={'number'} id="agenda_interval" name="agenda_interval" placeholder="Agenda Interval" value={formik.values.agenda_interval} onChange={formik.handleChange}/>
                  <p className="text-warning" >{formik.errors.agenda_interval?formik.errors.agenda_interval:null}</p>
                </CCol>
                <CCol>
                  <CInput id="reminder_msg_event" name="reminder_msg_event" placeholder={'Reminder MSG Event'} value={formik.values.reminder_msg_event} onChange={formik.handleChange}/>
                </CCol>
                <CCol>
                  <CInput type={'number'} id="cat_color_active" name="cat_color_active" placeholder={'CAT Color Active'} value={formik.values.cat_color_active} onChange={formik.handleChange}/>
                  <p className="text-warning" >{formik.errors.cat_color_active?formik.errors.cat_color_active:null}</p>
                </CCol>
                <CCol>
                  <CSelect custom name={'locked'} id={'locked'} value={formik.values.locked} onChange={formik.handleChange}>
                    <option value="0">Select status</option>
                    <option value="1">Locked</option>
                    <option value="2">Unlocked</option>
                  </CSelect>
                  <p className="text-warning" >{formik.errors.locked?formik.errors.locked:null}</p>
                </CCol>
              </CRow>
              <CFormText className="help-block" placeholder={'Agenda Start'} color={'danger'}>{mess}</CFormText>
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
export default License
