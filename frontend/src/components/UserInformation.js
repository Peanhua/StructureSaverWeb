import React            from 'react'
import { connect }      from 'react-redux'
import Spacer           from './Spacer'
import ButtonDeleteUser from './ButtonDeleteUser'
import ButtonChangeUserPassword from './ButtonChangeUserPassword'

const UserInformation = (props) => {
  const user = props.users.find((u) => u.id === parseInt(props.id))

  if(user === undefined) {
    return null
  }
  
  return (
    <div className="detailContainer">
      <div className="header">{user.name}</div>
      <div className="line">Steam id: {user.steam_id}</div>
      <div className="line">Is admin? {user.is_admin ? 'Yes' : 'No'}</div>
      <ButtonChangeUserPassword id={user.id} />
      <Spacer />
      <div className="line">Database id: {user.id}</div>
      <div className="line">Added to database: {user.createdAt}</div>
      <div className="line">Last database update: {user.updatedAt}</div>
      <Spacer />
      <ButtonDeleteUser id={user.id} />
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
