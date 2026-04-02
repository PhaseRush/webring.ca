import { describe, expect, it } from 'vitest'
import { calcOffset } from '../lib/splash/parallax'

describe('parallax calcOffset', () => {
  it('returns zero offset when mouse is at center', () => {
    const offset = calcOffset(500, 400, 1000, 800, 0.02)
    expect(offset.x).toBe(0)
    expect(offset.y).toBe(0)
  })

  it('returns positive offset when mouse is right of center', () => {
    const offset = calcOffset(750, 400, 1000, 800, 0.02)
    expect(offset.x).toBeGreaterThan(0)
    expect(offset.y).toBe(0)
  })

  it('scales offset by depth factor', () => {
    const shallow = calcOffset(750, 400, 1000, 800, 0.01)
    const deep = calcOffset(750, 400, 1000, 800, 0.05)
    expect(deep.x).toBeGreaterThan(shallow.x)
  })
})
