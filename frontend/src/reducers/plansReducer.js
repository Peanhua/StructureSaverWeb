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

export const deletePlan = (id) => {
  return async dispatch => {
    await plansService.deletePlan(id)
    dispatch({
      type: 'PLAN_DELETE',
      plan_id: id
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
    case 'PLAN_DELETE': {
      return state.filter(plan => plan.id !== action.plan_id)
    }
    default: {
      return state
    }
  }
}

export default reducer
