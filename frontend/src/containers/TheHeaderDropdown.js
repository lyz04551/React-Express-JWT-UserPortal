import React from 'react'
import { useHistory } from 'react-router-dom'
import axios from '../services/api'

import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import CIcon from '@coreui/icons-react'

const TheHeaderDropdown = () => {
  const history = useHistory()
  const user_info = JSON.parse(localStorage.getItem('user_info'))
  async function logout() {
    try {
      localStorage.removeItem('user_info')
      await axios.post('/logout', { token: user_info.accessToken })
      history.push('/login')
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <CDropdown
      inNav
      className="c-header-nav-items mr-5"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar cil-vertical-align-center ">
          <label className="pr-2">{user_info?user_info.user.NAME:null}</label>
          <label><CIcon size={'xl'} name={'cilUser'} /></label>
          {/*<CImg*/}
          {/*  src={'avatars/6.jpg'}*/}
          {/*  className="c-avatar-img"*/}
          {/*  alt="admin@bootstrapmaster.com"*/}
          {/*/>*/}
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem
          header
          tag="div"
          color="light"
          className="text-center"
        >
        </CDropdownItem>
        <CDropdownItem divider />
        <CDropdownItem onClick={logout}>
          <CIcon name="cil-lock-locked" className="mfe-2"/>
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdown
