import { generateText } from 'ai'
import { getSupportedModel } from './modelSelector'

const prompt = 'What is greater, 9.11 or 9.9?'

console.log(
  await generateText({
    model: getSupportedModel('drivly/frontier:reasoning'),
    prompt
  }).then(x => x.text)
)
