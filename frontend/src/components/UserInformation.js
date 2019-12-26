import React        from 'react'
import { connect }  from 'react-redux'

const UserInformation = (props) => {
  const user = props.users.find((u) => u.id === props.id)
  
  if(user === undefined) {
    return null
  }
  
  return (
    <div className="detailContainer">
      <div className="header">{user.name}</div>
    </div>
  )
}


const mapStateToProps = (state) => {
  return {
    users: state.users
  }
}

const mapDispatchToProps = null

const ConnectedUserInformation = connect(mapStateToProps, mapDispatchToProps)(UserInformation)

export default ConnectedUserInformation
