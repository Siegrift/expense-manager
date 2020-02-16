import { formatAmount } from './utils'

describe('utils', () => {
  describe('formatAmount', () => {
    test('inserts commas to large number', () => {
      expect(formatAmount('100000000')).toBe('100,000,000')
      expect(formatAmount('1234')).toBe('1,234')
      expect(formatAmount('123456')).toBe('123,456')
    })

    test("doesn't modify small nums", () => {
      expect(formatAmount(54)).toBe('54')
      expect(formatAmount(-234)).toBe('-234')
      expect(formatAmount(0)).toBe('0')
    })

    test('works with floating point', () => {
      expect(formatAmount('54.23')).toBe('54.23')
      expect(formatAmount('12345.23')).toBe('12,345.23')
      expect(formatAmount('123.23')).toBe('123.23')
      expect(formatAmount('0.0')).toBe('0.0')
    })
  })
})
