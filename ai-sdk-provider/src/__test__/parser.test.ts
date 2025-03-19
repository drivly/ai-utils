import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { parseModelIdentifier } from '../parser'

describe('parser', () => {
  it('should parse a model', () => {
    const model = parseModelIdentifier('google/google/gemini-2.0-flash-001')
    
    expect(model.provider).toBe('google')
    expect(model.author).toBe('google')
    expect(model.model).toBe('gemini-2.0-flash-001')
    expect(model.capabilities).toEqual([])
  })

  it('should parse a model with capabilities', () => {
    const model = parseModelIdentifier('google/google/gemini-2.0-flash-001:reasoning')
    
    expect(model.provider).toBe('google')
    expect(model.author).toBe('google')
    expect(model.model).toBe('gemini-2.0-flash-001')
    expect(model.capabilities).toEqual(['reasoning'])
  })
})
