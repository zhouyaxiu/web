import archives from './components/archives'
import accountSet from './components/accountSet'
import realShow from './components/realShow'
import real from './components/real'

export default [
  {
    path: '/',
    name: 'archives',
    component: archives
  },
  {
    path: '/accountSet',
    name: 'accountSet',
    component: accountSet
  },
  {
    path: '/realShow',
    name: 'realShow',
    component: realShow
  },
  {
    path: '/real',
    name: 'real',
    component: real
  }
]
