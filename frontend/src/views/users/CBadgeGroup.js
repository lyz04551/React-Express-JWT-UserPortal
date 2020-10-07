import React from 'react'
import { CBadge} from '@coreui/react';

const CBadgeGroup = (props) => {
  const list = props.list.split(',')
  return (
    <>
      {list.length > 0 && list.map(item => <CBadge color={'dark'} shape={'pill'}>{item}</CBadge>)}
    </>
  )
}
export default CBadgeGroup
