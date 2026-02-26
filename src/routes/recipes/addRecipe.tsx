import { AddRecipePage } from '@/pages/AddRecipe/AddRecipePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/recipes/addRecipe')({
  component: AddRecipePage,
})
