import { buildClient } from '@datocms/cma-client-node';

export default async function handler(req, res) {
  try {
    const { id, title, description, ingredients, instructions, regonly, action } = req.body;

    console.log('Received request body:', req.body);

    if (!id) {
      throw new Error('Recipe ID is required');
    }

    let response;
    if (action === 'edit') {
      response = await editRecipe(id, title, description, ingredients, instructions, regonly);
    } else if (action === 'delete') {
      response = await deleteRecipe(id);
    } else {
      throw new Error('Invalid action specified');
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in API route:', error);
    res.status(500).json({ error: error.message });
  }
}

async function editRecipe(id, title, description, ingredients, instructions, regonly) {
  const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
  console.log('Starting to edit recipe:', id);
  try {
    // Update recipe with the provided data
    const updatedRecipe = await client.items.update(id, {
      title,
      description,
      regonly,
    });

    // Update existing instructions with the provided data
    for (const instructionId of updatedRecipe.instructions) {
      const index = updatedRecipe.instructions.indexOf(instructionId);
      if (instructions[index]) {
        await client.items.update(instructionId, {
          instruction: instructions[index].instruction,
        });
        console.log('Updated instruction:', instructionId);
      } else {
        console.warn('Instruction not found for index:', index);
      }
    }

    // Update existing ingredients with the provided data
for (const ingredientId of updatedRecipe.ingredients) {
  const index = updatedRecipe.ingredients.indexOf(ingredientId);
  if (ingredients[index]) {
    await client.items.update(ingredientId, {
      name: ingredients[index].name,
      amount: ingredients[index].amount,
      unit: ingredients[index].unit,
    });
    console.log('Updated ingredient:', ingredientId);
  } else {
    console.warn('Ingredient not found for index:', index);
  }
}

    // Add new instructions if there are more instructions in the 'instructions' array
    const existingInstructionIds = updatedRecipe.instructions;
    const numExistingInstructions = existingInstructionIds.length;
    const numNewInstructions = instructions.length - numExistingInstructions;

    if (numNewInstructions > 0) {
      const newInstructions = instructions.slice(numExistingInstructions);
      console.log(newInstructions);
      const formattedInstructions = newInstructions.map(instructionObj => instructionObj.instruction);
      const createdInstructions = await createInstructions(formattedInstructions);
      const newInstructionIds = createdInstructions.map(instruction => instruction.id);
      
      // Update the recipe to include the newly created instruction IDs
      const updatedRecipeWithNewInstructions = await client.items.update(id, {
        instructions: [...existingInstructionIds, ...newInstructionIds],
      });
      
      console.log('Added new instructions:', newInstructionIds);
      console.log('Updated recipe with new instructions:', updatedRecipeWithNewInstructions);
    } else if (numNewInstructions < 0) {
      // Remove excess instructions from the recipe
      const instructionsToRemove = existingInstructionIds.slice(instructions.length);
      for (const instructionId of instructionsToRemove) {
        await client.items.destroy(instructionId);
        console.log('Removed instruction:', instructionId);
      }
      
      // Update the recipe to remove the excess instructions
      const updatedRecipeWithoutExcessInstructions = await client.items.update(id, {
        instructions: existingInstructionIds.slice(0, instructions.length),
      });
      
      console.log('Removed excess instructions');
      console.log('Updated recipe without excess instructions:', updatedRecipeWithoutExcessInstructions);
    }

    // Add new ingredients if there are more ingredients in the 'ingredients' array
    const existingIngredientIds = updatedRecipe.ingredients;
    const numExistingIngredients = existingIngredientIds.length;
    const numNewIngredients = ingredients.length - numExistingIngredients;

    if (numNewIngredients > 0) {
      const newIngredients = ingredients.slice(numExistingIngredients);
      console.log(newIngredients);
      const formattedNewIngredients = newIngredients.map(ingredientObj => ({
        name: ingredientObj.name,
        amount: ingredientObj.amount,
        unit: ingredientObj.unit,
      }));
      const createdIngredients = await createIngredients(formattedNewIngredients);
      const newIngredientIds = createdIngredients.map(ingredient => ingredient.id);
      
      // Update the recipe to include the newly created ingredient IDs
      const updatedRecipeWithNewIngredients = await client.items.update(id, {
        ingredients: [...existingIngredientIds, ...newIngredientIds],
      });
      
      console.log('Added new ingredients:', newIngredientIds);
      console.log('Updated recipe with new ingredients:', updatedRecipeWithNewIngredients);
    } else if (numNewIngredients < 0) {
      // Remove excess ingredients from the recipe
      const ingredientsToRemove = existingIngredientIds.slice(ingredients.length);
      for (const ingredientId of ingredientsToRemove) {
        await client.items.destroy(ingredientId);
        console.log('Removed ingredient:', ingredientId);
      }
      
      // Update the recipe to remove the excess ingredients
      const updatedRecipeWithoutExcessIngredients = await client.items.update(id, {
        ingredients: existingIngredientIds.slice(0, ingredients.length),
      });
      
      console.log('Removed excess ingredients');
      console.log('Updated recipe without excess ingredients:', updatedRecipeWithoutExcessIngredients);
    }


    console.log('Edited recipe:', updatedRecipe);
    return { success: true, message: 'Recipe updated successfully' };
  } catch (error) {
    console.error('Error editing recipe:', error);
    throw error;
  }
}

async function createInstructions(instructions) {
  const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
  console.log('Starting to create instructions');
  console.log(instructions)
  try {
    const createdInstructions = await Promise.all(instructions.map(async (instruction) => {
      const newInstruction = await client.items.create({
        item_type: { type: 'item_type', id: 'cYA4fVw2QOq8FY766ObmqA' },
        instruction: instruction
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

async function createIngredients(ingredients) {
  const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
  console.log('Starting to create ingredients');
  try {
    const createdIngredients = await Promise.all(ingredients.map(async (ingredient) => {
      const newIngredient = await client.items.create({
        item_type: { type: 'item_type', id: 'KzctSfFlRaqAAJRJYezRzA' },
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
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

async function deleteRecipe(id) {
  const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
  console.log('Starting to delete recipe:', id);
  try {
    // Delete the recipe with the provided ID
    await client.items.destroy(id);
    console.log('Deleted recipe with ID:', id);
    return { success: true, message: 'Recipe deleted successfully' };
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
}