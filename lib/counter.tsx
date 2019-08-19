import { useDispatch, useSelector } from 'react-redux'
import { thunk, updateCnt } from './actions'
import Button from '@material-ui/core/Button'
import { State } from './state'
import { useCallback } from 'react'

const Counter = () => {
  const cnt = useSelector((state: State) => state.cnt)
  const messages = useSelector((state: State) => state.messages)
  const dispatch = useDispatch()

  return (
    <div>
      {Object.keys(messages).map((mkey) => (
        <div key={mkey}>{messages[mkey].text}</div>
      ))}
      <Button
        color="primary"
        variant="contained"
        onClick={useCallback(() => dispatch(updateCnt()), [])}
      >
        +
      </Button>
      <Button
        color="primary"
        variant="contained"
        onClick={useCallback(() => dispatch(thunk()), [])}
      >
        async
      </Button>
      <span>{cnt}</span>
    </div>
  )
}

export default Counter
