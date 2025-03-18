import { expect, describe, it } from 'vitest'
import { parseModelIdentifier, formatModelIdentifier } from '../parser'
import { Capability, Provider } from '../types'

describe('parseModelIdentifier', () => {
  it('should parse a model string with provider, author, and model', () => {
    const result = parseModelIdentifier('@openai/openai/gpt-4')
    
    expect(result).toEqual({
      provider: 'openai',
      author: 'openai',
      model: 'gpt-4',
      capabilities: []
    })
  })

  it('should parse a model string with author and model', () => {
    const result = parseModelIdentifier('drivly/frontier')
    
    expect(result).toEqual({
      provider: undefined,
      author: 'drivly',
      model: 'frontier',
      capabilities: []
    })
  })

  it('should parse a model string with just model name', () => {
    const result = parseModelIdentifier('gpt-4')
    
    expect(result).toEqual({
      provider: undefined,
      author: undefined,
      model: 'gpt-4',
      capabilities: []
    })
  })

  it('should parse capabilities', () => {
    const result = parseModelIdentifier('drivly/frontier:reasoning,code')
    
    expect(result).toEqual({
      provider: undefined,
      author: 'drivly',
      model: 'frontier',
      capabilities: ['reasoning', 'code']
    })
  })

  it('should handle models with @ prefix but without provider', () => {
    const result = parseModelIdentifier('@mistralai/mistral-7b')
    
    expect(result).toEqual({
      provider: 'mistralai',
      author: 'mistral-7b',
      model: '',
      capabilities: []
    })
  })
})

describe('formatModelIdentifier', () => {
  it('should format a model identifier with provider, author, and model', () => {
    const modelId = {
      provider: 'openai' as Provider,
      author: 'openai',
      model: 'gpt-4',
      capabilities: []
    }
    
    const result = formatModelIdentifier(modelId)
    expect(result).toBe('@openai/openai/gpt-4')
  })

  it('should format a model identifier with author and model', () => {
    const modelId = {
      author: 'drivly',
      model: 'frontier',
      capabilities: []
    }
    
    const result = formatModelIdentifier(modelId)
    expect(result).toBe('drivly/frontier')
  })

  it('should format a model identifier with just model', () => {
    const modelId = {
      model: 'gpt-4',
      capabilities: []
    }
    
    const result = formatModelIdentifier(modelId)
    expect(result).toBe('gpt-4')
  })

  it('should format a model identifier with capabilities', () => {
    const modelId = {
      author: 'drivly',
      model: 'frontier',
      capabilities: ['reasoning', 'code'] as Capability[]
    }
    
    const result = formatModelIdentifier(modelId)
    expect(result).toBe('drivly/frontier:reasoning,code')
  })

  it('should format without @ sign when includeAtSign is false', () => {
    const modelId = {
      provider: 'openai' as Provider,
      author: 'openai',
      model: 'gpt-4',
      capabilities: []
    }
    
    const result = formatModelIdentifier(modelId, false)
    expect(result).toBe('openai/openai/gpt-4')
  })
}) 