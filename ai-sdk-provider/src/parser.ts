import { ParsedModelIdentifier, ThinkingLevel, Capability } from './types'

/**
 * Parse a model identification string into its components
 * Supports both formats:
 * - @{provider}/{author}/{model}:{capabilities}
 * - {author}/{model}:{capabilities}
 * 
 * @param modelIdentifier The model identifier string
 * @returns ParsedModelIdentifier object with components
 */
export function parseModelIdentifier(modelIdentifier: string): ParsedModelIdentifier {
  // Default result with empty values
  const result: ParsedModelIdentifier = {
    model: '',
    capabilities: []
  };

  // Remove @ if present
  let identifier = modelIdentifier;
  if (identifier.startsWith('@')) {
    identifier = identifier.substring(1);
  }

  // Split by colon to separate model and capabilities
  const [modelPart, capabilitiesPart] = identifier.split(':');
  
  // Handle capabilities if present
  if (capabilitiesPart) {
    const capabilities = capabilitiesPart.split(',').map(c => c.trim()) as Capability[];
    result.capabilities = capabilities;
    
    // Check for thinking level
    const thinkingCapability = capabilities.find(c => 
      c === 'thinking' || c === 'thinking-low' || c === 'thinking-medium' || c === 'thinking-high'
    );
    
    if (thinkingCapability) {
      if (thinkingCapability === 'thinking') {
        result.thinkingLevel = undefined; // Default level
      } else {
        // Extract the level part after the dash
        const level = thinkingCapability.split('-')[1] as ThinkingLevel;
        result.thinkingLevel = level;
      }
    }
  }

  // Parse the model part (provider/author/model or author/model)
  const parts = modelPart.split('/');
  
  if (parts.length === 3) {
    // @provider/author/model format
    [result.provider, result.author, result.model] = parts;
  } else if (parts.length === 2) {
    // author/model format
    [result.author, result.model] = parts;
  } else {
    // Just model name
    result.model = modelPart;
  }

  return result;
}

/**
 * Format a parsed model identifier back to string format
 * 
 * @param parsed The parsed model identifier
 * @param includeAtSign Whether to include the @ sign for provider/author/model format
 * @returns Formatted model identifier string
 */
export function formatModelIdentifier(
  parsed: ParsedModelIdentifier, 
  includeAtSign = true
): string {
  let result = '';
  
  // Add @ sign if we have a provider and includeAtSign is true
  if (parsed.provider && includeAtSign) {
    result += '@';
  }
  
  // Add provider if available
  if (parsed.provider) {
    result += `${parsed.provider}/`;
  }
  
  // Add author if available
  if (parsed.author) {
    result += `${parsed.author}/`;
  }
  
  // Add model name
  result += parsed.model;
  
  // Add capabilities if any
  if (parsed.capabilities.length > 0) {
    result += ':' + parsed.capabilities.join(',');
  }
  
  return result;
} 