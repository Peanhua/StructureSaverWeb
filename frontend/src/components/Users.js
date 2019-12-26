import React        from 'react'
import { connect }  from 'react-redux'
import User         from './User'


const Users = (props) => {
  const users = props.users
  
  let row = 0

  return (
    <div className="container">
      <table className="list">
        <thead>
          <tr className="header"><th>User</th></tr>
        </thead>
        <tbody>
          {users
            .sort((a, b) => b.name < a.name)
            .map(user => {
              row = row + 1
              return (<User key={user.id} row={row} user={user} />)
            })
          }
        </tbody>
      </table>
    </div>
  )
}


const mapStateToProps = (state) => {
  return {
    users: state.users
  }
}

const mapDispatchToProps = null

const ConnectedUsers = connect(mapStateToProps, mapDispatchToProps)(Users)

export default ConnectedUsers