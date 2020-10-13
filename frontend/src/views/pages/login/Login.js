import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from '../../../services/api'
import { useFormik } from 'formik';

const Login = () => {
  const [message, setMessage] = useState("")
  const history = useHistory()

  const validate = values => {
    const errors = {};
    if (!values.password) {
      errors.password = 'Required';
    }

    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validate,
    onSubmit: values => {
      user_login(values)
    }
  })

  async function user_login(values) {
    try {
      const response = await axios.post('/login', { email: values.email, pass: values.password })
      if (response.data.user){
        localStorage.setItem('user_info', JSON.stringify(response.data))
        console.log(JSON.parse(localStorage.getItem('user_info')))
        history.push('/')
      } else {
        setMessage(response.data.message)
      }
    } catch(e){
      alert(e.message)
    }
  }

  useEffect(() => {
    if (localStorage.getItem('user_info')){
      history.push('/')
    }
  },[])

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={formik.handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <p className="text-danger">{message}</p>
                    <p className="text-warning field_validate_label" >{formik.errors.email?formik.errors.email:null}</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>

                      <CInput id="email" name="email" type="email" placeholder="Email" autoComplete="username" value={formik.values.email} onChange={formik.handleChange}  />
                    </CInputGroup>

                    <p className="text-warning field_validate_label" >{formik.errors.password?formik.errors.password:null}</p>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput id="password" name="password" type="password" placeholder="Password" autoComplete="current-password" value={formik.values.password} onChange={formik.handleChange}  />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton type="submit" color="primary" className="px-4">Login</CButton>
                      </CCol>
                      <CCol xs="6" className="text-right">
                        <CButton color="link" className="px-0">Forgot password?</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.</p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>Register Now!</CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
