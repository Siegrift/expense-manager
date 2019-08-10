import thunk from 'redux-thunk'
import { applyMiddleware, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import rootReducer from './rootReducer'
import { getInitialState } from '../state'
import { Action } from './types'
import { Logger } from '../types'
import { Api } from '../api/index'

export const configureStore = () => {
  const logger: Logger = {
    log: (_, __) => null,
  }
  if (process.env.NODE_ENV) {
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

  const middlewares = [
    thunk.withExtraArgument({ logger, api: new Api(logger) }),
  ]
  if (process.env.NODE_ENV) {
    middlewares.push(loggerMiddleware)
  }

  const store = createStore(
    rootReducer as any,
    getInitialState() as any,
    applyMiddleware(...middlewares),
  )

  return store
}
