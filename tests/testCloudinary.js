import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log(process.env.HOST);


// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// cloudinary.api.ping()
//   .then(response => console.log('Cloudinary connection successful:', response))
//   .catch(error => console.error('Cloudinary connection error:', error));
