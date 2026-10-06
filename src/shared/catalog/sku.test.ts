import { describe, expect, it } from 'vitest'
import { normalizeSku, suggestSku } from './sku'

describe('sku', () => {
  it('suggests the next number for the category prefix', () => {
    expect(suggestSku('Lengha', ['SM-LEN-0001', 'SM-LEN-0002', 'SM-SAR-0009'])).toBe('SM-LEN-0003')
  })

  it('starts at 0001 for an unused category', () => {
    expect(suggestSku('Gown', ['SM-LEN-0001'])).toBe('SM-GWN-0001')
  })

  it('skips past the highest existing number, not the count', () => {
    expect(suggestSku('Saree', ['SM-SAR-0001', 'SM-SAR-0007'])).toBe('SM-SAR-0008')
  })

  it('ignores hand-typed SKUs that do not follow the pattern', () => {
    expect(suggestSku('Saree', ['CUSTOM-1', 'sm-sar-0002'])).toBe('SM-SAR-0003')
  })

  it('normalizes case and whitespace', () => {
    expect(normalizeSku('  sm-len-0004 ')).toBe('SM-LEN-0004')
    expect(normalizeSku('sm len 4')).toBe('SM-LEN-4')
  })
})
