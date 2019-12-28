import React        from 'react'
import { connect }  from 'react-redux'

const ClientInformation = (props) => {
  const client = props.clients.find((u) => u.id === parseInt(props.id))

  if(client === undefined) {
    return null
  }
  
  return (
    <div className="detailContainer">
      <div className="header">{client.client_id}</div>
      <div className="line">Id: {client.id}</div>
      <div className="line">Created: {client.createdAt}</div>
      <div className="line">Updated: {client.updatedAt}</div>
    </div>
  )
}


const mapStateToProps = (state) => {
  return {
    clients: state.clients
  }
}

const mapDispatchToProps = null

const ConnectedClientInformation = connect(mapStateToProps, mapDispatchToProps)(ClientInformation)

export default ConnectedClientInformation
