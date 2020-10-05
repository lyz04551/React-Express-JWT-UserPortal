import React, { useEffect } from 'react'
import axios from '../services/api'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow
} from '@coreui/react'

import usersData from './users/UsersData'

const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}
const fields = ['name','registered', 'role', 'status']
const user_info = JSON.parse(localStorage.getItem('user_info'))
const Professional = () =>{
  useEffect(() => {
    async function getProfessionals() {
      try {
          const response =  await axios.get('/professionals', {
            headers: {
              authorization: user_info.accessToken
            }
          })
        console.log(response)
        if (response.data.professionals){
          return response.data.professionals
        } else
          alert("Backend has any problem!")
      } catch (e) {
        alert(e.message)
      }
    }
    getProfessionals()
  })
  return (
    <>
      <CRow className="justify-content-center">
        <CCol md="8">
          <CCard>
            <CCardHeader>
              Simple Table
            </CCardHeader>
            <CCardBody>
              <CDataTable
                items={usersData}
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
