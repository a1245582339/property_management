import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/', redirect: '/main' },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/Register'),
    },
    {
      path: '/main',
      component: () => import('./views/Main'),
      children: [{
        path: '/', 
        redirect: '/main/room'
      },{
        path: 'room',
        name: 'room',
        component: () => import('./views/tab/Room')
      },{
        path: 'repair',
        name: 'repair',
        component: () => import('./views/tab/Repair')
      },{
        path: 'homeUser',
        name: 'homeUser',
        component: () => import('./views/tab/HomeUser')
      },{
        path: 'me',
        name: 'me',
        component: () => import('./views/tab/Me')
      }]
    },
    {
      path: '/userDetail',
      name: 'userDetail',
      component:  () => import('./views/userDetail'),
    },
    {
      path: '/repairDetail',
      name: 'repairDetail',
      component:  () => import('./views/repairDetail'),
    },
    {
      path: '/createRepair',
      name: 'createRepair',
      component:  () => import('./views/createRepair'),
    }
  ],
});
