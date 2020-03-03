import React            from 'react'
import { connect }      from 'react-redux'
import { getPlan }      from '../reducers/plansReducer'
import Spacer           from './Spacer'
import ButtonDeletePlan from './ButtonDeletePlan'
import ReactJson        from 'react-json-view'
import Togglable        from './Togglable'

const PlanInformation = (props) => {
  const plan = props.plans.find((p) => p.id === parseInt(props.id))

  if (plan !== undefined && plan.version === undefined)
    props.getPlan(plan.id)

  if(plan === undefined || plan.version === undefined) {
    return null
  }

  const itemcount = plan.pieces.reduce((count, structure) => count + structure.inventory.length, 0)

  const showrawRef = React.createRef()

  return (
    <div className="detailContainer">
      <div className="header">{plan.name}</div>
      <div className="line">Plan id: {plan.plan_id}</div>
      <div className="line">Number of structures: {plan.pieces.length}</div>
      <div className="line">Number of items: {itemcount}</div>
      <div className="line">Number of creatures: {plan.creatures.length}</div>
      <Spacer />
      <div className="line">Database id: {plan.id}</div>
      <div className="line">Added to database: {plan.createdAt}</div>
      <div className="line">Last database update: {plan.updatedAt}</div>
      <Spacer />
      <Togglable showButtonLabel='Show RAW plan data' hideButtonLabel='Close RAW view' ref={showrawRef}>
        <ReactJson src={plan} />
      </Togglable>
      <Spacer />
      <ButtonDeletePlan plan_id={plan.id} />
    </div>
  )
}


const mapStateToProps = (state) => {
  return {
    plans: state.plans
  }
}

const mapDispatchToProps = {
  getPlan
}

const ConnectedPlanInformation = connect(mapStateToProps, mapDispatchToProps)(PlanInformation)

export default ConnectedPlanInformation
