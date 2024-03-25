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
        regonly
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

async function updateRecipe(recipeId, title, description, ingredients, instructions, images, author, regonly) {
  const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
  try {
    // Fetch the existing recipe data
    const existingRecipe = await client.items.find(recipeId);

    // Update the recipe data with the provided information
    const updatedData = {
      title,
      description,
      images: images.map((image) => ({ ...image })),
      author,
      regonly
    };

    // Update ingredients if provided
    if (ingredients) {
      updatedData.ingredients = ingredients.map((ingredient) => {
        const existingIngredient = existingRecipe.ingredients.find(
          (existing) => existing.id === ingredient.id
        );
        // Merge the updated fields with existing data
        return { ...existingIngredient, ...ingredient };
      });
    } else {
      // If no new ingredients provided, keep existing ones
      updatedData.ingredients = existingRecipe.ingredients;
    }

    // Update instructions if provided
    if (instructions) {
      updatedData.instructions = instructions.map((instruction) => {
        const existingInstruction = existingRecipe.instructions.find(
          (existing) => existing.id === instruction.id
        );
        // Merge the updated fields with existing data
        return { ...existingInstruction, ...instruction };
      });
    } else {
      // If no new instructions provided, keep existing ones
      updatedData.instructions = existingRecipe.instructions;
    }

    // Remove ingredients that are no longer present in the UI
    updatedData.ingredients = updatedData.ingredients.filter(ingredient => ingredients.some(newIngredient => newIngredient.id === ingredient.id));

    // Remove instructions that are no longer present in the UI
    updatedData.instructions = updatedData.instructions.filter(instruction => instructions.some(newInstruction => newInstruction.id === instruction.id));

    // Update the recipe
    return await client.items.update(recipeId, updatedData);
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
