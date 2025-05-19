import { Cloudinary } from 'cloudinary-core';

const cloudinary = new Cloudinary({
  cloud_name: 'djzlfebzw', // Replace with your Cloud Name
  api_key: '513926873944628', // Replace with your API Key
  api_secret: '1rD2ZhmotJ4AZQYIbw2FbrioRD0', // Replace with your API Secret (keep secure)
  secure: true,
});

export default cloudinary;