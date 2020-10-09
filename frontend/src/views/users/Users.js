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
  const fields = ['id','name', 'username', 'email', 'pass', 'initcode', 'cpf', 'birthday', 'gender', 'master', 'active', 'fk_professional', 'fk_license', 'deleted', 'creation_timestamp', 'action']
  const user_info = JSON.parse(localStorage.getItem('user_info'))
  const hanldeShowModal = () => {
    console.log('adsfadsfadfadsf')
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
    axios.get('/', {
      headers: {
        authorization: user_info.accessToken
      }
    }).then(res => {
      console.log(res)
      if (res.data.users) {
        setProfessinalData(res.data.users)
      } else {
        history.push('/')
        localStorage.removeItem('user_info')
      }
    }).catch(err => alert(err.message))
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
            <CCardHeader >
              <CRow>
                <CCol>
                  <CButton onClick={()=>addOrEdit(-1)} className="px-5" color="info">+ Add New</CButton>
                  <UserModal rowID={rowID}  display={showModal} handleDisplay={hanldeShowModal}  handleAddNew={handleAddNew} />
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
