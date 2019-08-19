import { Api, clearAPIInstance, getAPI } from '.'

describe('api', () => {
  beforeEach(() => {
    clearAPIInstance()
  })

  test('can create only single api instance', () => {
    const api = new Api(undefined as any)
    expect(() => {
      // tslint:disable-next-line: no-unused-expression
      new Api(undefined as any)
    }).toThrow()
  })

  test('can retrieve the api instance', () => {
    const api = new Api(undefined as any)
    expect(getAPI()).toBe(api)
  })

  test('getAPI throws when no API is created', () => {
    expect(() => getAPI()).toThrow()
  })
})
