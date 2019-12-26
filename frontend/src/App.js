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
import Logo                   from './components/Logo'
import Navigation             from './components/Navigation'
import { initializeUsers }    from './reducers/usersReducer'
import { loadUser }           from './reducers/loginReducer'

const App = (props) => {
  useEffect(() => {
    props.loadUser()
    props.initializeUsers()
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
   []
  )
  
  const user = props.user

  const content = () => (
    <div>
      <Logo />
      <Navigation />
      <Route exact path="/users" render={() => <Users />} />
      <Route exact path="/users/:id"
        render={({ match }) => 
          <UserInformation id={match.params.id} />
        }
      />
    </div>
  )
  
  return (
    <BrowserRouter>
      <div>
        <Notification />
        {user === null && <LoginForm />}
        {user !== null && content()}
      </div>
    </BrowserRouter>
  )
}


const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = {
  initializeUsers,
  loadUser,
}

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)

export default ConnectedApp
