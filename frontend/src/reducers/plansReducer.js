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

export const getPlan = (id) => {
  return async dispatch => {
    const plan = await plansService.get(id)
    dispatch({
      type: 'PLAN',
      plan: plan
    })
  }
}


/* The reducer: */
const initialState = []

const reducer = (state = initialState, action) => {
  switch(action.type)
  {
    case 'INITIALIZE_PLANS': {
      return action.plans
    }
    case 'PLAN': {
      const ns = state.map((plan) => {
        if (plan.id === action.plan.id)
          return action.plan
        else
          return plan
      })
      return ns
    }
    default: {
      return state
    }
  }
}

export default reducer
