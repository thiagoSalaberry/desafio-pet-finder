import {v2 as cloudinary} from "cloudinary";
import "dotenv/config";
const CLOUDINARY_CLOUD_NAME:string = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY:string = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET:string = process.env.CLOUDINARY_API_SECRET;
cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

export {cloudinary};