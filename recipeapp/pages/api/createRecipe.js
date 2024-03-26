import { buildClient } from '@datocms/cma-client-node';

export default async function handler(req, res) {
  try {
    const { title, description, ingredients, instructions, author, regonly} = req.body;
    
    console.log('Received request body:', req.body);

    if (!title || !description || !ingredients || !instructions) {
      throw new Error('Missing key fields');
    }

    // Create ingredients and instructions
    const createdIngredients = await createIngredients(ingredients);
    const createdInstructions = await createInstructions(instructions);

    /* // Upload images
    const uploadedImages = await Promise.all(
      formData.images.map(async (image) => {
        const upload = await uploadImage(image);
        return upload.url; // Return only the URL of the uploaded image
      })
    );
    
    // Extract image URLs
    const imageURLs = uploadedImages.map(upload => upload.url); */

    // Create recipe with the created ingredients and instructions
    const newRecipe = await createRecipe(
      title,
      description,
      createdIngredients,
      createdInstructions,
      author,
      regonly,
    );

    res.status(201).json({ recipe: newRecipe });
  } catch (error) {
    console.error('Error in API route:', error);
    res.status(500).json({ error: errorMessage });
  }
}

async function uploadImage(image) {
  const client = buildClient({ apiToken: process.env.DATOCMS_API_TOKEN });
  try {
    const upload = await client.uploads.createFromBinary({
      filename: image.name,
      mimeType: image.type,
      binaryContent: image,
    });
    console.log('Uploaded image:', upload);
    return upload;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

async function createIngredients(ingredients) {
  const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
  console.log('Starting to create ingredients');
  try {
    const createdIngredients = await Promise.all(
      ingredients.map(async (ingredient) => {
        const newIngredient = await client.items.create({
          item_type: { type: 'item_type', id: 'KzctSfFlRaqAAJRJYezRzA' },
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
        });
        console.log('Created ingredient:', newIngredient);
        return newIngredient;
      }),
    );
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
  console.log(instructions)
  try {
    const createdInstructions = await Promise.all(
      instructions.map(async (instruction) => {
        const newInstruction = await client.items.create({
          item_type: { type: 'item_type', id: 'cYA4fVw2QOq8FY766ObmqA' },
          instruction: instruction,
        });
        console.log('Created instruction:', newInstruction);
        return newInstruction;
      }),
    );
    console.log('Finished creating instructions');
    return createdInstructions;
  } catch (error) {
    console.log('Error creating instructions');
    throw error;
  }
}

async function createRecipe(title, description, ingredients, instructions, author, regonly) {
  const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
  console.log('Starting to create a new recipe');
  console.log(regonly)
  try {

    const instructionIDs = instructions.map(instruction => {
      // Assuming instruction is an object with an ID property
      return instruction.id;
    });

    const ingredientIDs = ingredients.map(ingredient => {
    // Assuming instruction is an object with an ID property
    return ingredient.id;
    });

    const record = await client.items.create({
      item_type: { type: 'item_type', id: 'InWodoopRq2APQiyEmYXGQ' },
      title: title,
      description: description,
      ingredients: ingredientIDs,
      instructions: instructionIDs,
      //images: images,
      author: author,
      regonly: regonly,
    });
    console.log('Created a new recipe');
    return record;
  } catch (error) {
    console.log('Error creating a new recipe');
    throw error;
  }
}
