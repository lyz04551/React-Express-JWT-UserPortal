import React from 'react';

const Professionals = React.lazy(() => import('./views/Professionals'));
const Patients = React.lazy(() => import('./views/Patients'));
const Categories = React.lazy(() => import('./views/Categories'));
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/professionals', name: 'Professionals', component: Professionals},
  { path: '/patients', name: 'Patients', component: Patients},
  { path: '/categories', name: 'Categories', component: Categories},
];

export default routes;
