# Recipes Format

Add new recipes as JSON files in this directory.

## Simple Format

```json
{
  "id": "recipe-name-slug",
  "name": "Recipe Display Name",
  "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"]
}
```

## Example

```json
{
  "id": "chicken-curry",
  "name": "Chicken Curry",
  "ingredients": [
    "500g chicken breast",
    "1 onion",
    "2 cloves garlic",
    "1 can coconut milk",
    "2 tbsp curry powder",
    "Rice",
    "Salt and pepper"
  ]
}
```

## Notes

- `id` should be lowercase with hyphens (used in URL)
- `name` is the display name shown to users
- `ingredients` is a simple array of strings
- Each recipe is saved as `{id}.json` in the `json/` folder
- Perfect format for AI generation - just provide ingredients as a list!
