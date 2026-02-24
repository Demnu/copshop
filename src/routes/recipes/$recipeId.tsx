import { createFileRoute } from '@tanstack/react-router'
import { RecipeDetail } from '@/pages/RecipeDetail/RecipeDetail'

export const Route = createFileRoute('/recipes/$recipeId')({
  component: RecipeDetailPage,
  head: () => ({
    meta: [
      {
        title: 'Recipe - CopShop',
      },
    ],
  }),
})

function RecipeDetailPage() {
  return <RecipeDetail />
}
