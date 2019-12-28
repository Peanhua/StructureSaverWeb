import {
  createStore,
  combineReducers,
  applyMiddleware
} from 'redux'
import thunk               from 'redux-thunk'
import notificationReducer from './reducers/notificationReducer'
import loginReducer        from './reducers/loginReducer'
import usersReducer        from './reducers/usersReducer'
import plansReducer        from './reducers/plansReducer'
import clientsReducer      from './reducers/clientsReducer'

const reducer = combineReducers({
  notification: notificationReducer,
  user:         loginReducer,
  users:        usersReducer,
  plans:        plansReducer,
  clients:      clientsReducer
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store
