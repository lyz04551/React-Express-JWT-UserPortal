import React from 'react';

const Professionals = React.lazy(() => import('./views/Professionals'));
const Patients = React.lazy(() => import('./views/Patients'));
const Categories = React.lazy(() => import('./views/Categories'));
const Users = React.lazy(() => import('./views/users/Users'));
const UserGroup = React.lazy(() => import('./views/users/UserGroup'));
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/professionals', name: 'Professionals', component: Professionals},
  { path: '/patients', name: 'Patients', component: Patients},
  { path: '/categories', name: 'Categories', component: Categories},
  { path: '/users', name: 'Users', component: Users},
  { path: '/usergroup', name: 'User Group', component: UserGroup}
];

export default routes;
