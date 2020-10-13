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

const Category = () =>{
  const history = useHistory()
  const [categoryData, setCategoryData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [status, setStatus] = useState(0)
  const [rowID, setRowID] =useState(null)
  const fields = ['id','name', 'nickname', 'amount_patients', 'amount_suitable_overflow', 'duration_time', 'color', 'deleted', 'fk_license' ,'action']
  const user_info = JSON.parse(localStorage.getItem('user_info'))
  if (user_info) {
    const ownRoles = user_info.user.roles.map(item=> item.nome)
    if (!ownRoles.includes('ROLE_CAT_EDIT')) fields.splice(-1,1)
  }


  const hanldeShowModal = () => {
    setRowID(null)
    setShowModal(!showModal)
  }

  const addOrEdit = (id) => {
    setRowID(id)
  }

  const deleteRow = (rowID) => {
    axios.delete('/categories/' + rowID, {
      headers: {
        authorization: user_info.accessToken
      }
    }).then(res => {
      alert(res.data.message)
      handleAddNew()
    }).catch(err => alert(err.message))
  }

  useEffect( () => {
    async function getPermissions() {
      try {
        const res = await axios.get('/categories', {
          headers: {
            authorization: user_info.accessToken
          }
        })
        if (res.data.category) {
          const val = res.data.category
          setCategoryData(val)
        } else {
          history.push('/login')
          localStorage.removeItem('user_info')
        }
      } catch (err) {
        alert(err.message)
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
            {fields.includes('action')?(
              <CCardHeader >
                <CRow>
                  <CCol>
                    <CButton onClick={()=>addOrEdit(-1)} className="px-5" color="info">+ Add New</CButton>
                    <Modal rowID={rowID}  display={showModal} handleDisplay={hanldeShowModal}  handleAddNew={handleAddNew} />
                  </CCol>
                </CRow>
              </CCardHeader>
            ): null}
            <CCardBody>
              <CDataTable
                items={categoryData}
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
                          <CButton onClick={(e)=> addOrEdit(item.id)} className={'btn-pill'} size={'sm'} ><CIcon className={'cust_action_edit'} name={'cilPencil'} /></CButton>
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
export default Category
