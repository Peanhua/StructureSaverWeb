import usersService from '../services/users'

/* Action creators: */
export const initializeUsers = () => {
  return async dispatch => {
    const users = await usersService.getAll()
    dispatch({
      type:  'INITIALIZE_USERS',
      users: users
    })
  }
}

export const addUser = (user) => {
  return async dispatch => {
    const returnedUser = await usersService.create(user)
    dispatch({
      type: 'ADD_USER',
      user: returnedUser
    })
  }
}

export const deleteUser = (user) => {
  return async dispatch => {
    await usersService.deleteUser(user.id)
    dispatch({
      type: 'DELETE_USER',
      id:   user.id
    })
  }
}

export const changeUserPassword = (user, new_password) => {
  return async dispatch => {
    await usersService.changePassword(user.id, new_password)
    dispatch({
      type:     'CHANGE_PASSWORD_USER',
      id:       user.id,
      password: new_password
    })
  }
}

export const updateUser = (user, changes) => {
  return async dispatch => {
    await usersService.updateUser(user.id, changes)
    dispatch({
      type:    'UPDATE_USER',
      id:      user.id,
      changes: changes
    })
  }
}


/* The reducer: */
const initialState = []

const reducer = (state = initialState, action) => {
  switch(action.type)
  {
    case 'INITIALIZE_USERS': {
      return action.users
    }
    case 'ADD_USER': {
      return state.concat(action.user)
    }
    case 'DELETE_USER': {
      return state.filter(user => user.id !== action.id)
    }
    case 'CHANGE_PASSWORD_USER': {
      return state.map((user) => {
        if (user.id === action.id)
          user.password = action.password
        return user
      })
    }
    case 'UPDATE_USER': {
      return state.map((user) => {
        if (user.id === action.id) {
          user.name     = action.changes.name
          user.steam_id = action.changes.steam_id
          user.is_admin = action.changes.is_admin
        }
        return user
      })
    }
    default: {
      return state
    }
  }
}

export default reducer
