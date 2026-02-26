import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { useState, FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createRecipe } from '@/data/recipes/createRecipe'
import { queryKeys } from '@/lib/queryKeys'
import {
  GovUKPageContainer,
  GovUKPageHeader,
  GovUKBody,
  GovUKButton,
  GovUKInput,
} from '@/components/govuk'

interface Ingredient {
  ingredient: string
  checked: boolean
}

export function CreateRecipe() {
  const queryClient = useQueryClient()
  const [recipeId, setRecipeId] = useState('')
  const [recipeName, setRecipeName] = useState('')
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { ingredient: '', checked: false },
  ])
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const mutation = useMutation({
    mutationFn: createRecipe,
    onSuccess: () => {
      setMessage({ type: 'success', text: 'Recipe created successfully! ✅' })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.lists() })
      // Reset form
      setRecipeId('')
      setRecipeName('')
      setIngredients([{ ingredient: '', checked: false }])
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage(null)

    // Filter out empty ingredients
    const validIngredients = ingredients.filter((ing) => ing.ingredient.trim() !== '')

    if (!recipeId.trim() || !recipeName.trim() || validIngredients.length === 0) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' })
      return
    }

    mutation.mutate({
      data: {
        id: recipeId.trim(),
        name: recipeName.trim(),
        ingredients: validIngredients,
      },
    })
  }

  return (
    <GovUKPageContainer>
      <GovUKPageHeader title="Add New Recipe" caption="Admin" />

      {message && (
        <div
          className={`govuk-notification-banner ${
            message.type === 'success' ? 'govuk-notification-banner--success' : ''
          }`}
          role="alert"
          style={{
            marginBottom: '20px',
            padding: '20px',
            border: message.type === 'success' ? '5px solid #00703c' : '5px solid #d4351c',
          }}
        >
          <GovUKBody className={message.type === 'success' ? 'govuk-!-colour-green' : 'govuk-!-colour-red'}>
            {message.text}
          </GovUKBody>
        </div>
      )}

      <form onSubmit={handleSubmit} className="govuk-form-group">
        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor="recipe-id">
            Recipe ID
          </label>
          <div className="govuk-hint">
            Unique identifier (e.g., 'chicken-curry', 'beef-stew')
          </div>
          <GovUKInput
            id="recipe-id"
            value={recipeId}
            onChange={(e) => setRecipeId(e.target.value)}
            required
          />
        </div>

        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor="recipe-name">
            Recipe Name
          </label>
          <div className="govuk-hint">
            Display name for the recipe
          </div>
          <GovUKInput
            id="recipe-name"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            required
          />
        </div>

        <div className="govuk-form-group">
          <label className="govuk-label govuk-label--m">Ingredients</label>
          {ingredients.map((ing, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
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
          <GovUKButton type="button" onClick={addIngredient} variant="secondary">
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
