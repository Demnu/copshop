import { createFileRoute } from '@tanstack/react-router'
import { RecipesListPage } from '@/pages/RecipesList/RecipesListPage'

export const Route = createFileRoute('/recipes/')({
  component: RecipesPage,
  head: () => ({
    meta: [
      {
        title: 'Recipes - CopShop',
      },
      {
        name: 'description',
        content: 'View recipes and shopping lists.',
      },
    ],
  }),
})

function RecipesPage() {
  return <RecipesListPage />
}
