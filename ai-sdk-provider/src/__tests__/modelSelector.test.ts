import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest'
import { getSupportedModel } from '../modelSelector'
import * as providers from '../providers'

// Mock the providers module
vi.mock('../providers', () => {
  return {
    models: [
      {
        provider: 'drivly',
        author: 'drivly',
        name: 'frontier',
        modelIdentifier: 'frontier',
        capabilities: ['reasoning'],
        isComposite: false
      },
      {
        provider: 'openai',
        author: 'openai',
        name: 'gpt-3.5-turbo',
        modelIdentifier: 'gpt-3.5-turbo',
        capabilities: ['code', 'structuredOutput'],
        isComposite: false
      },
      {
        provider: 'anthropic',
        author: 'anthropic',
        name: 'claude-3-haiku',
        modelIdentifier: 'claude-3-haiku',
        capabilities: ['reasoning', 'code'],
        isComposite: false
      },
      {
        provider: 'drivly',
        author: 'drivly',
        name: 'composite-model',
        modelIdentifier: 'composite-model',
        capabilities: [],
        isComposite: true,
        childrenModels: ['drivly/frontier', 'openai/gpt-3.5-turbo']
      }
    ],
    getModelOrGateway: vi.fn()
  }
})

describe('getSupportedModel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Setup the mock implementation for getModelOrGateway
    const modelMock = { capabilities: ['reasoning'] }
    providers.getModelOrGateway.mockImplementation((provider, modelId) => {
      if (provider === 'drivly' && modelId === 'frontier') {
        return { ...modelMock, provider, modelId }
      } else if (provider === 'openai' && modelId === 'gpt-3.5-turbo') {
        return { ...modelMock, provider, modelId, capabilities: ['code', 'structuredOutput'] }
      } else if (provider === 'anthropic' && modelId === 'claude-3-haiku') {
        return { ...modelMock, provider, modelId, capabilities: ['reasoning', 'code'] }
      }
      return null
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should get a model by model identifier', () => {
    const model = getSupportedModel('drivly/frontier')
    expect(providers.getModelOrGateway).toHaveBeenCalledWith('drivly', 'frontier', false)
    expect(model).toEqual(expect.objectContaining({ 
      provider: 'drivly', 
      modelId: 'frontier',
      capabilities: ['reasoning']
    }))
  })

  it('should get a model with specific capabilities', () => {
    const model = getSupportedModel('drivly/frontier:reasoning')
    expect(providers.getModelOrGateway).toHaveBeenCalledWith('drivly', 'frontier', false)
    expect(model).toEqual(expect.objectContaining({ 
      provider: 'drivly', 
      modelId: 'frontier'
    }))
  })

  it('should fall back to alternative models when the first choice is not available', () => {
    // Make the first model unavailable
    providers.getModelOrGateway.mockImplementationOnce(() => null)
    
    const model = getSupportedModel(['unavailable-model', 'drivly/frontier'])
    expect(providers.getModelOrGateway).toHaveBeenCalledTimes(2)
    expect(model).toEqual(expect.objectContaining({ 
      provider: 'drivly', 
      modelId: 'frontier'
    }))
  })

  it('should handle composite models by using their children', () => {
    const model = getSupportedModel('drivly/composite-model:reasoning')
    
    // Should have tried the children models with the requested capabilities
    expect(providers.getModelOrGateway).toHaveBeenCalledWith('drivly', 'frontier', false)
    expect(model).toEqual(expect.objectContaining({ 
      provider: 'drivly', 
      modelId: 'frontier'
    }))
  })

  it('should throw an error when no supported model is found', () => {
    // Make all models unavailable
    providers.getModelOrGateway.mockImplementation(() => null)
    
    expect(() => getSupportedModel('drivly/frontier')).toThrow(
      'No supported model found with options: drivly/frontier'
    )
  })
}) 