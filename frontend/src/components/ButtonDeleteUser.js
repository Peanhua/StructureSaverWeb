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
  deleteUser
} from '../reducers/usersReducer'


const ButtonDeleteUser = (props) => {
  const deleteuserFormRef = React.createRef()

  const user = props.user
  if (!user.is_admin)
    return (<div />)

  const deleteuser = props.users.find((u) => u.id === parseInt(props.id))
  if (deleteuser === undefined)
    return (<div />)
  
  const onDeleteUser = async (event) => {
    event.preventDefault()

    try {
      deleteuserFormRef.current.toggleVisibility()

      await props.deleteUser(deleteuser)

      props.setNotification(`User '${deleteuser.name}' was deleted.`, 5)

    } catch (exception) {
      console.log(exception)
      props.setErrorNotification('Something went wrong: ' + exception, 5)
    }
  }
  
  return (
    <Togglable showButtonLabel='Delete user' hideButtonLabel='Cancel' ref={deleteuserFormRef}>
      <form onSubmit={onDeleteUser} id="deleteuserForm">
        <div>Confirm delete:</div>
        <button form="deleteuserForm" type="submit">Delete</button>
      </form>
    </Togglable>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    users: state.users
  }
}

const mapDispatchToProps = {
  setNotification,
  setErrorNotification,
  deleteUser
}

const ConnectedButtonDeleteUser = connect(mapStateToProps, mapDispatchToProps)(ButtonDeleteUser)

export default ConnectedButtonDeleteUser
