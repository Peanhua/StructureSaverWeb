import loginService from '../services/login'
import usersService from '../services/users'
import plansService from '../services/plans'
import clientsService from '../services/clients'

/* Action creators: */
export const loadUser = () => {
  return async dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      usersService.setToken(user.token)
      plansService.setToken(user.token)
      clientsService.setToken(user.token)
      dispatch({
        type: 'LOGIN_USER',
        user: user
      })
    }
  }
}

export const initializeSteamAuth = () => {
  return async dispatch => {
    const authUrl = await loginService.getSteamAuthUrl()
    dispatch({
      type:         'INITIALIZE_STEAM_AUTH',
      steamAuthUrl: authUrl
    })
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
    plansService.setToken(user.token)
    clientsService.setToken(user.token)
    dispatch({
      type: 'LOGIN_USER',
      user: user
    })
  }
}

export const loginSteamUser = (steamAuthUrl) => {
  return async dispatch => {
    const user = await loginService.steamLogin(steamAuthUrl)
    window.localStorage.setItem('loggedUser', JSON.stringify(user))
    usersService.setToken(user.token)
    plansService.setToken(user.token)
    clientsService.setToken(user.token)
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
    plansService.setToken(null)
    clientsService.setToken(null)
    dispatch({
      type: 'LOGOUT_USER'
    })
  }
}

/* The reducer: */
const initialState = {
  user:         null,
  steamAuthUrl: null
}

const reducer = (state = initialState, action) => {
  switch(action.type)
  {
    case 'INITIALIZE_STEAM_AUTH': {
      return {
        user:         state.user,
        steamAuthUrl: action.steamAuthUrl
      }
    }
    
    case 'LOGIN_USER': {
      return {
        user:         action.user,
        steamAuthUrl: state.steamAuthUrl
      }
    }

    case 'LOGOUT_USER': {
      return {
        user:         null,
        steamAuthUrl: state.steamAuthUrl
      }
    }
    
    default: {
      return state
    }
  }
}

export default reducer
