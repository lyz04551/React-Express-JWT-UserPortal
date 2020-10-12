import React from 'react';

const Professionals = React.lazy(() => import('./views/Professionals'));
const Patients = React.lazy(() => import('./views/Patients'));
const Categories = React.lazy(() => import('./views/Categories'));
const Licenses = React.lazy(() => import('./views/Licenses'));
const Users = React.lazy(() => import('./views/users/Users'));
const UserGroup = React.lazy(() => import('./views/users/UserGroup'));
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/professionals', name: 'Professionals', role:['ROLE_PROF_VIEW','ROLE_PROF_EDIT','ROLE_PROF_VIEW_DATA'] ,component: Professionals},
  { path: '/patients', name: 'Patients', role:['ROLE_TARGET_VIEW','ROLE_TARGET_EDIT','ROLE_TARGET_VIEW_DATA'], component: Patients},
  { path: '/categories', name: 'Categories', role:['ROLE_CAT_VIEW','ROLE_CAT_EDIT'], component: Categories},
  { path: '/licenses', name: 'Licenses', role:['ROLE_LIC_VIEW','ROLE_LIC_EDIT'], component: Licenses},
  { path: '/users', name: 'Users', role:['ROLE_USER_VIEW','ROLE_USER_EDIT'], component: Users},
  { path: '/usergroup', name: 'User Group', role:['ROLE_ROOM_VIEW','ROLE_ROOM_EDIT'], component: UserGroup}
];

export default routes;
