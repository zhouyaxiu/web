import profile from './components/profile'
import profileForm from './components/profile-form'
import skill from './components/skill'
import skillForm from './components/skill-form'
import real from './components/real'
import realForm from './components/real-form'

export default [
  {
    path: '/',
    name: 'profile',
    component: profile
  },
  {
    path: '/profile',
    name: 'profile',
    component: profile
  },
  {
    path: '/profileForm',
    name: 'profileForm',
    component: profileForm
  },
  {
    path: '/skill',
    name: 'skill',
    component: skill
  },
  {
    path: '/skillForm',
    name: 'skillForm',
    component: skillForm
  },
  {
    path: '/real',
    name: 'real',
    component: real
  },
  {
    path: '/realForm',
    name: 'realForm',
    component: realForm
  }
]
