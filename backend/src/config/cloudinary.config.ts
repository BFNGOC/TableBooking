import { v2 as cloudinary } from 'cloudinary';

export const configureCloudinary = (config: {
  cloud_name?: string;
  api_key?: string;
  api_secret?: string;
  secure?: boolean;
}) => {
  cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret,
    secure: config.secure ?? true,
  });

  return cloudinary;
};

export default cloudinary;
