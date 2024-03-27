// import the register function from your handler file
import registerHandler from './register';

// Mock the buildClient function
jest.mock('@datocms/cma-client-node', () => ({
  buildClient: jest.fn(() => ({
    items: {
      create: jest.fn(), // Mock the create method
    },
  })),
}));

describe('Register Handler', () => {
  let req;
  let res;

  beforeEach(() => {
    // Initialize req and res objects
    req = {
      method: 'POST',
      body: {
        username: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  it('should register a new user', async () => {
    // Mock the create method of the client
    require('@datocms/cma-client-node').buildClient().items.create.mockResolvedValueOnce({ id: 'mockUserId', username: 'testuser' });

    // Call the handler function
    await registerHandler(req, res);

    // Verify that status 201 is sent with the correct response
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ user: { id: 'mockUserId', username: 'testuser' } });
  });

  it('should handle registration failure', async () => {
    // Mock the create method to throw an error
    require('@datocms/cma-client-node').buildClient().items.create.mockRejectedValueOnce(new Error('Mock error'));

    // Call the handler function
    await registerHandler(req, res);

    // Verify that status 500 is sent with the correct error message
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Something went wrong.' });
  });
});
