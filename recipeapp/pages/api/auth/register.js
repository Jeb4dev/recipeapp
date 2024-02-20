import { buildClient } from '@datocms/cma-client-node';

export default async function handler(req, res) {
  try {
    const { username, name, email, password } = req.body;
    const newUser = await register(username, name, email, password);

    res.status(201).json({ user: newUser });
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

async function register(username, name, email, password) {
  const client = buildClient({ apiToken: process.env.NEXT_DATOCMS_API_TOKEN });
  console.log('Starting to create a new user');
  try {
    const record = await client.items.create({
      item_type: { type: 'item_type', id: 'a3N32-cxTVq4Bb8tLec0wg' },
      username: username,
      name: name,
      email: email,
      password: password,
    });
    console.log('Created a new user');
    return record;
  } catch (error) {
    console.log('Error creating a new user');
    throw error;
  }
}
