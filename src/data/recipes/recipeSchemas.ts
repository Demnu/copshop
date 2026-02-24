export interface RecipeIngredient {
  ingredient: string
  checked: boolean
}

export interface Recipe {
  id: string
  name: string
  ingredients: RecipeIngredient[]
}

export interface RecipeListItem {
  id: string
  name: string
}
