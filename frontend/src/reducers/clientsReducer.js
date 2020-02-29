import clientsService from '../services/clients'

/* Action creators: */
export const initializeClients = () => {
  return async dispatch => {
    const clients = await clientsService.getAll()
    dispatch({
      type:  'INITIALIZE_CLIENTS',
      clients: clients
    })
  }
}

export const addClient = (client) => {
  return async dispatch => {
    const returnedClient = await clientsService.create(client)
    dispatch({
      type: 'ADD_CLIENT',
      client: returnedClient
    })
  }
}

export const deleteClient = (client) => {
  return async dispatch => {
    await clientsService.deleteClient(client.id)
    dispatch({
      type: 'DELETE_CLIENT',
      id:   client.id
    })
  }
}

export const changeClientPassword = (client, new_password) => {
  return async dispatch => {
    await clientsService.changePassword(client.id, new_password)
    dispatch({
      type:     'CHANGE_PASSWORD_CLIENT',
      id:       client.id,
      password: new_password
    })
  }
}


/* The reducer: */
const initialState = []

const reducer = (state = initialState, action) => {
  switch(action.type)
  {
    case 'INITIALIZE_CLIENTS': {
      return action.clients
    }
    case 'ADD_CLIENT': {
      return state.concat(action.client)
    }
    case 'DELETE_CLIENT': {
      return state.filter(client => client.id !== action.id)
    }
    case 'CHANGE_PASSWORD_CLIENT': {
      return state.map((client) => {
        if (client.id === action.id)
          client.password = action.password
        return client
      })
    }
    default: {
      return state
    }
  }
}

export default reducer
