import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import streamifier from 'streamifier'; // Required to convert Buffer to Readable Stream

dotenv.config();

const cloudinaryOptions = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

cloudinary.config(cloudinaryOptions);

export const uploadDisplayPicture = async (request, response) => {
  console.log('Upload request received:', request.body);

  try {
    if (!request.file) {
      return response.status(400).json({ error: 'No file uploaded' });
    }

    // Convert the buffer into a readable stream
    const uploadStream = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'chatee-user-dps' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(request.file.buffer).pipe(stream);
      });
    };

    const result = await uploadStream();

    response.json({ imageUrl: result.secure_url });
    console.log('Upload successful:', result);

  } catch (error) {
    console.error('Upload error:', error);
    response.status(500).json({ error: error.message });
  }
};
