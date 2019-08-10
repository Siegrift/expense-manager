import { connect } from 'react-redux'
import { updateCnt as _updateCnt } from './actions'
import Button from '@material-ui/core/Button'
import { State } from './state'

const Counter = ({ cnt, updateCnt }) => {
  return (
    <div>
      <Button color="primary" variant="contained" onClick={updateCnt}>
        +
      </Button>
      <span>{cnt}</span>
    </div>
  )
}

export default connect(
  (state: State) => ({ cnt: state.cnt }),
  { updateCnt: _updateCnt },
)(Counter)
