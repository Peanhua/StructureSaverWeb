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
  changeClientPassword
} from '../reducers/clientsReducer'


const ButtonChangeClientPassword = (props) => {
  const [ password, resetPassword ] = useField('password')
  
  const formRef = React.createRef()

  const user = props.user
  if (!user.is_admin)
    return (<div />)

  const client = props.clients.find((c) => c.id === parseInt(props.id))
  if (client === undefined)
    return (<div />)

  const onChangeClientPassword = async (event) => {
    event.preventDefault()

    if (password.value.length === 0) {
      props.setErrorNotification('Required field password is empty.', 3)
      return
    }

    try {  
      formRef.current.toggleVisibility()

      await props.changeClientPassword(client, password.value)

      props.setNotification(`Changed password for client '${client.client_id}'.`, 3)
      resetPassword()

    } catch (exception) {
      console.log(exception)
      props.setErrorNotification('Something went wrong: ' + exception, 5)
    }
  }
  
  return (
    <Togglable showButtonLabel='Change password' hideButtonLabel='Cancel' ref={formRef}>
      <form onSubmit={onChangeClientPassword} id="changeclientpasswordForm">
        <div>Change password:</div>
        <input id="client_password" {...password} />
        <button form="changeclientpasswordForm" type="submit">Change</button>
      </form>
    </Togglable>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    clients: state.clients
  }
}

const mapDispatchToProps = {
  setNotification,
  setErrorNotification,
  changeClientPassword
}

const ConnectedButtonChangeClientPassword = connect(mapStateToProps, mapDispatchToProps)(ButtonChangeClientPassword)

export default ConnectedButtonChangeClientPassword
