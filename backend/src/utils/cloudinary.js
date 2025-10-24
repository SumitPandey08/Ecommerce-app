import {v2 as cloudinary} from 'cloudinary' ;
import fs from 'fs'
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME ,
    api_key: process.env.API_KEY ,
    api_secret: process.env.API_SECRET 
})

const uploadOnCloudinary = async (localFilePath) => {
    console.log("Cloudinary ENV:", {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
    try {
        if (!localFilePath) {
            return null;
        }
        const file = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });
        console.log("File Is Uploaded", file.url);
        return file;
    } catch (error) { // <-- Add error parameter
        console.error("Cloudinary upload error:", error); // <-- Log the error
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
}

export { uploadOnCloudinary }