import { buildClient } from '@datocms/cma-client-node';

export default async function handler(req, res) {
  const { method, body } = req;

  if (method === 'PUT') {
    try {
      const { recipeId, title, description, ingredients, instructions, images, author, regonly } = body;
      const updatedRecipe = await updateRecipe(
        recipeId,
        title,
        description,
        ingredients,
        instructions,
        images,
        author,
        regonly,
      );

      res.status(200).json({ recipe: updatedRecipe });
    } catch (error) {
      const errorMessage = parseError(error);
      res.status(500).json({ error: errorMessage });
    }
  } else if (method === 'DELETE') {
    try {
      const { recipeId } = body;
      await deleteRecipe(recipeId);

      res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
      const errorMessage = parseError(error);
      res.status(500).json({ error: errorMessage });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
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

async function updateRecipe(recipeId, title, description, ingredients, instructions, serving, images, author, regonly) {
  const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
  try {
    const updateData = {
      title,
      description,
      ingredients: ingredients.map((ingredient) => ({ ...ingredient })),
      instructions: instructions.map((instruction) => ({ ...instruction })),
      serving,
      images: images.map((image) => ({ ...image })),
      author: author,
      regonly: regonly,
    };
    return await client.items.update(recipeId, updateData);
  } catch (error) {
    throw error;
  }
}

async function deleteRecipe(recipeId) {
  const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
  try {
    await client.items.destroy(recipeId);
  } catch (error) {
    throw error;
  }
}
