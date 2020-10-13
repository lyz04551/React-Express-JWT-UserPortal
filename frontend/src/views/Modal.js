import React, {useState} from 'react'
import axios from '../services/api'
import { useFormik } from 'formik';

import {
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
  CFormText
} from '@coreui/react';
import api from '../services/api';
import { CrossIcon } from 'react-select/src/components/indicators';

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
  let formik = useFormik({
        enableReinitialize: true,
        initialValues: {
          name: rowData.name || '',
          deleted: rowData.deleted || '',
          fk_license: rowData.fk_license || '',
          nickname: rowData.nickname || '',
          amount_patients: rowData.amount_patients || '',
          amount_suitable_overflow: rowData.amount_suitable_overflow || '',
          duration_time: rowData.duration_time || '',
          color: rowData.color||'',
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
                    <CInput id="gender" name="gender" placeholder="Gender" value={formik.values.gender} onChange={formik.handleChange}/>
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
                    <CInput id="birthday" name="birthday" placeholder="Birthday" value={formik.values.birthday} onChange={formik.handleChange} />
                    <p className="text-warning" >{formik.errors.birthday?formik.errors.birthday:null}</p>
                  </CCol>
                  <CCol>
                    <CInput id="comment" name="comment" placeholder="Comment" value={formik.values.comment} onChange={formik.handleChange}/>
                  </CCol>
                  <CCol>
                    <CInput id="fk_license" name="fk_license" placeholder="Fk License" value={formik.values.fk_license} onChange={formik.handleChange}/>
                  </CCol>
                  <CCol>
                    <CInputFile id="picture" name="picture" value={formik.values.picture} onChange={formik.handleChange}/>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CInput id="occupation" name="occupation" placeholder="Occupation" value={formik.values.occupation} onChange={formik.handleChange} />
                    <p className="text-warning" >{formik.errors.occupation?formik.errors.occupation:null}</p>
                  </CCol>
                  <CCol>
                    <CInput id="deleted" name="deleted" placeholder="Deleted" value={formik.values.deleted} onChange={formik.handleChange} />
                    <p className="text-warning" >{formik.errors.deleted?formik.errors.deleted:null}</p>
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

export default Modal
