import { mount } from 'enzyme'
import mockdate from 'mockdate'

import AddTransaction from '.'
import { getInitialState } from '../state'
import { byAriaLabel, configureTestStore, reduxify } from '../testing'

describe('add transaction', () => {
  test('shows loading page', () => {
    const comp = mount(
      reduxify(AddTransaction, configureTestStore(getInitialState())),
    )
    expect(comp.html()).toMatchSnapshot()
  })

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

    test('shows add transaction page', () => {
      comp = mount(reduxify(AddTransaction, store))
      expect(comp.html()).toMatchSnapshot()
    })

    describe('amount validation', () => {
      test('not validated initially', () => {
        expect(
          comp
            .find(byAriaLabel('amount'))
            .hostNodes()
            .html(),
        ).toMatchSnapshot()
      })

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
