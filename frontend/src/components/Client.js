import React       from 'react'
import { connect } from 'react-redux'
import { Link }    from 'react-router-dom'

const Client = (props) => {
  const client = props.client
  const cn = props.row % 2 === 0 ? 'even' : 'odd'
  console.log(client)
  return (
    <tr className={cn}>
      <td><Link to={`/clients/${client.id}`}>{client.client_id}</Link></td>
      <td>{client.createdAt}</td>
      <td>{client.updatedAt}</td>
    </tr>
  )
}


const mapStateToProps = null

const mapDispatchToProps = null

const ConnectedClient = connect(mapStateToProps, mapDispatchToProps)(Client)

export default ConnectedClient
