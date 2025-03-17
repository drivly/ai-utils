import { generateText } from 'ai'
import { getSupportedModel } from './modelSelector'

const prompt = 'What is greater, 9.11 or 9.9?'

console.log(
  await generateText({
    model: getSupportedModel('google/google/gemini-2.0-flash-001'),
    prompt
  }).then(x => x.text)
)

console.log(
  await generateText({
    model: getSupportedModel('google/gemini-2.0-flash-001'),
    prompt
  }).then(x => x.text)
)

console.log(
  await generateText({
    model: getSupportedModel('anthropic/claude-3-7-sonnet-20250219:reasoning'),
    prompt
  }).then(x => x.text)
)

