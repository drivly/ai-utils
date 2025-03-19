import { OpenAPIRoute } from 'chanfana'
import { ChatCompletionRequest, ChatCompletionResponse } from '../types'

export class ChatCompletionCreate extends OpenAPIRoute {
  schema = {
    tags: ['chat', 'completion'],
    summary: 'Create a new Chat Completion',
    request: {
      body: {
        content: {
          'application/json': {
            schema: ChatCompletionRequest,
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
    const taskToCreate = data.body

    // TODO: Pass request to OpenRouter

    // return the completion
    return taskToCreate
  }
}
