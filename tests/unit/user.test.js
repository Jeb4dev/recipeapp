import handler from '../pages/api/user';
import { buildClient } from '@datocms/cma-client-node';

jest.mock('@datocms/cma-client-node', () => ({
  buildClient: jest.fn(),
}));

describe('Update User API Route', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update user successfully', async () => {
    // Mock request body with user data
    const req = {
      method: 'PUT',
      body: {
        userId: 'user123', // Mock user ID
        username: 'testuser', // Mock username
        email: 'test@example.com', // Mock email
        password: 'testpassword', // Mock password
      },
    };

    // Mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock user object returned from DatoCMS client
    const mockUser = {
      id: 'user123', // Mock user ID
      username: 'testuser', // Mock username
      email: 'test@example.com', // Mock email
      // Add other user fields as needed
    };

    // Mock DatoCMS client response
    buildClient.mockReturnValueOnce({
      items: {
        update: jest.fn().mockResolvedValueOnce(mockUser),
      },
    });

    // Call the API route handler
    await handler(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ user: mockUser });
  });

  it('should handle invalid HTTP method', async () => {
    // Mock request with invalid HTTP method
    const req = {
      method: 'GET', // Use an invalid HTTP method
    };

    // Mock response object
    const res = {
      setHeader: jest.fn().mockReturnThis(),
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
