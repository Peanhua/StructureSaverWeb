import React from 'react'

import {
  connect
} from 'react-redux'

import {
  setNotification,
  setErrorNotification
} from '../reducers/notificationReducer'

import Togglable from './Togglable'

import {
  useField
} from '../hooks'

import {
  changeUserPassword
} from '../reducers/usersReducer'


const ButtonChangeUserPassword = (props) => {
  const [ password, resetPassword ] = useField('password')
  
  const formRef = React.createRef()

  const user = props.user
  if (!user.is_admin)
    return (<div />)

  const targetuser = props.users.find((c) => c.id === parseInt(props.id))
  if (targetuser === undefined)
    return (<div />)

  const onChangeUserPassword = async (event) => {
    event.preventDefault()

    if (password.value.length === 0) {
      props.setErrorNotification('Required field password is empty.', 3)
      return
    }

    try {  
      formRef.current.toggleVisibility()

      await props.changeUserPassword(targetuser, password.value)

      props.setNotification(`Changed password for user '${targetuser.name}'.`, 3)
      resetPassword()

    } catch (exception) {
      console.log(exception)
      props.setErrorNotification('Something went wrong: ' + exception, 5)
    }
  }
  
  return (
    <Togglable showButtonLabel='Change password' hideButtonLabel='Cancel' ref={formRef}>
      <form onSubmit={onChangeUserPassword} id="changeuserpasswordForm">
        <div>Change password:</div>
        <input id="user_password" {...password} />
        <button form="changeuserpasswordForm" type="submit">Change</button>
      </form>
    </Togglable>
  )
}

const mapStateToProps = (state) => {
  return {
    user:  state.user.user,
    users: state.users
  }
}

const mapDispatchToProps = {
  setNotification,
  setErrorNotification,
  changeUserPassword
}

const ConnectedButtonChangeUserPassword = connect(mapStateToProps, mapDispatchToProps)(ButtonChangeUserPassword)

export default ConnectedButtonChangeUserPassword
