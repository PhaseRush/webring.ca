import { describe, it, expect } from 'vitest'
import { projectToSvg } from '../lib/canada-map'

describe('projectToSvg', () => {
  it('projects Toronto to roughly center-right of the map', () => {
    const { x, y } = projectToSvg(43.65, -79.38)
    expect(x).toBeGreaterThan(500)
    expect(x).toBeLessThan(620)
    expect(y).toBeGreaterThan(400)
    expect(y).toBeLessThan(500)
  })

  it('projects Vancouver to the left side of the map', () => {
    const { x, y } = projectToSvg(49.28, -123.12)
    expect(x).toBeGreaterThan(100)
    expect(x).toBeLessThan(220)
  })

  it('projects northern cities higher on the map (lower y)', () => {
    const iqaluit = projectToSvg(63.75, -68.52)
    const toronto = projectToSvg(43.65, -79.38)
    expect(iqaluit.y).toBeLessThan(toronto.y)
  })

  it('returns values within the 800x500 viewBox for typical Canadian cities', () => {
    const cities = [
      { lat: 43.65, lng: -79.38 },
      { lat: 49.28, lng: -123.12 },
      { lat: 45.50, lng: -73.57 },
      { lat: 60.72, lng: -135.06 },
    ]
    for (const c of cities) {
      const { x, y } = projectToSvg(c.lat, c.lng)
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThanOrEqual(800)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(y).toBeLessThanOrEqual(500)
    }
  })
})
