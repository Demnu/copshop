import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { createRecipe } from '@/data/recipes/createRecipe'
import { parseRecipeWithAI } from '@/data/recipes/parseRecipeWithAI'
import { queryKeys } from '@/lib/queryKeys'
import {
  GovUKPageContainer,
  GovUKPageHeader,
  GovUKBody,
  GovUKButton,
  GovUKInput,
  GovUKFormGroup,
} from '@/components/govuk'

interface Ingredient {
  ingredient: string
  checked: boolean
}

export function AddRecipePage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [recipeText, setRecipeText] = useState('')
  const [recipeName, setRecipeName] = useState('')
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { ingredient: '', checked: false },
  ])
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const parseMutation = useMutation({
    mutationFn: parseRecipeWithAI,
    onSuccess: (data) => {
      setRecipeName(data.name)
      setIngredients(data.ingredients)
      setMessage({
        type: 'success',
        text: 'Recipe ready! Review and edit if needed. ✨',
      })
      setRecipeText('')
    },
    onError: (error: Error) => {
      setMessage({ type: 'error', text: `AI error: ${error.message}` })
    },
  })

  const mutation = useMutation({
    mutationFn: createRecipe,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.lists() })
      // Navigate to the newly created recipe detail page
      navigate({ to: '/recipes/$recipeId', params: { recipeId: data.id } })
    },
    onError: (error: Error) => {
      setMessage({ type: 'error', text: `Error: ${error.message}` })
    },
  })

  const addIngredient = () => {
    setIngredients([...ingredients, { ingredient: '', checked: false }])
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const updateIngredient = (index: number, value: string) => {
    const updated = [...ingredients]
    updated[index].ingredient = value
    setIngredients(updated)
  }

  const handleParseWithAI = () => {
    if (!recipeText.trim()) {
      setMessage({
        type: 'error',
        text: 'Please enter a recipe or description',
      })
      return
    }
    setMessage(null)
    parseMutation.mutate({ data: { text: recipeText } })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    // Filter out empty ingredients
    const validIngredients = ingredients.filter(
      (ing) => ing.ingredient.trim() !== '',
    )

    if (!recipeName.trim() || validIngredients.length === 0) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' })
      return
    }

    // Auto-generate ID from recipe name
    const slug = recipeName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    const uniqueSuffix = Math.random().toString(36).substring(2, 8)
    const recipeId = `${slug}-${uniqueSuffix}`

    mutation.mutate({
      data: {
        id: recipeId,
        name: recipeName.trim(),
        ingredients: validIngredients,
      },
    })
  }

  return (
    <GovUKPageContainer>
      <GovUKPageHeader title="Add New Recipe" />

      {message && (
        <div
          className={`govuk-notification-banner ${
            message.type === 'success'
              ? 'govuk-notification-banner--success'
              : ''
          }`}
          role="alert"
          style={{
            marginBottom: '20px',
            padding: '20px',
            border:
              message.type === 'success'
                ? '5px solid #00703c'
                : '5px solid #d4351c',
          }}
        >
          <GovUKBody
            className={
              message.type === 'success'
                ? 'govuk-!-text-colour-success'
                : 'govuk-!-text-colour-error'
            }
          >
            {message.text}
          </GovUKBody>
        </div>
      )}

      {/* AI Parsing Section */}
      <div className="govuk-form-group" style={{ marginBottom: '40px' }}>
        <h2 className="govuk-label-wrapper">
          <label className="govuk-label govuk-label--l" htmlFor="recipeText">
            Parse or Generate Recipe with AI
          </label>
        </h2>
        <div className="govuk-hint" style={{ marginBottom: '15px' }}>
          Paste an existing recipe, list ingredients, or just describe what you
          want (e.g., "something spicy with chicken and vegetables")
        </div>
        <textarea
          id="recipeText"
          className="govuk-textarea"
          rows={8}
          value={recipeText}
          onChange={(e) => setRecipeText(e.target.value)}
          placeholder="Paste recipe text or describe what you want to make..."
          style={{ marginBottom: '15px' }}
        />
        <GovUKButton
          type="button"
          onClick={handleParseWithAI}
          disabled={parseMutation.isPending || !recipeText.trim()}
        >
          {parseMutation.isPending ? 'Processing...' : 'Generate Recipe'}
        </GovUKButton>
      </div>

      <form onSubmit={handleSubmit} className="govuk-form-group">
        <GovUKFormGroup
          label="Recipe Name"
          htmlFor="recipeName"
          hint="Display name for the recipe"
        >
          <GovUKInput
            id="recipeName"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            required
          />
        </GovUKFormGroup>

        <div className="govuk-form-group">
          <label className="govuk-label govuk-label--m">Ingredients</label>
          {ingredients.map((ing, index) => (
            <div
              key={index}
              style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}
            >
              <input
                type="text"
                className="govuk-input"
                value={ing.ingredient}
                onChange={(e) => updateIngredient(index, e.target.value)}
                placeholder={`Ingredient ${index + 1}`}
                style={{ flex: 1 }}
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  className="govuk-button govuk-button--warning"
                  onClick={() => removeIngredient(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <GovUKButton
            type="button"
            onClick={addIngredient}
            variant="secondary"
          >
            Add Ingredient
          </GovUKButton>
        </div>

        <GovUKButton type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Creating...' : 'Create Recipe'}
        </GovUKButton>
      </form>
    </GovUKPageContainer>
  )
}
