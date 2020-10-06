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
} from '@coreui/react';

const Modal = ({handleAddNew}) => {
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }

  function handleAddNewOne() {
    // console.log("123");
    handleAddNew();
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
    initialValues: {
      name: "",
      gender: 0,
      birthday: "",
      email: "",
      comment: "",
      picture: "",
      deleted: '0',
      fk_license: ""
    },
    validate,
    onSubmit: values => {
      add_new(values)
    }
  })

  async function add_new(values) {
    const user_info = JSON.parse(localStorage.getItem('user_info'))
    if (user_info.user){
      try {
        const response = await axios.post('/professionals', values, {
          headers: {
            authorization: user_info.accessToken
          }
        })
        if (response.data.message === "Success"){
          handleAddNewOne();
          toggle()
        }
      } catch (e) {
        alert(e.message)
      }
    }

  }

  return (
    <>
      <CButton onClick={toggle} className="px-5" color="info">+ Add New</CButton>
      <CModal
        show={modal}
        onClose={toggle}
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
            </CFormGroup>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton onClick={formik.handleSubmit} type="submit" color="info">Submit</CButton>{' '}
          <CButton
            color="secondary"
            onClick={toggle}
          >Cancel</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Modal
