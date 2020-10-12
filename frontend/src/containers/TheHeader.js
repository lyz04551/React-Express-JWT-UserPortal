import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CSubheader,
  CBreadcrumbRouter,
  CTooltip
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

// routes config
import routes from '../routes'

import {
  TheHeaderDropdown,
}  from './index'

const TheHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector(state => state.sidebarShow)

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  const user_info = JSON.parse(localStorage.getItem('user_info'))
  const roles = user_info.user.roles.map(item => item.nome)
  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderBrand className="mx-auto d-lg-none" to="/">
        <CIcon name="logo" height="48" alt="Logo"/>
      </CHeaderBrand>

      <CHeaderNav className="d-md-down-none mr-auto">
        {roles.includes('ROLE_PROF_VIEW')? (
            <CTooltip content={'Professionals'} >
            <CHeaderNavItem className="px-3" >
              <CHeaderNavLink to="/professionals">
                <CIcon name={'cilPeople'}  />
              </CHeaderNavLink>
            </CHeaderNavItem>
            </CTooltip>
          ) : null}
        {roles.includes('ROLE_TARGET_VIEW')? (
          <CTooltip content={'Patients'}  style={roles.includes('ROLE_TARGET_VIEW')? 'display=block' : 'display=none'}>
            <CHeaderNavItem  className="px-3">
              <CHeaderNavLink to="/patients"><CIcon name={'cilPeople'} /></CHeaderNavLink>
            </CHeaderNavItem>
          </CTooltip>
        ): null}
        {roles.includes('ROLE_CAT_VIEW') ? (
          <CTooltip content={'Categories'}  style={roles.includes('ROLE_CAT_VIEW')? 'display=block' : 'display=none'}>
            <CHeaderNavItem className="px-3">
              <CHeaderNavLink to="/categories"><CIcon name={'cilTags'} /></CHeaderNavLink>
            </CHeaderNavItem>
          </CTooltip>
        ): null}
        {roles.includes('ROLE_LIC_VIEW') ? (
          <CTooltip content={'Licenses'}  style={roles.includes('ROLE_LIC_VIEW')? 'display=block' : 'display=none'}>
            <CHeaderNavItem className="px-3">
              <CHeaderNavLink to="/licenses"><CIcon name={'cilTask'} /></CHeaderNavLink>
            </CHeaderNavItem>
          </CTooltip>
        ): null}

      </CHeaderNav>

      <CHeaderNav className="px-3">
        <TheHeaderDropdown/>
      </CHeaderNav>

      <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter
          className="border-0 c-subheader-nav m-0 px-0 px-md-3"
          routes={routes}
        />
      </CSubheader>
    </CHeader>
  )
}

export default TheHeader
