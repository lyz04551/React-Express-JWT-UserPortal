export default [
  {
    _tag: 'CSidebarNavTitle',
    _children: ['']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Professionals',
    to: '/professionals',
    icon: 'cil-people',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Patients',
    to: '/patients',
    icon: 'cil-people'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Categories',
    to: '/categories',
    icon: 'cil-tags'
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Role and Permission'],
    role: 'admin'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Users',
    to: '/users',
    icon: 'cil-people',
    role: 'admin'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'User Group',
    to: '/usergroup',
    icon: 'cil-grid',
    role: 'admin'
  },

  {
    _tag: 'CSidebarNavDivider',
    className: 'm-2'
  }
]

