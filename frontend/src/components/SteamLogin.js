import React              from 'react'
import { connect }        from 'react-redux'
import { loginSteamUser } from '../reducers/loginReducer'


const SteamLogin = (props) => {

  props.loginSteamUser(props.location.search)

  return (
    <div>
      Logging in using Steam...
    </div>
  )
}

const mapStateToProps = null

const mapDispatchToProps = {
  loginSteamUser
}

const ConnectedSteamLogin = connect(mapStateToProps, mapDispatchToProps)(SteamLogin)

export default ConnectedSteamLogin
