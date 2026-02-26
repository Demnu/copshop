import { createFileRoute } from '@tanstack/react-router'
import { RecipeAdmin } from '@/pages/RecipeAdmin/RecipeAdmin'

export const Route = createFileRoute('/recipes/admin')({
  component: RecipeAdmin,
})
