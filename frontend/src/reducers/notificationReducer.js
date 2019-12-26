const asObject = (type, message, timer) => {
  return {
    messageType: type,
    message:     message,
    timer:       timer
  }
}

const initialState = asObject(undefined, undefined, undefined)

/* Action creators: */
export const setNotification = (message, timeout) => {
  return async dispatch => {
    const timer = setTimeout(() => {
      dispatch({
        type: 'CLEAR_NOTIFICATION'
      })
    }, timeout * 1000)

    dispatch({
      type:        'NOTIFICATION',
      message:     message,
      messageType: 'notification',
      timer:       timer
    })
  }
}

export const setErrorNotification = (message, timeout) => {
  return async dispatch => {
    const timer = setTimeout(() => {
      dispatch({
        type: 'CLEAR_NOTIFICATION'
      })
    }, timeout * 1000)

    dispatch({
      type:        'NOTIFICATION',
      message:     message,
      messageType: 'error',
      timer:       timer
    })
  }
}

export const clearNotification = () => {
  return async dispatch => {
    dispatch({
      type: 'CLEAR_NOTIFICATION'
    })
  }
}


const reducer = (state = initialState, action) => {
  switch(action.type) {
    case 'NOTIFICATION': {
      if(state.timer !== undefined) {
        clearTimeout(state.timer)
      }

      return asObject(action.messageType, action.message, action.timer)
    }

    case 'CLEAR_NOTIFICATION':
      if(state.timer !== undefined) {
        clearTimeout(state.timer)
      }

      return asObject(undefined, undefined, undefined)

    default:
      return state
  }
}

export default reducer
