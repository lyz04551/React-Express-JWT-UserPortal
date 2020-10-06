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
} from '@coreui/react'

import Modal from './Modal'

const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}
const fields = ['id','name', 'gender', 'birthday', 'email', 'comment', 'picture', 'deleted', 'fk_license']
const user_info = JSON.parse(localStorage.getItem('user_info'))

const Professional = () =>{
  const [professionalData, setProfessinalData] = useState([])
  const history = useHistory()
  useEffect(() => {
    async function getProfessionals() {

          await axios.get('/professionals', {
            headers: {
              authorization: user_info.accessToken
            }
          }).then(res => {
            if (res.data.professionals){
              console.log(res.data.professionals)
              const val = res.data.professionals
              setProfessinalData(val)
            } else {
              history.push('/')
              localStorage.removeItem('user_info')
            }
          }).catch(err => alert(err.message))
    }
    getProfessionals()
  })
  return (
    <>
      <CRow className="justify-content-center">
        <CCol md="8">
          <CCard>
            <CCardHeader >
              <CRow>
                <CCol><Modal /></CCol>
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
                  'status':
                    (item)=>(
                      <td>
                        <CBadge color={getBadge(item.status)}>
                          {item.status}
                        </CBadge>
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
