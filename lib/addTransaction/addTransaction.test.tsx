import { mount } from 'enzyme'
import mockdate from 'mockdate'

import AddTransaction from '.'
import { getInitialState } from '../state'
import { byAriaLabel, configureTestStore, reduxify } from '../testing'

describe('add transaction', () => {
  describe('logged in', () => {
    let mockedDate
    let store: ReturnType<typeof configureTestStore>
    let comp: ReturnType<typeof mount>

    beforeEach(() => {
      store = configureTestStore({
        ...getInitialState(),
        signInStatus: 'loggedIn',
      })
      comp = mount(reduxify(AddTransaction, store))
      mockedDate = new Date(2019, 10, 19)
      mockdate.set(mockedDate)
    })

    afterEach(() => {
      mockdate.reset()
    })

    describe('amount validation', () => {
      test("doesn't allow to submit with invalid amount", () => {
        comp
          .find(byAriaLabel('add transaction'))
          .hostNodes()
          .simulate('click')

        const state = store.getState()
        expect(Object.keys(state.transactions)).toHaveLength(0)
      })
    })
  })
})
