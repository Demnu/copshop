import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getRecipeById } from '@/data/recipes/getRecipeById'
import { updateRecipeChecked } from '@/data/recipes/updateRecipeChecked'
import { clearAllRecipeChecked } from '@/data/recipes/clearAllRecipeChecked'
import { deleteRecipe } from '@/data/recipes/deleteRecipe'
import { queryKeys } from '@/lib/queryKeys'
import {
  GovUKPageContainer,
  GovUKPageHeader,
  GovUKBackLink,
  GovUKBody,
  GovUKButton,
  GovUKCheckbox,
} from '@/components/govuk'

export function RecipeDetailPage() {
  const { recipeId } = useParams({ from: '/recipes/$recipeId' })
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: recipe, isLoading } = useQuery({
    queryKey: queryKeys.recipes.detail(recipeId),
    queryFn: () => getRecipeById({ data: { recipeId } }),
  })

  // Toggle individual ingredient
  const toggleItem = async (index: number) => {
    if (!recipe) return

    const newCheckedState = !recipe.ingredients[index].checked

    // Optimistically update the UI
    queryClient.setQueryData(queryKeys.recipes.detail(recipeId), {
      ...recipe,
      ingredients: recipe.ingredients.map((ing, i) =>
        i === index ? { ...ing, checked: newCheckedState } : ing,
      ),
    })

    // Save to JSON file
    try {
      await updateRecipeChecked({
        data: {
          recipeId: recipe.id,
          ingredientIndex: index,
          checked: newCheckedState,
        },
      })
    } catch (error) {
      console.error('Failed to save checked state:', error)
      // Revert on error
      queryClient.invalidateQueries({
        queryKey: queryKeys.recipes.detail(recipeId),
      })
    }
  }

  const clearAll = async () => {
    if (!recipe) return

    // Optimistically update all to unchecked
    queryClient.setQueryData(queryKeys.recipes.detail(recipeId), {
      ...recipe,
      ingredients: recipe.ingredients.map((ing) => ({
        ...ing,
        checked: false,
      })),
    })

    // Save to JSON in a single operation
    try {
      await clearAllRecipeChecked({
        data: {
          recipeId: recipe.id,
        },
      })
    } catch (error) {
      console.error('Failed to clear checked state:', error)
      // Revert on error
      queryClient.invalidateQueries({
        queryKey: queryKeys.recipes.detail(recipeId),
      })
    }
  }

  if (isLoading) {
    return (
      <GovUKPageContainer>
        <GovUKBody>Loading recipe...</GovUKBody>
      </GovUKPageContainer>
    )
  }

  if (!recipe) {
    return (
      <GovUKPageContainer>
        <GovUKBackLink onClick={() => navigate({ to: '/recipes' })}>
          Back to recipes
        </GovUKBackLink>
        <GovUKBody>Recipe not found</GovUKBody>
      </GovUKPageContainer>
    )
  }

  const checkedCount = recipe.ingredients.filter((ing) => ing.checked).length
  const allChecked = checkedCount === recipe.ingredients.length

  const handleDelete = async () => {
    if (!recipe) return
    if (!window.confirm('Are you sure you want to delete this recipe?')) return
    try {
      await deleteRecipe({ data: { recipeId: recipe.id } })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.lists() })
      navigate({ to: '/recipes' })
    } catch (error) {
      alert('Failed to delete recipe.')
      console.error(error)
    }
  }

  return (
    <GovUKPageContainer>
      <GovUKBackLink onClick={() => navigate({ to: '/recipes' })}>
        Back to recipes
      </GovUKBackLink>

      <GovUKPageHeader
        title={recipe.name}
        caption={`${checkedCount} of ${recipe.ingredients.length} checked`}
      >
        <GovUKButton
          variant="danger"
          onClick={handleDelete}
          style={{ float: 'right' }}
        >
          Delete recipe
        </GovUKButton>
      </GovUKPageHeader>

      {checkedCount > 0 && (
        <div className="govuk-!-margin-bottom-6">
          <GovUKButton variant="warning" onClick={clearAll}>
            Clear all
          </GovUKButton>
        </div>
      )}

      <h2 className="govuk-heading-l">Shopping List</h2>

      <div className="govuk-checkboxes" data-module="govuk-checkboxes">
        {recipe.ingredients.map((item, index: number) => {
          return (
            <GovUKCheckbox
              key={index}
              label={item.ingredient}
              checked={item.checked}
              onChange={() => toggleItem(index)}
              strikethrough
            />
          )
        })}
      </div>

      {allChecked && (
        <div className="govuk-panel govuk-panel--confirmation govuk-!-margin-top-6">
          <div className="govuk-panel__body">✓ All items collected!</div>
        </div>
      )}
    </GovUKPageContainer>
  )
}
