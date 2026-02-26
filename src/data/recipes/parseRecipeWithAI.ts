import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import OpenAI from 'openai'
import { RECIPE_PARSER_SYSTEM_PROMPT } from './prompts'

// Validation schema for input
const parseRecipeInputSchema = z.object({
  text: z.string().min(1, 'Recipe text is required'),
})

// Validation schema for output
const recipeOutputSchema = z.object({
  name: z.string(),
  ingredients: z.array(
    z.object({
      ingredient: z.string(),
      checked: z.boolean().default(false),
    }),
  ),
})

export type ParsedRecipe = z.infer<typeof recipeOutputSchema>

export const parseRecipeWithAI = createServerFn({ method: 'POST' })
  .inputValidator(parseRecipeInputSchema)
  .handler(async (ctx): Promise<ParsedRecipe> => {
    const { text } = ctx.data

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable is not set')
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: 'https://api.groq.com/openai/v1',
    })

    try {
      const completion = await openai.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: RECIPE_PARSER_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      })

      const responseText = completion.choices[0]?.message?.content
      if (!responseText) {
        throw new Error('No response from Groq')
      }

      console.log('✅ Groq response:', responseText)

      // Parse and validate the response
      const parsed = JSON.parse(responseText)
      const validated = recipeOutputSchema.parse(parsed)

      return validated
    } catch (error: any) {
      console.error('❌ Error parsing recipe with AI:', error)
      throw new Error(`Failed to parse recipe: ${error.message}`)
    }
  })
