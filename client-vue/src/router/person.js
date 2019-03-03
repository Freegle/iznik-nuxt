import PersonList from '../components/person/List'
import PersonCreate from '../components/person/Create'
import PersonUpdate from '../components/person/Update'
import PersonShow from '../components/person/Show'

export default [
  { name: 'PersonList', path: '/people/', component: PersonList },
  { name: 'PersonCreate', path: '/people/create', component: PersonCreate },
  { name: 'PersonUpdate', path: '/people/edit/:id', component: PersonUpdate },
  { name: 'PersonShow', path: '/people/show/:id', component: PersonShow }
]
