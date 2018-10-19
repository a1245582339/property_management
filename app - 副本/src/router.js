import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue';

Vue.use(Router);

export default new Router({
  routes: [{
      path: '/',
      redirect: '/main'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/main',
      component: () =>
        import('./views/Main'),
      children: [{
        path: '/',
        redirect: '/main/me'
      }, {
        path: 'room',
        name: 'Room',
        component: () =>
          import('./views/tab/Room'),
        mate: {
          title: '房间信息'
        }
      }, {
        path: 'repair',
        name: 'Repair',
        component: () =>
          import('./views/tab/Repair'),
        mate: {
          title: '维修信息'
        }
      }, {
        path: 'homeOwner',
        name: 'HomeOwner',
        component: () =>
          import('./views/tab/HomeOwner')
      },{
        path: 'homeUser',
        name: 'HomeUser',
        component: () =>
          import('./views/tab/HomeUser')
      }, {
        path: 'me',
        name: 'Me',
        component: () =>
          import('./views/tab/Me')
      }, {
        path: 'partType',
        name: 'PartType',
        component: () =>
          import('./views/tab/PartType')
      }, {
        path: 'part',
        name: 'Part',
        component: () =>
          import('./views/tab/Part')
      }]
    },
    {
      path: '/userDetail',
      name: 'userDetail',
      component: () =>
        import('./views/userDetail'),
    },
    {
      path: '/repairDetail',
      name: 'repairDetail',
      component: () =>
        import('./views/repairDetail'),
    },
    {
      path: '/createRepair',
      name: 'createRepair',
      component: () =>
        import('./views/createRepair'),
    }
  ],
});