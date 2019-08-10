import { Api, clearAPIInstance, getAPI } from './index'

describe('api', () => {
  beforeEach(() => {
    clearAPIInstance()
  })

  test('can create only single api instance', () => {
    const api = new Api(undefined)
    expect(() => {
      // tslint:disable-next-line: no-unused-expression
      new Api(undefined)
    }).toThrow()
  })

  test('can retrieve the api instance', () => {
    const api = new Api(undefined)
    expect(getAPI()).toBe(api)
  })

  test('getAPI throws when no API is created', () => {
    expect(() => getAPI()).toThrow()
  })
})
