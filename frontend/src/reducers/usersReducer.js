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


/* The reducer: */
const initialState = []

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case 'INITIALIZE_USERS': {
      return action.users
    }

    default:
      return state
  }
}

export default reducer
