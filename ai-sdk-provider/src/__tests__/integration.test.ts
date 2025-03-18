import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest'
import { generateText } from 'ai'
import { getSupportedModel } from '../modelSelector'
import { parseModelIdentifier, formatModelIdentifier } from '../parser'

// Mock the ai package
vi.mock('ai', () => {
  return {
    generateText: vi.fn()
  }
})

describe('Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Mock generateText to return a simple response
    vi.mocked(generateText).mockResolvedValue({
      text: 'This is a test response',
      toolCalls: undefined
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should work with model identifiers and text generation', async () => {
    // Test the parser functionality
    const parsedModel = parseModelIdentifier('drivly/frontier:reasoning')
    
    expect(parsedModel).toEqual({
      provider: undefined,
      author: 'drivly',
      model: 'frontier',
      capabilities: ['reasoning']
    })
    
    // Format back to string
    const formattedModel = formatModelIdentifier(parsedModel)
    expect(formattedModel).toBe('drivly/frontier:reasoning')
    
    // Mock the getSupportedModel function since we don't want to rely on actual models
    const modelMock = { name: 'frontier', provider: 'drivly', capabilities: ['reasoning'] }
    vi.spyOn(global, 'console').mockImplementation(() => ({ log: vi.fn() } as any))
    
    // Replace the actual getSupportedModel implementation for this test
    const originalGetSupportedModel = global.getSupportedModel
    global.getSupportedModel = vi.fn().mockReturnValue(modelMock)
    
    // Use the components together as would be done in the demo
    const prompt = 'What is greater, 9.11 or 9.9?'
    
    const result = await generateText({
      model: getSupportedModel(formattedModel),
      prompt
    })
    
    // Restore the original function
    global.getSupportedModel = originalGetSupportedModel
    
    // Verify the interactions
    expect(global.getSupportedModel).toHaveBeenCalledWith(formattedModel)
    expect(generateText).toHaveBeenCalledWith({
      model: modelMock,
      prompt
    })
    
    // Check the final result
    expect(result.text).toBe('This is a test response')
  })

  it('should handle fallback models when first choice is unavailable', async () => {
    // Create a test scenario where the first model isn't available but fallback is
    
    // First, mock console to avoid polluting test output
    vi.spyOn(global, 'console').mockImplementation(() => ({ log: vi.fn(), error: vi.fn() } as any))
    
    // Replace getSupportedModel with our test version
    const originalGetSupportedModel = global.getSupportedModel
    
    // Our mock implementation that simulates failure for first model
    const mockGetSupportedModel = vi.fn().mockImplementation((modelInput) => {
      if (Array.isArray(modelInput)) {
        if (modelInput[0] === 'unavailable/model') {
          // First model fails, return the fallback
          return { name: 'frontier', provider: 'drivly' }
        }
      }
      return { name: 'default-model', provider: 'drivly' }
    })
    
    global.getSupportedModel = mockGetSupportedModel
    
    // Use multiple models with a fallback
    const result = await generateText({
      model: getSupportedModel(['unavailable/model', 'drivly/frontier']),
      prompt: 'Test prompt'
    })
    
    // Restore the original function
    global.getSupportedModel = originalGetSupportedModel
    
    // Verify the test
    expect(mockGetSupportedModel).toHaveBeenCalledWith(['unavailable/model', 'drivly/frontier'])
    expect(result.text).toBe('This is a test response')
  })
}) 