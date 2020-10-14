import React, {useEffect,useState} from 'react'
import Select from 'react-select';
import axios from '../../services/api'
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
  CFormText,
} from '@coreui/react';

const UserGroupModal = (props) => {
  const [mess, setMess] = useState('')
  const [selectedOption, setSelectedOption] = useState([]);

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
      let response = null
      try {
        if (props.rowID === -1){
          response = await axios.post('/usergroup', values, {
            headers: {
              authorization: user_info.accessToken
            }
          })
        }
        if (props.rowID >= 0) {
          response = await axios.put('/usergroup/' + props.rowID, values, {
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

export default UserGroupModal
