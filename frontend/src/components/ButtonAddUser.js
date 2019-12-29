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
  addUser
} from '../reducers/usersReducer'


const ButtonAddUser = (props) => {
  const [ username, resetUsername ] = useField('text')
  const [ password, resetPassword ] = useField('password')
  const [ name,     resetName     ] = useField('name')
  const [ isAdmin,  resetIsAdmin  ] = useField('checkbox')

  const newuserFormRef = React.createRef()

  const user = props.user
  if (!user.is_admin)
    return (<div />)
  
  const onAddUser = async (event) => {
    event.preventDefault()

    if (username.value.length === 0) {
      props.setErrorNotification('Required field username is empty.', 3)
      return
    }
    if (password.value.length === 0) {
      props.setErrorNotification('Required field password is empty.', 3)
      return
    }
    if (name.value.length === 0) {
      props.setErrorNotification('Required field name is empty.', 3)
      return
    }

    const newUser = {
      username: username.value,
      password: password.value,
      name:     name.value,
      is_admin: false
    }

    try {
      newuserFormRef.current.toggleVisibility()

      await props.addUser(newUser)

      props.setNotification(`New user '${newUser.name}' was added.`, 5)
      resetUsername()
      resetPassword()
      resetName()
      resetIsAdmin()

    } catch (exception) {
      console.log(exception)
      props.setErrorNotification('Something went wrong: ' + exception, 5)
    }
  }
  
  return (
    <Togglable showButtonLabel='Add new user' hideButtonLabel='Cancel' ref={newuserFormRef}>
      <form onSubmit={onAddUser} id="newuserForm">
        <div>Add new user:</div>
        <label htmlFor="newuser_username">Username:</label>
        <input id="newuser_username" {...username} />
        <label htmlFor="newuser_password">Password:</label>
        <input type="password" id="newuser_password" {...password} />
        <label htmlFor="newuser_name">Name:</label>
        <input id="newuser_name" {...name} />
        <span className="spacer" />
        <button form="newuserForm" type="submit">Add</button>
      </form>
    </Togglable>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = {
  setNotification,
  setErrorNotification,
  addUser
}

const ConnectedButtonAddUser = connect(mapStateToProps, mapDispatchToProps)(ButtonAddUser)

export default ConnectedButtonAddUser
