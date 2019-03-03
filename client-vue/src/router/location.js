import LocationList from '../components/location/List'
import LocationCreate from '../components/location/Create'
import LocationUpdate from '../components/location/Update'
import LocationShow from '../components/location/Show'

export default [
  { name: 'LocationList', path: '/locations/', component: LocationList },
  { name: 'LocationCreate', path: '/locations/create', component: LocationCreate },
  { name: 'LocationUpdate', path: '/locations/edit/:id', component: LocationUpdate },
  { name: 'LocationShow', path: '/locations/show/:id', component: LocationShow }
]
