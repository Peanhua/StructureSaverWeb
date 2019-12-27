import React  from 'react'
import {
  Link,
  withRouter
} from 'react-router-dom'
import LoggedUserInformation  from './LoggedUserInformation'

const Navigation = (props) => {
  const loc = props.location.pathname
  let cnPlans = 'navitem'
  let cnUsers = 'navitem'
  if (loc.startsWith('/plans')) {
    cnPlans += 'Active'
  } else if (loc.startsWith('/users')) {
    cnUsers += 'Active'
  }

  return (
    <div className="navbar">
      <Link to="/plans"><span className={cnPlans}>PLANS</span></Link>
      <Link to="/users"><span className={cnUsers}>USERS</span></Link>
      <LoggedUserInformation />
    </div>
  )
}
const RoutedNavigation = withRouter(Navigation)

export default RoutedNavigation
