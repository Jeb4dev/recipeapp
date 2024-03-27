import handler from '../pages/api/uploadimage';
import { buildClient } from '@datocms/cma-client-node';

jest.mock('@datocms/cma-client-node', () => ({
  buildClient: jest.fn(),
}));

describe('Upload Image API Route', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should upload image successfully', async () => {
    // Mock request body with image URL
    const req = {
      method: 'POST',
      body: {
        imageUrl: 'https://example.com/image.jpg', // Provide a sample image URL
      },
    };

    // Mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock upload object returned from DatoCMS client
    const mockUpload = {
      id: 'upload123', // Mock upload ID
      url: 'https://example.datocms.com/uploads/upload123.jpg', // Mock uploaded image URL
      path: '/uploads/upload123.jpg', // Mock uploaded image path
      format: 'jpg', // Mock uploaded image format
    };

    // Mock DatoCMS client response
    buildClient.mockReturnValueOnce({
      uploads: {
        createFromUrl: jest.fn().mockResolvedValueOnce(mockUpload),
      },
    });

    // Call the API route handler
    await handler(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, upload: mockUpload });
  });

  it('should handle invalid HTTP method', async () => {
    // Mock request with invalid HTTP method
    const req = {
      method: 'GET', // Use an invalid HTTP method
    };

    // Mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the API route handler
    await handler(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Method Not Allowed' });
  });

  // Add more test cases as needed
});
