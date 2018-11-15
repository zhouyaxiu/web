import register from './components/register'
import bind from './components/bind'

export default [
  {
    path: '/',
    redirect: '/register'
  },
  {
    path: '/register',
    name: 'register',
    component: register
  },
  {
    path: '/bind',
    name: 'bind',
    component: bind
  }
]
