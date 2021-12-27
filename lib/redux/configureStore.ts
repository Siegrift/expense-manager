import { applyMiddleware, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import { getInitialState } from '../state'
import { Logger } from '../types'

import rootReducer from './rootReducer'
import { Action, ThunkExtraArgument } from './types'

const DISABLE_SERVER_SIDE_LOGGING = true

export const configureStore = () => {
  const logger: Logger = {
    log: () => null,
  }

  if (process.env.ENVIRONMENT === 'development') {
    logger.log = (message, payload) =>
      store.dispatch({
        type: message,
        payload,
      } as Action<any>)
  }

  const loggerMiddleware = createLogger({
    collapsed: true,
    predicate: (_, action: Action) =>
      !((DISABLE_SERVER_SIDE_LOGGING && typeof window === 'undefined') || action.loggable === false),
    actionTransformer: (action: Action) => ({
      ...action,
      type: `${action.type}`,
    }),
  })

  const thunkExtra: ThunkExtraArgument = {
    logger,
  }
  const middlewares = [thunk.withExtraArgument(thunkExtra)]
  if (process.env.ENVIRONMENT === 'development') {
    middlewares.push(loggerMiddleware)
  }

  const store = createStore(rootReducer as any, getInitialState() as any, applyMiddleware(...middlewares))

  return store
}
