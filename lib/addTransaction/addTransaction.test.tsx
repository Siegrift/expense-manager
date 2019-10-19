import { mount } from 'enzyme'
import mockdate from 'mockdate'

import { getInitialState, State } from '../state'
import { reduxify } from '../testing'

import AddTransaction from './index'

describe('add transaction', () => {
  test('shows loading page', () => {
    const comp = mount(reduxify(AddTransaction, getInitialState()))
    expect(comp.html()).toMatchSnapshot()
  })
  
  describe('logged in', () => {
    let state: State
    let mockedDate

    beforeEach(() => {
      state = getInitialState()
      state.signInStatus = 'loggedIn'
      mockedDate = new Date(2019, 10, 19)
      mockdate.set(mockedDate)
    })

    afterEach(() => {
      mockdate.reset()
    })

    test('shows add transaction page', () => {
      const comp = mount(reduxify(AddTransaction, state))
      expect(comp.html()).toMatchSnapshot()
    })
  })
})
