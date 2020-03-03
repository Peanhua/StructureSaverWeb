import React            from 'react'
import { connect }      from 'react-redux'
import {
  setNotification,
  setErrorNotification
} from '../reducers/notificationReducer'
import Spacer           from './Spacer'
import ButtonDeleteUser from './ButtonDeleteUser'
import ButtonChangeUserPassword from './ButtonChangeUserPassword'
import {
  useField
} from '../hooks'
import {
  updateUser
} from '../reducers/usersReducer'


const UserInformation = (props) => {
  const [ name,    resetName,    setName    ] = useField('text')
  const [ steamId, resetSteamId, setSteamId ] = useField('text')
  const [ isAdmin, resetIsAdmin, setIsAdmin ] = useField('checkbox')

  const user = props.users.find((u) => u.id === parseInt(props.id))

  React.useEffect(() => {
    if (user !== undefined) {
      setName(user.name)
      if( user.steam_id !== null)
        setSteamId(user.steam_id)
      setIsAdmin(user.is_admin)
    }
  }, [user, setName, setSteamId, setIsAdmin])
  
  if (!props.user.is_admin)
    return (<div />)

  if(user === undefined) {
    return null
  }

  const nullifyEmptyString = (s) => {
    return s === '' ? null : s
  }

  const unsavedChanges =
        nullifyEmptyString(name.value)    !== user.name     ||
        nullifyEmptyString(steamId.value) !== user.steam_id ||
        isAdmin.value !== user.is_admin

  const onSaveChanges = async (event) => {
    event.preventDefault()

    const userChanges = {
      name:     name.value,
      steam_id: steamId.value,
      is_admin: isAdmin.value
    }
    
    try {

      await props.updateUser(user, userChanges)

      props.setNotification(`Saved changes for user '${user.name}'.`, 3)

    } catch (exception) {
      console.log(exception)
      props.setErrorNotification('Something went wrong: ' + exception, 5)
    }
  }

  return (
    <div className="detailContainer">
      <form onSubmit={onSaveChanges} id="userinformationForm">
        <div className="header">{user.username}</div>
        <div className="line">
          <label className="w1" htmlFor="userinfo_name">Name:</label>
          <input id="userinfo_name" {...name} />
        </div>
        <div className="line">
          <label className="w1" htmlFor="userinfo_admin">Is admin:</label>
          <input id="userinfo_isadmin" {...isAdmin} />
        </div>
        <div className="line">
          <label className="w1" htmlFor="userinfo_steamid">Steam id:</label>
          <input id="userinfo_steamid" {...steamId} />
        </div>
        <div className="line">
          <span className="w1"/>
          <button type="submit" disabled={unsavedChanges ? '' : 'disabled'} form="userinformationForm">Save changes</button>
        </div>
      </form>
      <Spacer />
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
    user:  state.user.user,
    users: state.users
  }
}

const mapDispatchToProps = {
  setNotification,
  setErrorNotification,
  updateUser
}

const ConnectedUserInformation = connect(mapStateToProps, mapDispatchToProps)(UserInformation)

export default ConnectedUserInformation
