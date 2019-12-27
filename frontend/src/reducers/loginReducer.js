import loginService from '../services/login'
import usersService from '../services/users'

/* Action creators: */
export const loadUser = () => {
  return async dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      usersService.setToken(user.token)
      dispatch({
        type: 'LOGIN_USER',
        user: user
      })
    }
  }
}

export const loginUser = (username, password) => {
  return async dispatch => {
    const user = await loginService.login({
      username: username,
      password: password
    })
    window.localStorage.setItem('loggedUser', JSON.stringify(user))
    usersService.setToken(user.token)
    dispatch({
      type: 'LOGIN_USER',
      user: user
    })
  }
}

export const logoutUser = () => {
  return async dispatch => {
    window.localStorage.removeItem('loggedUser')
    usersService.setToken(null)
    dispatch({
      type: 'LOGOUT_USER'
    })
  }
}

/* The reducer: */
const initialState = null

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case 'LOGIN_USER': {
      return action.user
    }

    case 'LOGOUT_USER': {
      return null
    }

    default:
      return state
  }
}

export default reducer
