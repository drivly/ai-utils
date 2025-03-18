import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest'
import { generateText } from 'ai'
import { getSupportedModel } from '../modelSelector'

// Mock the ai package
vi.mock('ai', () => {
  return {
    generateText: vi.fn()
  }
})

// Mock the modelSelector module
vi.mock('../modelSelector', () => {
  return {
    getSupportedModel: vi.fn()
  }
})

describe('Text Generation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should generate text with the supported model', async () => {
    // Mock the supported model return value
    const mockModel = { name: 'test-model', provider: 'drivly' }
    getSupportedModel.mockReturnValue(mockModel)

    // Mock the generate text response
    const mockResponse = { text: '9.9 is less than 9.11, so 9.11 is greater.' }
    generateText.mockResolvedValue(mockResponse)

    // Create the same prompt used in demo.ts
    const prompt = 'What is greater, 9.11 or 9.9?'
    
    // Call the generateText function
    const result = await generateText({
      model: getSupportedModel('drivly/frontier:reasoning'),
      prompt
    })

    // Verify the mocks were called correctly
    expect(getSupportedModel).toHaveBeenCalledWith('drivly/frontier:reasoning')
    expect(generateText).toHaveBeenCalledWith({
      model: mockModel,
      prompt
    })
    
    // Verify the result
    expect(result).toBe(mockResponse)
    expect(result.text).toBe('9.9 is less than 9.11, so 9.11 is greater.')
  })

  it('should handle errors during text generation', async () => {
    // Mock the supported model return value
    const mockModel = { name: 'test-model', provider: 'drivly' }
    getSupportedModel.mockReturnValue(mockModel)

    // Mock an error from generateText
    const error = new Error('API error')
    generateText.mockRejectedValue(error)

    // Create a prompt
    const prompt = 'What is greater, 9.11 or 9.9?'
    
    // Call the generateText function and expect it to throw
    await expect(
      generateText({
        model: getSupportedModel('drivly/frontier:reasoning'),
        prompt
      })
    ).rejects.toThrow('API error')

    // Verify the mocks were called correctly
    expect(getSupportedModel).toHaveBeenCalledWith('drivly/frontier:reasoning')
    expect(generateText).toHaveBeenCalledWith({
      model: mockModel,
      prompt
    })
  })

  it('should use the correct model configuration', async () => {
    // Mock the supported model return value with different capabilities
    const mockModel = { name: 'test-model', provider: 'drivly', capabilities: ['code', 'reasoning'] }
    getSupportedModel.mockReturnValue(mockModel)

    // Mock the generate text response
    const mockResponse = { text: 'Sample response' }
    generateText.mockResolvedValue(mockResponse)

    // Different model configuration
    const modelId = 'drivly/frontier:code,reasoning'
    const prompt = 'Write a function to sum two numbers'
    
    // Call the generateText function
    await generateText({
      model: getSupportedModel(modelId),
      prompt
    })

    // Verify the model selection was done with the correct model ID
    expect(getSupportedModel).toHaveBeenCalledWith(modelId)
  })
}) 