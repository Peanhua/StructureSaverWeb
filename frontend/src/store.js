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

const reducer = combineReducers({
  notification: notificationReducer,
  user:         loginReducer,
  users:        usersReducer,
  plans:        plansReducer
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store
