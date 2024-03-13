import { buildClient } from '@datocms/cma-client-node';

export default async function handler(req, res) {
  try {
    const { title, description, ingredients, instructions, serving, images, author, likes } = req.body;
    
    console.log('Received request body:', req.body);

    if (!title || !description || !ingredients || !instructions || !serving || !images || !author) {
      throw new Error('Missing required fields in request body');
    }

    // Create ingredients and instructions
    const createdIngredients = await createIngredients(ingredients);
    const createdInstructions = await createInstructions(instructions);

    // Create recipe with the created ingredients and instructions
    const newRecipe = await createRecipe(title, description, createdIngredients, createdInstructions, serving, images, author);

    res.status(201).json({ recipe: newRecipe });
  } catch (error) {
    console.error('Error in API route:', error);
    const errorMessage = parseError(error);
    res.status(500).json({ error: errorMessage });
  }
}

async function parseError(error) {
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

async function createIngredients(ingredients) {
  const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
  console.log('Starting to create ingredients');
  try {
    const createdIngredients = await Promise.all(ingredients.map(async (ingredient) => {
      const newIngredient = await client.items.create({
        item_type: { type: 'item_type', id: 'KzctSfFlRaqAAJRJYezRzA' },
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit
      });
      console.log('Created ingredient:', newIngredient);
      return newIngredient;
    }));
    console.log('Finished creating ingredients');
    return createdIngredients;
  } catch (error) {
    console.log('Error creating ingredients');
    throw error;
  }
}

async function createInstructions(instructions) {
  const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
  console.log('Starting to create instructions');
  try {
    const createdInstructions = await Promise.all(instructions.map(async (instruction) => {
      const newInstruction = await client.items.create({
        item_type: { type: 'item_type', id: 'cYA4fVw2QOq8FY766ObmqA' },
        instruction: instruction.instruction
      });
      console.log('Created instruction:', newInstruction);
      return newInstruction;
    }));
    console.log('Finished creating instructions');
    return createdInstructions;
  } catch (error) {
    console.log('Error creating instructions');
    throw error;
  }
}

async function createRecipe(title, description, ingredients, instructions, serving, images, author) {
  const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
  console.log('Starting to create a new recipe');
  try {
    const record = await client.items.create({
      item_type: { type: 'item_type', id: 'InWodoopRq2APQiyEmYXGQ' },
      title: title,
      description: description,
      ingredients: ingredients.map((ingredient) => ({ item: ingredient.id })),
      instructions: instructions.map((instruction) => ({ item: instruction.id })),
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
