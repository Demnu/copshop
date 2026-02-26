import { createFileRoute } from '@tanstack/react-router'
import { AddRecipePage } from '@/pages/RecipeAdmin/AddRecipePage'

export const Route = createFileRoute('/recipes/admin')({
  component: AddRecipePage,
})
