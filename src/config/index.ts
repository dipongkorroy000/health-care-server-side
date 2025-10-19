import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_round: process.env.HASH_PASSWORD,
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
  },
  jwt_access_secret_key: process.env.JWT_ACCESS_SECRET_KEY as string,
  jwt_refresh_secret_key: process.env.JWT_REFRESH_SECRET_KEY as string,

  open_router_api_KEY: process.env.OPEN_ROUTER_API_KEY as string,
};
