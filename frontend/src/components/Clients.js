import React        from 'react'
import { connect }  from 'react-redux'
import Client       from './Client'
import ButtonAddClient from './ButtonAddClient'

const Clients = (props) => {
  const clients = props.clients
  
  let row = 0

  return (
    <div className="container">
      <table className="list">
        <thead>
          <tr className="header">
            <th>Client</th>
            <th>Created</th>
            <th>Last updated</th>
          </tr>
        </thead>
        <tbody>
          {clients
            .sort((a, b) => b.name < a.name)
            .map(client => {
              row = row + 1
              return (<Client key={client.id} row={row} client={client} />)
            })
          }
        </tbody>
      </table>
      <ButtonAddClient />
    </div>
  )
}


const mapStateToProps = (state) => {
  return {
    clients: state.clients
  }
}

const mapDispatchToProps = null

const ConnectedClients = connect(mapStateToProps, mapDispatchToProps)(Clients)

export default ConnectedClients
