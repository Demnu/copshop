import { createFileRoute } from '@tanstack/react-router'
import { RecipeDetailPage } from '@/pages/RecipeDetail/RecipeDetailPage'

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
