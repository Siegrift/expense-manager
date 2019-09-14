import { applyMiddleware, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import { Api } from '../api'
import { getInitialState } from '../state'
import { Logger } from '../types'

import rootReducer from './rootReducer'
import { Action, ThunkExtraArgument } from './types'

export const configureStore = () => {
  const logger: Logger = {
    log: (_, __) => null,
  }
  if (process.env.NODE_ENV === 'development') {
    logger.log = (message, payload) =>
      store.dispatch({
        type: message,
        payload,
      } as Action<any>)
  }

  const loggerMiddleware = createLogger({
    collapsed: true,
    predicate: (_, action: Action) => !(action.loggable === false),
    actionTransformer: (action: Action) => ({
      ...action,
      type: `${action.type}`,
    }),
  })

  const thunkExtra: ThunkExtraArgument = {
    logger,
    api: new Api(logger),
  }
  const middlewares = [thunk.withExtraArgument(thunkExtra)]
  if (process.env.NODE_ENV === 'development') {
    middlewares.push(loggerMiddleware)
  }

  const store = createStore(
    rootReducer as any,
    getInitialState() as any,
    applyMiddleware(...middlewares),
  )

  return store
}
