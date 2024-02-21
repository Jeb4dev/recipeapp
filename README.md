# Introduction 

This web-based application offers the following features:

- User Management: Users can register, log in, and admi user can monitor other users accounts and recipes.
- Recipe Management: Registered users can add, edit, and delete their own recipes. Recipes can be marked as private.
- Recipe Discovery: Users can search for recipes by ingredients or keywords, review recipes, and create a list of favorite recipes.
- Recipe Reviewing: Registered users can review others recipes.
- Recipe Sharing: Users can share recipes via email or social media

## Technology

We are using Next.js for the frontend and backend and DatoCMS for Backend. We use best practise code linting and formatting tools like EsLint and Prettier. 
TailwindCSS is used for styling frontend. 

# Getting Started

## Requirements

- Node 20

## Running in development environment

1. Clone the repository `git clone <repo-url>`
2. Change directory to recipe app `cd recipeapp`
3. Install dependacies `npm install`
4. Copy `env.example` into `env.local` with `cp env.example env.local`
5. Change `NEXT_DATOCMS_API_TOKEN` value to the correct API-token (that can be found from [DatoCMS](https://recipeapp.admin.datocms.com/project_settings/access_tokens))
6. Start dev server `npm run dev`

# Contributing

Before committing your changes, please run `npm run format`. Please do not commit broken code to main.

# Build and Test

- `npm run build`

- `npm run test` < not implemented
