import SlotList from '../components/slot/List'
import SlotCreate from '../components/slot/Create'
import SlotUpdate from '../components/slot/Update'
import SlotShow from '../components/slot/Show'

export default [
  { name: 'SlotList', path: '/slots/', component: SlotList },
  { name: 'SlotCreate', path: '/slots/create', component: SlotCreate },
  { name: 'SlotUpdate', path: '/slots/edit/:id', component: SlotUpdate },
  { name: 'SlotShow', path: '/slots/show/:id', component: SlotShow }
]
