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


/* The reducer: */
const initialState = []

const reducer = (state = initialState, action) => {
  switch(action.type)
  {
    case 'INITIALIZE_CLIENTS': {
      return action.clients
    }
    case 'ADD_CLIENT': {
      const ns = state.concat(action.client)
      return ns
    }
    case 'DELETE_CLIENT': {
      const ns = state.filter(client => client.id !== action.id)
      return ns
    }
    default: {
      return state
    }
  }
}

export default reducer
