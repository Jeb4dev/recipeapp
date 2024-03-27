import { buildClient } from '@datocms/cma-client-node';

export default async function handler(req, res) {
  try {
    const { title, description, ingredients, instructions, author, regonly, images} = req.body;

    if (!title || !description || !ingredients || !instructions) {
      throw new Error('Missing key fields');
    }

    // Create ingredients and instructions
    const createdIngredients = await createIngredients(ingredients);
    const createdInstructions = await createInstructions(instructions);

    // Create recipe with the created ingredients and instructions
    const newRecipe = await createRecipe(
      title,
      description,
      createdIngredients,
      createdInstructions,
      author,
      regonly,
      images,
    );

    res.status(201).json({ recipe: newRecipe });
  } catch (error) {
    console.error('Error in API route:', error);
    res.status(500).json({ error: errorMessage });
  }
}

async function createIngredients(ingredients) {
  const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
  try {
    const createdIngredients = await Promise.all(
      ingredients.map(async (ingredient) => {
        const newIngredient = await client.items.create({
          item_type: { type: 'item_type', id: 'KzctSfFlRaqAAJRJYezRzA' },
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
        });
        return newIngredient;
      }),
    );
    return createdIngredients;
  } catch (error) {
    console.log('Error creating ingredients');
    throw error;
  }
}

async function createInstructions(instructions) {
  const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
  try {
    const createdInstructions = await Promise.all(
      instructions.map(async (instruction) => {
        const newInstruction = await client.items.create({
          item_type: { type: 'item_type', id: 'cYA4fVw2QOq8FY766ObmqA' },
          instruction: instruction,
        });
        return newInstruction;
      }),
    );
    return createdInstructions;
  } catch (error) {
    console.log('Error creating instructions');
    throw error;
  }
}

async function createRecipe(title, description, ingredients, instructions, author, regonly, images) {
  const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });

  try {

    const instructionIDs = instructions.map(instruction => {
      return instruction.id;
    });

    const ingredientIDs = ingredients.map(ingredient => {
    return ingredient.id;
    });

    const imageArray = images.map(image => ({
      upload_id: image.upload.id,
    }));

    const record = await client.items.create({
      item_type: { type: 'item_type', id: 'InWodoopRq2APQiyEmYXGQ' },
      title: title,
      description: description,
      ingredients: ingredientIDs,
      instructions: instructionIDs,
      author: author,
      regonly: regonly,
      image: imageArray,
    });
    return record;
  } catch (error) {
    console.log('Error creating a new recipe');
    throw error;
  }
}
