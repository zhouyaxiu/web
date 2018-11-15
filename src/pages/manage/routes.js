import data from './components/data'

export default [
  {
    path: '/',
    redirect: '/data'
  },
  {
    path: '/data',
    name: 'data',
    component: data
  }
]
