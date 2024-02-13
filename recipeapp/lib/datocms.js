import { GraphQLClient } from 'graphql-request';

const endpoint = 'https://graphql.datocms.com/';
const token = process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN;

const client = new GraphQLClient(endpoint, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export async function request({ query, variables, includeDrafts, excludeInvalid }) {
  const headers = {
    authorization: `Bearer ${token}`,
  };
  if (includeDrafts) {
    headers['X-Include-Drafts'] = 'true';
  }
  if (excludeInvalid) {
    headers['X-Exclude-Invalid'] = 'true';
  }
  const client = new GraphQLClient(endpoint, { headers });
  return client.request(query, variables);
}

export async function createRecipe({ title, description, likes, author }) {
  const query = `
    mutation CreateRecipe($title: String!, $description: String!, $likes: Int!, $author: String!) {
      createRecipe(data: { title: $title, description: $description, likes: $likes, author: $author, image: { url: "https://www.datocms-assets.com/your-image-path/oig1.jpg" } }) {
        id
        title
        description
        likes
        author
        image {
          url
        }
      }
    }
  `;

  const variables = { title, description, likes, author };

  try {
    const data = await request({ query, variables });
    return data.createRecipe;
  } catch (error) {
    console.error('Error creating recipe:', error.response?.errors || error.message);
    throw new Error('Failed to create recipe');
  }
}