// import join from './components/join'
// import publish from './components/publish'
// import account from './components/account'
// import withdraw from './components/withdraw'
// import records from './components/records'
// import recRecords from './components/records-recharge'
// import receipt from './components/receipt'
// import limitMgr from './components/limitMgr'
// import invoice from './components/invoice'

export default [
  {
    path: '/',
    redirect: '/join'
  },
  {
    path: '/join',
    name: 'join',
    component: resolve => require(['./components/join'], resolve)
  },
  {
    path: '/publish',
    name: 'publish',
    component: resolve => require(['./components/publish'], resolve)
  },
  {
    path: '/account',
    name: 'account',
    component: resolve => require(['./components/account'], resolve)
  },
  {
    path: '/withdraw',
    name: 'withdraw',
    component: resolve => require(['./components/withdraw'], resolve)
  },
  {
    path: '/records',
    name: 'records',
    component: resolve => require(['./components/records'], resolve)
  },
  {
    path: '/recRecords',
    name: 'recRecords',
    component: resolve => require(['./components/records-recharge'], resolve)
  },
  {
    path: '/receipt',
    name: 'receipt',
    component: resolve => require(['./components/receipt'], resolve)
  },
  {
    path: '/limitMgr/:id',
    name: 'limitMgr',
    component: resolve => require(['./components/limitMgr'], resolve)
  },
  {
    path: '/invoice',
    name: 'invoice',
    component: resolve => require(['./components/invoice'], resolve)
  },
  {
    path: '/recharge',
    name: 'recharge',
    component: resolve => require(['./components/recharge'], resolve)
  },
  {
    path: '/taskcheck',
    name: 'taskcheck',
    component: resolve => require(['./components/taskcheck'], resolve)
  }
]
