import { Capability, LanguageModel, ParsedModelIdentifier, Provider, ModelConfig, ThinkingLevel } from './types'
import { parseModelIdentifier, formatModelIdentifier } from './parser'
import { models, getModelOrGateway } from './providers'

/**
 * Check if model supports all required capabilities
 */
function modelSupportsCapabilities(modelCapabilities: Capability[] = [], requiredCapabilities: Capability[] = []): boolean {
  return requiredCapabilities.every(cap => modelCapabilities.includes(cap))
}

/**
 * Convert model string to language model instance
 * Returns null if model is not supported
 */
function getModel(modelIdentifier: string): LanguageModel | null {
  const parsed = parseModelIdentifier(modelIdentifier)

  console.log(parsed)

  // Find matching model in our models array
  const modelDetails = models.find(model => 
    (!parsed.provider || model.provider === parsed.provider) &&
    (!parsed.author || model.author === parsed.author) &&
    (!parsed.model || model.name === parsed.model || model.modelIdentifier === parsed.model)
  )
  
  if (!modelDetails) {
    return null
  }
  
  // Check if model supports all requested capabilities
  if (parsed.capabilities.length > 0 && 
      !modelSupportsCapabilities(modelDetails.capabilities, parsed.capabilities)) {
    return null
  }
  
  // Return the language model
  try {
    const model = getModelOrGateway(
      modelDetails.provider, 
      modelDetails.modelIdentifier || modelDetails.name,
      false
    )
    
    return model
  } catch (error) {
    console.error('Failed to initialize model:', error)
    return null
  }
}

/**
 * Get a supported model based on input with fallback options
 */
export function getSupportedModel(
  modelInput: string | string[], 
  config?: ModelConfig
): LanguageModel {
  // Handle array or single model input
  const modelOptions = Array.isArray(modelInput) ? modelInput : [modelInput]
  
  // Add fallbacks from config
  if (config?.fallbackModels) {
    modelOptions.push(...config.fallbackModels)
  }
  
  // Try each model until we find a working one
  for (const modelString of modelOptions) {
    const model = getModel(modelString)
    if (model) {
      // Verify required capabilities
      if (config?.requiredCapabilities) {
        if (!modelSupportsCapabilities(
          (model as any).capabilities, 
          config.requiredCapabilities
        )) {
          continue // Try next model
        }
      }
      
      return model
    }
  }
  
  throw new Error(`No supported model found with options: ${modelOptions.join(', ')}`)
}