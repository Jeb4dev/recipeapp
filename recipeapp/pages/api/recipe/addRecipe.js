import { buildClient } from '@datocms/cma-client-node';

export default async function handler(req, res) {
  try {
    const { title, description, likes, author } = req.body;
    const newRecipe = await addRecipe(title, description, likes, author);

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

async function addRecipe(title, description, likes, author) {
  const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
  console.log('Starting to create a new recipe');
  try {
    const record = await client.items.create({
      item_type: { type: 'item_type', id: 'a3N32-cxTVq4Bb8tLec0wg' },
      title: title,
      description: description,
      likes: likes,
      author: author,
    });
    console.log('Created a new recipe');
    return record;
  } catch (error) {
    console.log('Error creating a new recipe');
    throw error;
  }
}
