import { buildClient } from '@datocms/cma-client-node';

export default async function handler(req, res) {
  try {
    const { title, description, ingredients, instructions, serving, images, author } = req.body;
    const newRecipe = await createRecipe(title, description, ingredients, instructions, serving, images, author);

    res.status(201).json({ recipe: newRecipe });
  } catch (error) {
    const errorMessage = parseError(error);
    res.status(500).json({ error: errorMessage });
  }
}

function parseError(error) {
  console.log('Error:', error);
  if (error.errors) {
    return error.errors
      .map((err) => {
        const field = err.attributes.details.field;
        const code = err.attributes.details.code;
        if (code === 'VALIDATION_UNIQUE') {
          return `${field.charAt(0).toUpperCase() + field.slice(1)} is already in use.`;
        }
        return 'Something went wrong.';
      })
      .join(' ');
  }
  return 'Something went wrong.';
}

async function createRecipe(title, description, ingredients, instructions, serving, images, author) {
  const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
  console.log('Starting to create a new recipe');
  try {
    const record = await client.items.create({
      item_type: { type: 'item_type', id: 'InWodoopRq2APQiyEmYXGQ' },
      title: title,
      description: description,
      ingredients: ingredients.map((ingredient) => ({ ...ingredient })),
      instructions: instructions.map((instruction) => ({ ...instruction })),
      serving: serving,
      images: images.map((image) => ({ ...image })),
      author: author,
    });
    console.log('Created a new recipe');
    return record;
  } catch (error) {
    console.log('Error creating a new recipe');
    throw error;
  }
}
