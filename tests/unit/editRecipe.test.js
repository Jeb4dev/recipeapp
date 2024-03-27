import handler from '../pages/api/editRecipe';
import { buildClient } from '@datocms/cma-client-node';

jest.mock('@datocms/cma-client-node', () => ({
  buildClient: jest.fn(),
}));

describe('editRecipe API Route', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle editing recipe successfully', async () => {
    // Mock request body for editing recipe
    const req = {
      method: 'PUT',
      body: {
        id: '123456', // Provide the recipe ID to edit
        title: 'Updated Recipe Title', // Provide updated recipe title
        description: 'Updated Recipe Description', // Provide updated recipe description
        ingredients: [
          { name: 'Ingredient 1', amount: 100, unit: 'g' },
          { name: 'Ingredient 2', amount: 2, unit: 'cups' },
        ], // Provide updated ingredients array
        instructions: [{ instruction: 'Instruction 1' }, { instruction: 'Instruction 2' }], // Provide updated instructions array
        regonly: false, // Provide updated value for regonly
        action: 'edit', // Specify action as 'edit' for editing recipe
      },
    };

    // Mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock expected response from DatoCMS client
    const expectedResponse = {
      success: true,
      message: 'Recipe updated successfully',
    };

    // Mock DatoCMS client response
    buildClient.mockReturnValueOnce({
      items: {
        update: jest.fn().mockResolvedValueOnce(expectedResponse),
      },
    });

    // Call the API route handler
    await handler(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it('should handle deleting recipe successfully', async () => {
    // Mock request body for deleting recipe
    const req = {
      method: 'PUT',
      body: {
        id: '123456', // Provide the recipe ID to delete
        action: 'delete', // Specify action as 'delete' for deleting recipe
      },
    };

    // Mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock expected response from DatoCMS client
    const expectedResponse = {
      success: true,
      message: 'Recipe deleted successfully',
    };

    // Mock DatoCMS client response
    buildClient.mockReturnValueOnce({
      items: {
        destroy: jest.fn().mockResolvedValueOnce(),
      },
    });

    // Call the API route handler
    await handler(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it('should handle invalid action specified', async () => {
    // Mock request body with invalid action
    const req = {
      method: 'PUT',
      body: {
        action: 'invalid', // Provide an invalid action
      },
    };

    // Mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the API route handler
    await handler(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid action specified' });
  });

  // Add more test cases as needed
});
