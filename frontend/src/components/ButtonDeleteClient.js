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
  deleteClient
} from '../reducers/clientsReducer'


const ButtonDeleteClient = (props) => {
  const deleteclientFormRef = React.createRef()

  const user = props.user
  if (!user.is_admin)
    return (<div />)

  const deleteclient = props.clients.find((client) => client.id === parseInt(props.id))
  if (deleteclient === undefined)
    return (<div />)
  
  const onDeleteClient = async (event) => {
    event.preventDefault()

    try {
      deleteclientFormRef.current.toggleVisibility()

      await props.deleteClient(deleteclient)

      props.setNotification(`Client '${deleteclient.client_id}' was deleted.`, 5)

    } catch (exception) {
      console.log(exception)
      props.setErrorNotification('Something went wrong: ' + exception, 5)
    }
  }
  
  return (
    <Togglable showButtonLabel='Delete client' hideButtonLabel='Cancel' ref={deleteclientFormRef}>
      <form onSubmit={onDeleteClient} id="deleteclientForm">
        <div>Confirm delete:</div>
        <button form="deleteclientForm" type="submit">Delete</button>
      </form>
    </Togglable>
  )
}

const mapStateToProps = (state) => {
  return {
    user:    state.user.user,
    clients: state.clients
  }
}

const mapDispatchToProps = {
  setNotification,
  setErrorNotification,
  deleteClient
}

const ConnectedButtonDeleteClient = connect(mapStateToProps, mapDispatchToProps)(ButtonDeleteClient)

export default ConnectedButtonDeleteClient
