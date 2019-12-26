import React from 'react'
import { connect } from 'react-redux'

const Notification = (props) => {
  const message = props.notification.message
  const type    = props.notification.messageType

  if(message === undefined) {
    return null
  }

  const cn = `${type}Notification`

  return (
    <div className={cn}>{message}</div>
  )
}


const mapStateToProps = (state) => {
  return {
    notification: state.notification
  }
}

const mapDispatchToProps = null

const ConnectedNotification = connect(mapStateToProps, mapDispatchToProps)(Notification)

export default ConnectedNotification
