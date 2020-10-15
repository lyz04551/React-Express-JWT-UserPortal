import React, {useState} from 'react'
import axios from '../../services/api'
import Select from 'react-select';
import { useFormik } from 'formik';

import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CRow, CCol,
  CForm,
  CFormGroup,
  CInput,
  CFormText
} from '@coreui/react';
import { changeUserInfo } from './Users';

const UserModal = (props) => {
  console.log(props.group)

  const [mess, setMess] = useState('')
  const [selectedOption, setSelectedOption] = useState([])
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
          console.log(mess)
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
                  <CInput id="gender" name="gender" placeholder="Gender(0 or 1)" value={formik.values.gender} onChange={formik.handleChange}/>
                  <p className="text-warning" >{formik.errors.gender?formik.errors.gender:null}</p>
                </CCol>
              </CRow>

              <CRow>
                <CCol>
                  <CInput id="master" name="master" placeholder="Master 0 or 1" value={formik.values.master} onChange={formik.handleChange}/>
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

export default UserModal
