import { parseModelIdentifier, formatModelIdentifier } from '../parser';

describe('Model Identifier Parser', () => {
  test('should parse @provider/creator/model format', () => {
    const result = parseModelIdentifier('@openai/openai/gpt-4o:code,online');
    
    expect(result).toEqual({
      provider: 'openai',
      creator: 'openai',
      model: 'gpt-4o',
      capabilities: ['code', 'online'],
      thinkingLevel: undefined
    });
  });
  
  test('should parse creator/model format', () => {
    const result = parseModelIdentifier('anthropic/claude-3.7-sonnet:thinking');
    
    expect(result).toEqual({
      provider: undefined,
      creator: 'anthropic',
      model: 'claude-3.7-sonnet',
      capabilities: ['thinking'],
      thinkingLevel: 'medium' // Default level
    });
  });
  
  test('should handle thinking level specifications', () => {
    const result = parseModelIdentifier('@open-router/anthropic/claude-3.7-sonnet:thinking-high,online,nitro');
    
    expect(result).toEqual({
      provider: 'open-router',
      creator: 'anthropic',
      model: 'claude-3.7-sonnet',
      capabilities: ['thinking-high', 'online', 'nitro'],
      thinkingLevel: 'high'
    });
  });
  
  test('should format model identifier correctly with @ sign', () => {
    const parsed = {
      provider: 'openai',
      creator: 'openai',
      model: 'gpt-4o',
      capabilities: ['code', 'online']
    };
    
    const formatted = formatModelIdentifier(parsed);
    expect(formatted).toBe('@openai/openai/gpt-4o:code,online');
  });
  
  test('should format model identifier correctly without @ sign', () => {
    const parsed = {
      provider: 'openai',
      creator: 'openai',
      model: 'gpt-4o',
      capabilities: ['code', 'online']
    };
    
    const formatted = formatModelIdentifier(parsed, false);
    expect(formatted).toBe('openai/openai/gpt-4o:code,online');
  });
  
  test('should format model identifier without provider', () => {
    const parsed = {
      creator: 'anthropic',
      model: 'claude-3.7-sonnet',
      capabilities: ['thinking']
    };
    
    const formatted = formatModelIdentifier(parsed);
    expect(formatted).toBe('anthropic/claude-3.7-sonnet:thinking');
  });
}); 