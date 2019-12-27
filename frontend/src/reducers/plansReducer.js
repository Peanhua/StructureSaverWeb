import plansService from '../services/plans'

/* Action creators: */
export const initializePlans = () => {
  return async dispatch => {
    const plans = await plansService.getAll()
    dispatch({
      type:  'INITIALIZE_PLANS',
      plans: plans
    })
  }
}


/* The reducer: */
const initialState = []

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case 'INITIALIZE_PLANS': {
      return action.plans
    }

    default:
      return state
  }
}

export default reducer
