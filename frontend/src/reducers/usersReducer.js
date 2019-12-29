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


/* The reducer: */
const initialState = []

const reducer = (state = initialState, action) => {
  switch(action.type)
  {
    case 'INITIALIZE_USERS': {
      return action.users
    }
    case 'ADD_USER': {
      const ns = state.concat(action.user)
      return ns
    }
    case 'DELETE_USER': {
      const ns = state.filter(plan => plan.id !== action.id)
      return ns
    }
    default: {
      return state
    }
  }
}

export default reducer
