import React                    from 'react'
import { connect }              from 'react-redux'
import { useField }             from '../hooks'
import { loginUser }            from '../reducers/loginReducer'
import { setErrorNotification } from '../reducers/notificationReducer'
import Logo                     from './Logo'

const LoginForm = (props) => {
  const [ username, resetUsername ] = useField('text')
  const [ password, resetPassword ] = useField('password')
  
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      await props.loginUser(username.value, password.value)
      if(false) {
        // This piece of code is left here only for documentation purposes.
        // The following code is not executed, because
        // this component is no longer being rendered after the login succeeds,
        // and thus if we would call the resetX() functions, we would alter the state of an unmounted component.
        resetUsername()
        resetPassword()
      }

    } catch(exception) {
      props.setErrorNotification('Incorrect username or password.', 5)
    }
  }

  const containerStyle = {
    width:  "400px",
    height: "300px"
  }

  const centeredStyle = {
    textAlign: "center"
  }

  const labelStyle = {
    width: "100px"
  }

  const inputStyle = {
    width: "250px"
  }

  return (
    <div className="centered" style={containerStyle}>
      <form onSubmit={handleLogin}>
        <Logo />
        <table>
          <tbody>
            <tr><td style={labelStyle}>User:</td><td><input style={inputStyle} {...username} /></td></tr>
            <tr><td style={labelStyle}>Password:</td><td><input style={inputStyle} {...password} /></td></tr>
          </tbody>
        </table>
        <div style={centeredStyle}><button type="submit" className="big">Login</button></div>
      </form>
    </div>
  )
}


const mapStateToProps = null

const mapDispatchToProps = {
  loginUser,
  setErrorNotification
}

const ConnectedLoginForm = connect(mapStateToProps, mapDispatchToProps)(LoginForm)

export default ConnectedLoginForm
