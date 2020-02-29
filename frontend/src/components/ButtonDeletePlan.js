import React from 'react'

import {
  connect
} from 'react-redux'

import {
  setNotification,
  setErrorNotification
} from '../reducers/notificationReducer'

import Togglable from './Togglable'

import {
  deletePlan
} from '../reducers/plansReducer'


const ButtonDeletePlan = (props) => {
  const deleteplanFormRef = React.createRef()

  const user = props.user
  if (!user.is_admin)
    return (<div />)

  const deleteplan = props.plans.find((u) => u.id === parseInt(props.plan_id))
  if (deleteplan === undefined)
    return (<div />)
  
  const onDeletePlan = async (event) => {
    event.preventDefault()

    try {
      const name = deleteplan.plan_name
      
      deleteplanFormRef.current.toggleVisibility()

      await props.deletePlan(deleteplan.id)

      props.setNotification(`Plan '${name}' was deleted.`, 5)

    } catch (exception) {
      console.log(exception)
      props.setErrorNotification('Something went wrong: ' + exception, 5)
    }
  }
  
  return (
    <Togglable showButtonLabel='Delete plan' hideButtonLabel='Cancel' ref={deleteplanFormRef}>
      <form onSubmit={onDeletePlan} id="deleteplanForm">
        <div>Confirm delete:</div>
        <button form="deleteplanForm" type="submit">Delete</button>
      </form>
    </Togglable>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    plans: state.plans
  }
}

const mapDispatchToProps = {
  setNotification,
  setErrorNotification,
  deletePlan
}

const ConnectedButtonDeletePlan = connect(mapStateToProps, mapDispatchToProps)(ButtonDeletePlan)

export default ConnectedButtonDeletePlan
