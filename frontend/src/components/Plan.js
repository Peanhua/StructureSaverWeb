import React       from 'react'
import { connect } from 'react-redux'
import { Link }    from 'react-router-dom'

const Plan = (props) => {
  const plan = props.plan
  const cn = props.row % 2 === 0 ? 'even' : 'odd'

  return (
    <tr className={cn}>
      <td><Link to={`/plans/${plan.id}`}>{plan.name}</Link></td>
      <td>{plan.player_id}</td>
      <td>{plan.createdAt}</td>
      <td>{plan.updatedAt}</td>
    </tr>
  )
}


const mapStateToProps = null

const mapDispatchToProps = null

const ConnectedPlan = connect(mapStateToProps, mapDispatchToProps)(Plan)

export default ConnectedPlan
