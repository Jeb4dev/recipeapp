import { buildClient } from '@datocms/cma-client-node';

export default async function handler(req, res) {
    try {
      const { id, comment, action } = req.body;
  
      if (!id || !comment || !action) {
        throw new Error('Recipe ID, comment, and action are required');
      }
  
      console.log('Request received:', { id, comment, action });

      let response;
      if (action === 'edit') {
        console.log('Editing recipe with comment...');
        response = await editRecipeWithComment(id, comment);
      } else if (action === 'delete') {
        console.log('Deleting comment...');
        response = await deleteComment(id, comment);
      } else {
        throw new Error('Invalid action specified');
      }
  
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in API route:', error);
      res.status(500).json({ error: error.message });
    }
}

async function createComment(comment, timestamp) {
    const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
  
    try {
      console.log('Creating comment:', { comment, timestamp });
      const createdComment = await client.items.create({
        item_type: { type: 'item_type', id: 'bJ4dABoqSG2At0W6DiG5Eg' },
        comment: comment,
        timestamp: timestamp,
      });
  
      return createdComment;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
}

async function editRecipeWithComment(recipeId, commentText) {
    const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
    try {
      // Create the comment
      const timestamp = new Date().toISOString();
      console.log('Creating new comment for recipe:', recipeId);
      const newComment = await createComment(commentText, timestamp);
  
      // Fetch the existing comments of the recipe

      const recipe = await client.items.find(recipeId);
  
      // Ensure that recipe.comments is an array
      const commentsArray = Array.isArray(recipe.comments) ? recipe.comments : [];
  
      // Update the recipe to include the new comment ID
      const updatedComments = [...commentsArray, newComment.id];
      console.log('Updating recipe with new comments:', { recipeId, updatedComments });
      const updatedRecipe = await client.items.update(recipeId, {
        comments: updatedComments,
      });
  
      return { success: true, message: 'Recipe updated successfully' };
    } catch (error) {
      console.error('Error editing recipe with comment:', error);
      throw error;
    }
  }
