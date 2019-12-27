import React        from 'react'
import { connect }  from 'react-redux'

const PlanInformation = (props) => {
  const plan = props.plans.find((u) => u.id === parseInt(props.id))

  if(plan === undefined) {
    return null
  }
  
  return (
    <div className="detailContainer">
      <div className="header">{plan.name}</div>
      <div className="line">Id: {plan.id}</div>
      <div className="line">Created: {plan.createdAt}</div>
      <div className="line">Updated: {plan.updatedAt}</div>
    </div>
  )
}


const mapStateToProps = (state) => {
  return {
    plans: state.plans
  }
}

const mapDispatchToProps = null

const ConnectedPlanInformation = connect(mapStateToProps, mapDispatchToProps)(PlanInformation)

export default ConnectedPlanInformation
