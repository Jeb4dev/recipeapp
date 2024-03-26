import { buildClient } from '@datocms/cma-client-node';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const { userId, recipeId } = req.body; // Extracting userId and recipeId from request body
      const updatedRecipe = await updateRecipeLikes(userId, recipeId); // Calling updateRecipeLikes function

      res.status(200).json({ recipe: updatedRecipe });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Something went wrong.' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function updateRecipeLikes(userId, recipeId) {
  const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
  try {
    // Fetch current recipe data to get existing userLikes
    const recipe = await client.items.find(recipeId);

    // Check if the userId is already in the userLikes array
    const isLiked = recipe.userLikes.includes(userId);

    let updatedUserLikes;

    if (isLiked) {
      // If the userId is already in userLikes, remove it
      updatedUserLikes = recipe.userLikes.filter(id => id !== userId);
    } else {
      // If the userId is not in userLikes, add it
      updatedUserLikes = [...recipe.userLikes, userId];
    }

    // Construct updateData with updated userLikes list
    const updateData = { userLikes: updatedUserLikes };

    return await client.items.update(recipeId, updateData);
  } catch (error) {
    throw error;
  }
}