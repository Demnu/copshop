import { createFileRoute } from '@tanstack/react-router'
import { RecipesList } from '@/pages/RecipesList/RecipesList'

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
  return <RecipesList />
}
