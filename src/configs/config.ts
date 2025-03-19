import dotenv from 'dotenv';
dotenv.config();

export const ENV_VARS = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI || "mongodb+srv://kumar:kumar$12@cluster0.viepc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    JWT_SECRET: process.env.JWT_SECRET || '5BBwVDqSTF7zfLTFseSH6tzpTVy1UWr27xWHYNT2eMg=',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'dbz9ocmoh',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "885253798614896",
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "WOzUYMsqhFR_HGPta_LtgmoBoTA",
}