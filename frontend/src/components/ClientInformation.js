import React              from 'react'
import { connect }        from 'react-redux'
import Spacer             from './Spacer'
import ButtonDeleteClient from './ButtonDeleteClient'

const ClientInformation = (props) => {
  const client = props.clients.find((u) => u.id === parseInt(props.id))

  if(client === undefined) {
    return null
  }
  
  return (
    <div className="detailContainer">
      <div className="header">{client.client_id}</div>
      <Spacer />
      <div className="line">Database Id: {client.id}</div>
      <div className="line">Added to database: {client.createdAt}</div>
      <div className="line">Last database update: {client.updatedAt}</div>
      <Spacer />
      <ButtonDeleteClient id={client.id} />
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
