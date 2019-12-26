import React          from 'react'
import { connect }    from 'react-redux'
import { logoutUser } from '../reducers/loginReducer'

const LoggedUserInformation = (props) => {
  const handleLogoutClick = () => {
    props.logoutUser()
  }

  const usernameStyle = {
    paddingRight: "10px",
    fontSize:     "0.8em"
  }

  const userlabelStyle = {
    fontSize:     "0.7em",
    paddingRight: "5px"
  }

  return (
    <div className="loggedUserInformation">
      <span style={userlabelStyle}>USER:</span>
      <span style={usernameStyle}>{props.user.name}</span>
      <button onClick={handleLogoutClick}>Logout</button>
    </div>
  )
}


const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = {
  logoutUser
}

const ConnectedLoggedUserInformation = connect(mapStateToProps, mapDispatchToProps)(LoggedUserInformation)

export default ConnectedLoggedUserInformation
