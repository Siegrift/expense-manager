import { mount } from 'enzyme'
import { Store } from 'redux'

import { getInitialState, State } from '../state'
import {
  byAriaLabel,
  configureTestStore,
  getMockedFirebase,
  initializeMockFirebase,
  reduxify
} from '../testing'

import Settings from './index'

jest.mock('../firebase/firebase', () => initializeMockFirebase())

describe('settings', () => {
  test('shows loading page', () => {
    const comp = mount(
      reduxify(Settings, configureTestStore(getInitialState())),
    )
    expect(comp.html()).toMatchSnapshot()
  })

  describe('logged in', () => {
    let state: State
    let store: Store
    let firebase: ReturnType<typeof getMockedFirebase>

    beforeEach(() => {
      state = getInitialState()
      firebase = getMockedFirebase()
      store = configureTestStore(state)
      state.signInStatus = 'loggedIn'
      firebase.auth().currentUser = {
        uid: 'userId',
      } as firebase.User
    })

    test('shows settings page', () => {
      const comp = mount(reduxify(Settings, store))
      expect(comp.html()).toMatchSnapshot()
    })

    test('signs out', () => {
      const comp = mount(reduxify(Settings, store))
      expect(firebase.auth().currentUser).not.toBe(null)
      comp
        .find(byAriaLabel('sign out'))
        .hostNodes()
        .simulate('click')
      expect(firebase.auth().currentUser).toBe(null)
    })
  })
})
