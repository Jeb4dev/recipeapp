import { buildClient } from '@datocms/cma-client-node';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const { userId, username, email, password } = req.body;
      const updatedUser = await updateUser(userId, username, email, password);

      res.status(200).json({ user: updatedUser });
    } catch (error) {
      const errorMessage = parseError(error);
      res.status(500).json({ error: errorMessage });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
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

async function updateUser(userId, username, email, password) {
  const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
  try {
    const updateData = { username, email };

    // Only include password in updateData if it is not empty
    if (password.trim() !== '') {
      updateData.password = password;
    }

    return await client.items.update(userId, updateData);
  } catch (error) {
    throw error;
  }
}
