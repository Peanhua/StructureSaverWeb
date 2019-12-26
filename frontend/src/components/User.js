import React       from 'react'
import { connect } from 'react-redux'
import { Link }    from 'react-router-dom'

const User = (props) => {
  const user = props.user
  const cn = props.row % 2 === 0 ? 'even' : 'odd'
  return (
    <tr className={cn}>
      <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
    </tr>
  )
}


const mapStateToProps = null

const mapDispatchToProps = null

const ConnectedUser = connect(mapStateToProps, mapDispatchToProps)(User)

export default ConnectedUser
