import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getRecipes } from '@/data/recipes/getRecipes'
import { queryKeys } from '@/lib/queryKeys'
import {
  GovUKPageContainer,
  GovUKPageHeader,
  GovUKBody,
  GovUKButton,
} from '@/components/govuk'

export function RecipesListPage() {
  const navigate = useNavigate()

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
              <div key={recipe.id} className="govuk-!-margin-bottom-3">
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
                <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
              </div>
            ))}
          </div>
        </div>
      )}
    </GovUKPageContainer>
  )
}
