import handler from '../pages/api/favorite';
import { buildClient } from '@datocms/cma-client-node';

jest.mock('@datocms/cma-client-node', () => ({
  buildClient: jest.fn(),
}));

describe('Favorite API Route', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update user favorites by adding a new recipe', async () => {
    // Mock request body for adding a new recipe to favorites
    const req = {
      method: 'PUT',
      body: {
        userId: 'user123', // Provide the user ID
        recipeId: 'recipe456', // Provide the recipe ID to add to favorites
      },
    };

    // Mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock expected response from DatoCMS client
    const expectedResponse = {
      user: {
        id: 'user123', // Mock updated user ID
        favorites: ['recipe456', 'recipe789'], // Mock updated favorites array
      },
    };

    // Mock DatoCMS client response
    buildClient.mockReturnValueOnce({
      items: {
        find: jest.fn().mockResolvedValueOnce({
          favorites: ['recipe789'], // Mock existing favorites for the user
        }),
        update: jest.fn().mockResolvedValueOnce(expectedResponse.user),
      },
    });

    // Call the API route handler
    await handler(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it('should update user favorites by removing an existing recipe', async () => {
    // Mock request body for removing an existing recipe from favorites
    const req = {
      method: 'PUT',
      body: {
        userId: 'user123', // Provide the user ID
        recipeId: 'recipe789', // Provide the recipe ID to remove from favorites
      },
    };

    // Mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock expected response from DatoCMS client
    const expectedResponse = {
      user: {
        id: 'user123', // Mock updated user ID
        favorites: [], // Mock updated favorites array after removal
      },
    };

    // Mock DatoCMS client response
    buildClient.mockReturnValueOnce({
      items: {
        find: jest.fn().mockResolvedValueOnce({
          favorites: ['recipe789'], // Mock existing favorites for the user
        }),
        update: jest.fn().mockResolvedValueOnce(expectedResponse.user),
      },
    });

    // Call the API route handler
    await handler(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it('should handle invalid HTTP method', async () => {
    // Mock request with invalid HTTP method
    const req = {
      method: 'GET', // Use an invalid HTTP method
    };

    // Mock response object
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };

    // Call the API route handler
    await handler(req, res);

    // Assertions
    expect(res.setHeader).toHaveBeenCalledWith('Allow', ['PUT']);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.end).toHaveBeenCalledWith(`Method ${req.method} Not Allowed`);
  });

  // Add more test cases as needed
});
