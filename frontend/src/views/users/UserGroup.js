import React, {useEffect, useState} from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CDataTable, CRow } from '@coreui/react';
import UserGroupModal from './UserGroupModal';
import CIcon from '@coreui/icons-react';
import { useHistory } from 'react-router-dom';
import axios from '../../services/api';
import CBadgeGroup from './CBadgeGroup';

const UserGroup = () => {
  const fields = ['id', 'name', 'roles', 'action']
  const history = useHistory()
  const [professionalData, setProfessinalData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [status, setStatus] = useState(0)
  const [rowID, setRowID] = useState(null)
  const [role, setRole] = useState([])
  // const [name, setName] = useState('<+>')
  // const [ownRole, setOwnRole] = useState(null)
  const user_info = JSON.parse(localStorage.getItem('user_info'))

  const hanldeShowModal = () => {
    setRowID(null)
    setShowModal(!showModal)
  }

  const addOrEdit = (id) => {
    setRowID(id)
  }

  const deleteRow = (rowID) => {
    axios.delete('/usergroup/' + rowID, {
      headers: {
        authorization: user_info.accessToken
      }
    }).then(res => {
      alert(res.data.message)
      handleAddNew()
    }).catch(err => alert(err.message))
  }

  useEffect(() => {
    async function getUsersGroup() {
      try {
        const res = await axios.get('/usergroup', {
          headers: {
            authorization: user_info.accessToken
          }
        })
        console.log(res.data.group)
        if (res.data.group) {
          setProfessinalData(res.data.group)
          await getRoles()
        } else {
          redirect()
        }
      } catch (e) {
        alert(e.message)
      }
    }
    async function getRoles(){
      try {
        const res = await axios.get('/roles', {
          headers: {
            authorization: user_info.accessToken
          }
        })
        if (res.data.role){
          setRole(res.data.role)
        } else {
          alert(res.data)
          redirect()
        }
      } catch (e) {
        alert(e.message)
      }
    }
    const redirect = () => {
      history.push('/')
      localStorage.removeItem('user_info')
    }
    getUsersGroup()
  }, [status])

  useEffect(() => {
    if (rowID !== null){
      setShowModal(!showModal)
    }
  }, [rowID])

  const handleAddNew = () =>{
    setStatus(status + 1)
  }

  return (
    <>
      <CRow className="justify-content-center">
        <CCol md="12">
          <CCard>
            <CCardHeader >
              <CRow>
                <CCol>
                  <CButton onClick={()=>addOrEdit(-1)} className="px-5" color="info">+ Add New</CButton>
                  <UserGroupModal rowID={rowID} role={role} display={showModal} handleDisplay={hanldeShowModal}  handleAddNew={handleAddNew} />
                </CCol>
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
                  'roles':(item) => (
                    <td>
                      <CBadgeGroup list={item.roles}/>
                    </td>
                  ),
                  'action': (item) => (
                    <td width={102}>
                      <CRow>
                        <CCol>
                          <CButton onClick={(e)=> addOrEdit(item.id)} className={'btn-pill'} size={'sm'} ><CIcon className={'cust_action_edit'} name={'cilPencil'} /></CButton>
                        </CCol>
                        <CCol>
                          {item.id !== 1 ? <CButton onClick={(e) => deleteRow(item.id)}  className={'btn-pill'} size={'sm'} ><CIcon className={'cust_action_delete'} name={'cilTrash'}/></CButton> : null}
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
export default UserGroup
