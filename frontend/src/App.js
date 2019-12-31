import React, { useEffect }   from 'react'
import { connect }            from 'react-redux'
import {
  BrowserRouter,
  Route
} from 'react-router-dom'
import Notification           from './components/Notification'
import LoginForm              from './components/LoginForm'
import Users                  from './components/Users'
import UserInformation        from './components/UserInformation'
import Plans                  from './components/Plans'
import PlanInformation        from './components/PlanInformation'
import Clients                from './components/Clients'
import ClientInformation      from './components/ClientInformation'
import Logo                   from './components/Logo'
import Navigation             from './components/Navigation'
import SteamLogin             from './components/SteamLogin'
import { initializeUsers }    from './reducers/usersReducer'
import { initializePlans }    from './reducers/plansReducer'
import { initializeClients }  from './reducers/clientsReducer'
import {
  loadUser,
  initializeSteamAuth
} from './reducers/loginReducer'


const App = (props) => {
  useEffect(() => {
    props.loadUser()
    props.initializeSteamAuth()
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
   []
  )

  useEffect(() => {
    props.initializeUsers()
    props.initializePlans()
    props.initializeClients()
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
   [props.user]
  )

  const user = props.user

  if (user === null)
    return (
      <BrowserRouter>
        <Route exact path="/steamLogin" component={SteamLogin} />
        <div>
          <Notification />
          <LoginForm />
        </div>
      </BrowserRouter>
    )
  
  else
    
    return (
      <BrowserRouter>
        <div>
          <Notification />
          <div>
            <Logo />
            <Navigation />
            <Route exact path="/plans" render={() => <Plans />} />
            <Route exact path="/plans/:id"
                   render={({ match }) => 
                           <PlanInformation id={match.params.id} />
                          }
            />
            <Route exact path="/users" render={() => <Users />} />
            <Route exact path="/users/:id"
                   render={({ match }) => 
                           <UserInformation id={match.params.id} />
                          }
            />
            <Route exact path="/clients" render={() => <Clients />} />
            <Route exact path="/clients/:id"
                   render={({ match }) => 
                           <ClientInformation id={match.params.id} />
                          }
            />
          </div>
        </div>
      </BrowserRouter>
    )
}


const mapStateToProps = (state) => {
  return {
    user: state.user.user
  }
}

const mapDispatchToProps = {
  initializeUsers,
  initializePlans,
  initializeClients,
  loadUser,
  initializeSteamAuth
}

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)

export default ConnectedApp
