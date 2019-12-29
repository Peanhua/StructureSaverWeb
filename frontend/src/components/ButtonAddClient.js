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
  addClient
} from '../reducers/clientsReducer'


const ButtonAddClient = (props) => {
  const [ client_id, resetClientId ] = useField('text')
  const [ password,  resetPassword ] = useField('password')

  const newclientFormRef = React.createRef()
  
  const onAddClient = async (event) => {
    event.preventDefault()

    if (client_id.value.length === 0) {
      props.setErrorNotification('Required field clientname is empty.', 3)
      return
    }
    if (password.value.length === 0) {
      props.setErrorNotification('Required field password is empty.', 3)
      return
    }

    const newClient = {
      client_id: client_id.value,
      password:  password.value
    }

    try {
      newclientFormRef.current.toggleVisibility()

      await props.addClient(newClient)

      props.setNotification(`New client '${newClient.client_id}' was added.`, 5)
      resetClientId()
      resetPassword()

    } catch (exception) {
      console.log(exception)
      props.setErrorNotification('Something went wrong: ' + exception, 5)
    }
  }
  
  return (
    <Togglable showButtonLabel='Add new client' hideButtonLabel='Cancel' ref={newclientFormRef}>
      <form onSubmit={onAddClient} id="newclientForm">
        <div>Add new client:</div>
        <label htmlFor="newclient_client_id">Client id:</label>
        <input id="newclient_client_id" {...client_id} />
        <label htmlFor="newclient_password">Password:</label>
        <input type="password" id="newclient_password" {...password} />
        <span className="spacer" />
        <button form="newclientForm" type="submit">Add</button>
      </form>
    </Togglable>
  )
}

const mapStateToProps = null

const mapDispatchToProps = {
  setNotification,
  setErrorNotification,
  addClient
}

const ConnectedButtonAddClient = connect(mapStateToProps, mapDispatchToProps)(ButtonAddClient)

export default ConnectedButtonAddClient
