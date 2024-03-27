import handler from '../pages/api/auth/login';
import { serialize } from 'cookie';
import { encrypt } from '../../../utils/encrypt';

jest.mock('../../../lib/datocms', () => ({
  request: jest.fn(),
}));

jest.mock('cookie', () => ({
  serialize: jest.fn(),
}));

jest.mock('../../../utils/encrypt', () => ({
  encrypt: jest.fn(),
}));

describe('/api/auth/login Route', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should login user and set session cookie', async () => {
    const mockReq = {
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    };

    const mockUser = {
      name: 'Test User',
      id: 'user123',
    };

    const mockEncryptedSessionData = {
      iv: 'mockIV',
      content: 'mockContent',
    };

    const mockSerializedCookie = 'mockSerializedCookie';

    // Mocking signIn function
    handler.signIn = jest.fn().mockResolvedValueOnce(mockUser);

    // Mocking encrypt function
    encrypt.mockReturnValueOnce(mockEncryptedSessionData);

    // Mocking serialize function
    serialize.mockReturnValueOnce(mockSerializedCookie);

    // Mocking response object
    const mockRes = {
      setHeader: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the API route handler
    await handler(mockReq, mockRes);

    // Assertions
    expect(handler.signIn).toHaveBeenCalledWith(mockReq.body.email, mockReq.body.password);
    expect(encrypt).toHaveBeenCalledWith(JSON.stringify(mockReq.body));
    expect(serialize).toHaveBeenCalledWith(
      'session',
      JSON.stringify({
        iv: mockEncryptedSessionData.iv,
        content: mockEncryptedSessionData.content,
        username: mockUser.name,
        userId: mockUser.id,
      }),
      {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      },
    );
    expect(mockRes.setHeader).toHaveBeenCalledWith('Set-Cookie', mockSerializedCookie);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Successfully set cookie!' });
  });

  it('should handle invalid credentials', async () => {
    const mockReq = {
      body: {
        email: 'test@example.com',
        password: 'invalidpassword',
      },
    };

    // Mocking signIn function to throw invalid credentials error
    handler.signIn = jest.fn().mockImplementation(() => {
      const error = new Error('Invalid credentials.');
      error.type = 'CredentialsSignin';
      throw error;
    });

    // Mocking response object
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the API route handler
    await handler(mockReq, mockRes);

    // Assertions
    expect(handler.signIn).toHaveBeenCalledWith(mockReq.body.email, mockReq.body.password);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid credentials.' });
  });

  it('should handle server error', async () => {
    const mockReq = {
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    };

    // Mocking signIn function to throw server error
    handler.signIn = jest.fn().mockRejectedValueOnce(new Error('Server error'));

    // Mocking response object
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the API route handler
    await handler(mockReq, mockRes);

    // Assertions
    expect(handler.signIn).toHaveBeenCalledWith(mockReq.body.email, mockReq.body.password);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Something went wrong.' });
  });
});
