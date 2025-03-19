import { Str } from 'chanfana'
import { z } from 'zod'

const LogProb = z.object({
  bytes: z.array(z.number()).optional(),
  logprob: z.number(),
  token: z.string(),
})

const LogProbs = z.array(
  LogProb.extend({
    top_logprobs: z.array(LogProb),
  }),
)

const MessageContent = z.string().or(
  z.array(
    z
      .object({
        text: z.string(),
        type: z.string(),
      })
      .or(
        z.object({
          image_url: z.object({
            url: z.string(),
            detail: z.string().optional(),
          }),
          type: z.string(),
        }),
      )
      .or(
        z.object({
          input_audio: z.object({
            data: z.string(),
            format: z.string(),
          }),
          type: z.literal('input_audio'),
        }),
      )
      .or(
        z.object({
          file: z.object({
            file_data: z.string().optional(),
            file_id: z.string().optional(),
            filename: z.string().optional(),
          }),
          type: z.literal('file'),
        }),
      ),
  ),
)

export const ChatCompletionRequest = z.object({
  messages: z.array(
    z
      .object({
        content: MessageContent,
        role: z.literal('developer'),
        name: z.string().optional(),
      })
      .or(
        z.object({
          content: MessageContent,
          role: z.literal('system'),
          name: z.string().optional(),
        }),
      )
      .or(
        z.object({
          content: MessageContent,
          role: z.literal('user'),
          name: z.string().optional(),
        }),
      )
      .or(
        z.object({
          role: z.literal('assistant'),
          audio: z.object({}).optional(),
          content: z
            .string()
            .or(
              z.array(
                z
                  .string()
                  .or(
                    z
                      .object({ text: z.string(), type: z.literal('text') })
                      .or(z.object({ refusal: z.string(), type: z.literal('refusal') })),
                  ),
              ),
            ),
          name: z.string().optional(),
        }),
      )
      .or(
        z.object({
          content: MessageContent,
          role: z.literal('tool'),
          tool_call_id: z.string(),
        }),
      )
      .or(
        z.object({
          content: z.string().or(z.null()),
          name: z.string(),
          role: z.literal('function'),
        }),
      ),
  ),
  model: Str({ example: 'gpt-4o' }),
  audio: z
    .object({
      format: z.string(),
      voice: z.string(),
    })
    .or(z.null())
    .optional(),
  frequency_penalty: z.number().max(2).min(-2).or(z.null()).optional(),
  function_call: z
    .string()
    .or(z.object({ name: z.string() }))
    .optional(),
  functions: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        parameters: z.object({}).optional(),
      }),
    )
    .optional(),
  logit_bias: z.record(z.number()).optional(),
  logprobs: z.boolean().or(z.null()).optional(),
  max_completion_tokens: z.number().or(z.null()).optional(),
  max_tokens: z.number().or(z.null()).optional(),
  metadata: z.map(z.string(), z.string()).optional(),
  modalities: z
    .array(z.enum(['text', 'audio', 'image', 'video']))
    .or(z.null())
    .optional(),
  n: z.number().or(z.null()).optional(),
  parallel_tool_calls: z.boolean().optional(),
  prediction: z
    .object({
      content: z.string().or(
        z.array(
          z.object({
            text: z.string(),
            type: z.string(),
          }),
        ),
      ),
      type: z.literal('content'),
    })
    .optional(),
  presence_penalty: z.number().or(z.null()).optional(),
  reasoning_effort: z.string().or(z.null()).optional(),
  response_format: z
    .object({ type: z.literal('json_object') })
    .or(z.object({ type: z.literal('json_schema'), json_schema: z.any() }))
    .optional(),
  seed: z.number().or(z.null()).optional(),
  service_tier: z.enum(['default', 'auto']).or(z.null()).optional(),
  stop: z.string().or(z.array(z.string())).or(z.null()).optional(),
  store: z.boolean().or(z.null()).optional(),
  stream: z.boolean().or(z.null()).optional(),
  stream_options: z
    .object({
      include_usage: z.boolean().optional(),
    })
    .optional(),
  temperature: z.number().optional(),
  tool_choice: z
    .string()
    .or(
      z.object({
        function: z.object({
          name: z.string(),
        }),
        type: z.literal('function'),
      }),
    )
    .optional(),
  tools: z
    .array(
      z.object({
        function: z.object({
          name: z.string(),
          description: z.string().optional(),
          parameters: z.any().optional(),
          strict: z.boolean().or(z.null()).optional(),
        }),
        type: z.string(),
      }),
    )
    .optional(),
  top_logprobs: z.number().min(0).max(20).or(z.null()).optional(),
  top_p: z.number().optional(),
  user: z.string().optional(),
  web_search_options: z
    .object({
      search_context_size: z.enum(['low', 'medium', 'high']).optional(),
      user_location: z
        .object({
          approximate: z.object({
            city: z.string().optional(),
            country: z.string().optional(),
            region: z.string().optional(),
            timezone: z.string().optional(),
          }),
          type: z.literal('approximate'),
        })
        .or(z.null())
        .optional(),
    })
    .optional(),
})

export const ChatCompletionResponse = z.object({
  choices: z.array(
    z.object({
      finish_reason: z.string(),
      index: z.number(),
      logprobs: z
        .object({
          content: LogProbs.optional(),
          refusal: LogProbs.optional(),
        })
        .optional(),
      message: z.object({
        content: z.string().optional(),
        refusal: z.string().optional(),
        role: z.string(),
        annotations: z
          .array(
            z.object({
              type: z.string(),
              url_citation: z.object({
                end_index: z.number(),
                start_index: z.number(),
                title: z.string(),
                url: z.string(),
              }),
            }),
          )
          .optional(),
        audio: z.object({}).optional(),
        tool_calls: z
          .array(
            z.object({
              function: z.object({
                arguments: z.string(),
                name: z.string(),
              }),
              id: z.string(),
              type: z.string(),
            }),
          )
          .optional(),
      }),
    }),
  ),
  created: z.number(),
  id: z.string(),
  model: z.string(),
  object: z.string(),
  service_tier: z.string().optional(),
  system_fingerprint: z.string(),
  usage: z.object({
    completion_tokens: z.number(),
    prompt_tokens: z.number(),
    total_tokens: z.number(),
    completion_tokens_details: z.object({
      accepted_prediction_tokens: z.number(),
      audio_tokens: z.number(),
      reasoning_tokens: z.number(),
      rejected_prediction_tokens: z.number(),
    }),
    prompt_tokens_details: z.object({
      audio_tokens: z.number(),
      cached_tokens: z.number(),
    }),
  }),
})
