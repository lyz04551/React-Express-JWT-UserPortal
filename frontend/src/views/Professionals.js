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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import Modal from './Modal'

const Professional = () =>{
  const history = useHistory()
  const [professionalData, setProfessinalData] = useState([])
  const [status, setStatus] = useState(0)
  const fields = ['id','name', 'gender', 'birthday', 'email', 'comment', 'picture', 'deleted', 'fk_license', 'action']
  const user_info = JSON.parse(localStorage.getItem('user_info'))

  useEffect(() => {
       axios.get('/professionals', {
          headers: {
            authorization: user_info.accessToken
          }
        }).then(res => {
          if (res.data.professionals){
            const val = res.data.professionals
            setProfessinalData(val)
          } else {
            history.push('/')
            localStorage.removeItem('user_info')
          }
        }).catch(err => alert(err.message))
  }, [status]);

  function handleAddNew() {
    setStatus(status + 1)
  }

  return (
    <>
      <CRow className="justify-content-center">
        <CCol md="12">
          <CCard>
            <CCardHeader >
              <CRow>
                <CCol><Modal handleAddNew={handleAddNew} /></CCol>
              </CRow>
            </CCardHeader>
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
                  'gender':
                    (item)=>(
                      <td>
                        <CBadge shape={'pill'} color={item.gender === 0? 'info' : 'success'}>
                          {item.gender === 0? "Male" : "Female"}
                        </CBadge>
                      </td>
                    ),
                  'deleted':(item) => (
                     <td><CBadge color={item.deleted === 1? 'danger' : 'warning'}>{item.deleted === 1? 'Deleted': 'Working'}</CBadge></td>
                  ),
                  'action': (item) => (
                    <td width={102}>
                    <CRow>
                      <CCol>
                        <CButton id={item.id} className={'btn-pill'} size={'sm'} ><CIcon className={'cust_action_edit'} name={'cilPencil'} /></CButton>
                      </CCol>
                      <CCol>
                        <CButton id={item.id} className={'btn-pill'} size={'sm'} ><CIcon className={'cust_action_delete'} name={'cilTrash'}/></CButton>
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
export default Professional
