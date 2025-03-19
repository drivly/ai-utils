import { OpenAPIRoute } from 'chanfana'
import { z } from 'zod'
import { ChatCompletionRequest, ChatCompletionResponse } from '../types'

export class ChatCompletionCreate extends OpenAPIRoute {
  schema = {
    tags: ['chat'],
    summary: 'Create a new Chat Completion',
    request: {
      body: {
        content: {
          'application/json': {
            schema: z
              .object({
                apiKey: z.string(),
              })
              .merge(ChatCompletionRequest),
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Returns the created task',
        content: {
          'application/json': {
            schema: ChatCompletionResponse,
          },
        },
      },
    },
  }

  async handle(_args: any[]) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>()

    // Retrieve the validated request body
    const { apiKey, ...chatCompletionRequestBody } = data.body

    // Pass request to OpenRouter
    const response = await fetch(
      `https://gateway.ai.cloudflare.com/v1/b6641681fe423910342b9ffa1364c76d/ai-functions/openrouter/v1/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(chatCompletionRequestBody),
      },
    )

    // return the completion
    return response.json()
  }
}
