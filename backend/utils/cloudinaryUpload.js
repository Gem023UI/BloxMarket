import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const uploadToCloudinary = async (file, folder = 'avatars') => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `BloxMarket/${folder}`,
      resource_type: 'auto',
    });
    
    // Delete local file after upload
    fs.unlinkSync(file.path);
    
    return result;
  } catch (error) {
    // Delete local file on error
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw error;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};