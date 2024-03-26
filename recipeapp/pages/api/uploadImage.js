import { buildClient } from "@datocms/cma-client-node";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const client = buildClient({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
      
      // Extract the image URL and filename from the request body
      const { imageUrl } = req.body;
      
      // Generate a random filename if not provided
      const randomizedFilename = `${Math.random().toString(36).substring(7)}.png`;
      
      // Create upload resource from a remote URL
      const upload = await client.uploads.createFromUrl({
        url: imageUrl,
        filename: randomizedFilename,
        skipCreationIfAlreadyExists: true,
      });

      res.status(200).json({ success: true, upload });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}