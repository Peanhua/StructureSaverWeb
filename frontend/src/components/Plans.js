import React        from 'react'
import { connect }  from 'react-redux'
import Plan         from './Plan'


const Plans = (props) => {
  const plans = props.plans
  
  let row = 0

  return (
    <div className="container">
      <table className="list">
        <thead>
          <tr className="header">
            <th>Plan</th>
            <th>Player</th>
            <th>Created</th>
            <th>Last updated</th>
          </tr>
        </thead>
        <tbody>
          {plans
            .sort((a, b) => b.name < a.name)
            .map(plan => {
              row = row + 1
              return (<Plan key={plan.id} row={row} plan={plan} />)
            })
          }
        </tbody>
      </table>
    </div>
  )
}


const mapStateToProps = (state) => {
  return {
    plans: state.plans
  }
}

const mapDispatchToProps = null

const ConnectedPlans = connect(mapStateToProps, mapDispatchToProps)(Plans)

export default ConnectedPlans
