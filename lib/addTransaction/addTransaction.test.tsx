import { mount } from 'enzyme'
import mockdate from 'mockdate'

import { getInitialState } from '../state'
import { byAriaLabel, configureTestStore, reduxify } from '../testing'

import AddTransaction from './index'

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
      const setAmountValidationAndMatchSnapshot = (amount: string) => {
        comp
          .find(byAriaLabel('amount'))
          .find('input')
          .simulate('change', { target: { value: amount } })

        expect(
          comp
            .find(byAriaLabel('amount'))
            .find('input')
            .prop('value'),
        ).toBe(amount)
        expect(store.getState().addTransaction.amount).toBe(amount)
        expect(
          comp
            .find(byAriaLabel('amount'))
            .hostNodes()
            .html(),
        ).toMatchSnapshot()
        expect(store.getState().addTransaction.shouldValidateAmount).toBe(true)
      }

      test('not validated initially', () => {
        expect(
          comp
            .find(byAriaLabel('amount'))
            .hostNodes()
            .html(),
        ).toMatchSnapshot()
        expect(store.getState().addTransaction.shouldValidateAmount).toBe(
          false,
        )
      })

      test('allows floats with 2 decimal places', () => {
        setAmountValidationAndMatchSnapshot('12')
        setAmountValidationAndMatchSnapshot('12.3')
        setAmountValidationAndMatchSnapshot('12.34')
        setAmountValidationAndMatchSnapshot('0')

        setAmountValidationAndMatchSnapshot('13.')
        setAmountValidationAndMatchSnapshot('.45')
        setAmountValidationAndMatchSnapshot('-1')
        setAmountValidationAndMatchSnapshot('-13.3')
      })

      test("doesn't allow to submit with invalid amount", () => {
        comp
          .find(byAriaLabel('add transaction'))
          .hostNodes()
          .simulate('click')

        const state = store.getState()
        expect(state.addTransaction.shouldValidateAmount).toBe(true)
        expect(Object.keys(state.transactions)).toHaveLength(0)
      })
    })
  })
})
