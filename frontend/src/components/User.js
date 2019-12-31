import React       from 'react'
import { connect } from 'react-redux'
import { Link }    from 'react-router-dom'

const User = (props) => {
  const user = props.user
  const cn = props.row % 2 === 0 ? 'even' : 'odd'
  return (
    <tr className={cn}>
      <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
      <td>{user.steam_id}</td>
      <td>{user.is_admin ? 'Yes' : 'No'}</td>
      <td>{user.createdAt}</td>
      <td>{user.updatedAt}</td>
    </tr>
  )
}


const mapStateToProps = null

const mapDispatchToProps = null

const ConnectedUser = connect(mapStateToProps, mapDispatchToProps)(User)

export default ConnectedUser
