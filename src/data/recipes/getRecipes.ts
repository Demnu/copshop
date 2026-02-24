import { createServerFn } from '@tanstack/react-start'
import { promises as fs } from 'fs'
import path from 'path'
import type { RecipeListItem, Recipe } from './recipeSchemas'

export const getRecipes = createServerFn({ method: 'GET' }).handler(
  async (): Promise<RecipeListItem[]> => {
    const recipesDir = path.join(process.cwd(), 'src', 'data', 'recipes', 'json')
    
    try {
      const files = await fs.readdir(recipesDir)
      const jsonFiles = files.filter(file => file.endsWith('.json'))
      
      const recipes: RecipeListItem[] = []
      for (const file of jsonFiles) {
        const filePath = path.join(recipesDir, file)
        const content = await fs.readFile(filePath, 'utf-8')
        const recipe: Recipe = JSON.parse(content)
        recipes.push({ id: recipe.id, name: recipe.name })
      }
      
      return recipes.sort((a, b) => a.name.localeCompare(b.name))
    } catch (error) {
      console.error('Error reading recipes:', error)
      return []
    }
  },
)
