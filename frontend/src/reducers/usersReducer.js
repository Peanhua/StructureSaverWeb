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
    default: {
      return state
    }
  }
}

export default reducer
