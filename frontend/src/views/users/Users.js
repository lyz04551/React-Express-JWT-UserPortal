import React, {useState, useEffect} from 'react'
import { CBadge, CButton, CCard, CCardBody, CCardHeader, CCol, CDataTable, CRow } from '@coreui/react';
import UserModal from './UserModal';
import CIcon from '@coreui/icons-react';
import axios from '../../services/api';
import { useHistory } from 'react-router-dom';

const Users = () => {
  const history = useHistory()
  const [professionalData, setProfessinalData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [status, setStatus] = useState(0)
  const [rowID, setRowID] =useState(null)
  const [group, setGroup] = useState([])
  const fields = ['id','name', 'username','user_group', 'email', 'initcode', 'cpf', 'birthday', 'gender', 'master', 'active', 'fk_professional', 'fk_license', 'deleted', 'creation_timestamp', 'action']
  const user_info = JSON.parse(localStorage.getItem('user_info'))
  if (user_info) {
    const ownRoles = user_info.user.roles.map(item=> item.nome)
    if (!ownRoles.includes('ROLE_LIC_EDIT')) fields.splice(-1,1)
  }

  const hanldeShowModal = () => {
    setRowID(null)
    setShowModal(!showModal)
  }

  const addOrEdit = (id) => {
    setRowID(id)
  }

  const deleteRow = (rowID) => {
    axios.delete('/' + rowID, {
      headers: {
        authorization: user_info.accessToken
      }
    }).then(res => {
      alert(res.data.message)
      handleAddNew()
    }).catch(err => alert(err.message))
  }

  useEffect(() => {
      async function getAllUser(){
       try {
         const res = await axios.get('/', {
           headers: {
             authorization: user_info.accessToken
           }
         })
         if (res.data.users) {
           setProfessinalData(res.data.users)
           await getGroups()
         } else redirect()
       } catch (err) {
         alert(err.message)
       }}

       async function getGroups(){
        try {
          const res = await axios.get('/usergroup-list', {
            headers: {
              authorization: user_info.accessToken
            }
          })
          if (res.data.group) {
            setGroup(res.data.group)
          } else {
            redirect();
          }
        } catch (e) {
          alert(e.message)
        }
       }
       const redirect = () => {
          history.push('/login')
          localStorage.removeItem('user_info')
        }
    getAllUser()
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
            {fields.includes('action')&&(
              <CCardHeader >
                <CRow>
                  <CCol>
                    <CButton onClick={()=>addOrEdit(-1)} className="px-5" color="info">+ Add New</CButton>
                    <UserModal rowID={rowID} group={group}  display={showModal} handleDisplay={hanldeShowModal}  handleAddNew={handleAddNew} />
                  </CCol>
                </CRow>
              </CCardHeader>
            )}
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
                  'user_group': (item) => (
                    <td>
                      <CBadge shape={'pill'}>
                        {item.user_group}
                      </CBadge>
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

export default Users
