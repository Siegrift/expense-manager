import { connect } from 'react-redux'
import { thunk as _thunk, updateCnt as _updateCnt } from './actions'
import Button from '@material-ui/core/Button'
import { State } from './state'

const Counter = ({ cnt, updateCnt, thunk }) => {
  return (
    <div>
      <Button color="primary" variant="contained" onClick={updateCnt}>
        +
      </Button>
      <Button color="primary" variant="contained" onClick={thunk}>
        async
      </Button>
      <span>{cnt}</span>
    </div>
  )
}

export default connect(
  (state: State) => ({ cnt: state.cnt }),
  { updateCnt: _updateCnt, thunk: _thunk },
)(Counter)
