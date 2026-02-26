import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { Link, useNavigate } from '@tanstack/react-router'
import { getRecipes } from '@/data/recipes/getRecipes'
import { deleteRecipe } from '@/data/recipes/deleteRecipe'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import {
  GovUKPageContainer,
  GovUKPageHeader,
  GovUKBody,
  GovUKButton,
} from '@/components/govuk'

export function RecipesListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: queryKeys.recipes.lists(),
    queryFn: () => getRecipes(),
  })

  if (isLoading) {
    return (
      <GovUKPageContainer>
        <GovUKBody>Loading recipes...</GovUKBody>
      </GovUKPageContainer>
    )
  }

  return (
    <GovUKPageContainer>
      <GovUKPageHeader title="Recipes" caption="Shopping lists for Aldi">
        <Link to="/recipes/addRecipe">
          <GovUKButton>Add recipe</GovUKButton>
        </Link>
      </GovUKPageHeader>

      {recipes.length === 0 ? (
        <GovUKBody>No recipes found</GovUKBody>
      ) : (
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-full">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="govuk-!-margin-bottom-3"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ flex: 1 }}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate({
                        to: '/recipes/$recipeId',
                        params: { recipeId: recipe.id },
                      })
                    }}
                    className="govuk-link govuk-heading-m govuk-!-margin-bottom-1"
                    style={{ display: 'block', textDecoration: 'none' }}
                  >
                    {recipe.name}
                  </a>
                  <p
                    className="govuk-body-s govuk-!-margin-bottom-0"
                    style={{ color: '#505a5f' }}
                  >
                    Tap to view ingredients
                  </p>
                </div>
                <GovUKButton
                  variant="warning"
                  style={{ marginLeft: 16 }}
                  onClick={async () => {
                    if (
                      !window.confirm(
                        'Are you sure you want to delete this recipe?',
                      )
                    )
                      return
                    try {
                      await deleteRecipe({ data: { recipeId: recipe.id } })
                      await queryClient.invalidateQueries({
                        queryKey: queryKeys.recipes.lists(),
                      })
                      await queryClient.refetchQueries({
                        queryKey: queryKeys.recipes.lists(),
                      })
                    } catch (error) {
                      alert('Failed to delete recipe.')
                      console.error(error)
                    }
                  }}
                >
                  Delete
                </GovUKButton>
                <hr
                  className="govuk-section-break govuk-section-break--m govuk-section-break--visible"
                  style={{ marginLeft: 16 }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </GovUKPageContainer>
  )
}
