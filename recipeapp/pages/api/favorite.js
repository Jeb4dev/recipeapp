import { buildClient } from '@datocms/cma-client-node';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const { userId, recipeId } = req.body; // Extracting userId and recipeId from request body
      const updatedUser = await updateUserFavorites(userId, recipeId); // Calling updateUserFavorites function

      res.status(200).json({ user: updatedUser });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Something went wrong.' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function updateUserFavorites(userId, recipeId) {
    const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
    try {
      // Fetch current user data to get existing favorites
      const user = await client.items.find(userId);
  
      // Check if the recipeId is already in the favorites array
      const isFavorite = user.favorites.includes(recipeId);
  
      let updatedFavorites;
  
      if (isFavorite) {
        // If the recipeId is already in favorites, remove it
        updatedFavorites = user.favorites.filter(id => id !== recipeId);
      } else {
        // If the recipeId is not in favorites, add it
        updatedFavorites = [...user.favorites, recipeId];
      }
  
      // Construct updateData with updated favorites list
      const updateData = { favorites: updatedFavorites };
  
      return await client.items.update(userId, updateData);
    } catch (error) {
      throw error;
    }
  }

async function getUserFavorites(userId) {
  const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
  try {
    // Fetch current user data to get existing favorites
    const user = await client.items.find(userId);

    // Return the favorites list
    return user.favorites;
  } catch (error) {
    throw error;
  }
}