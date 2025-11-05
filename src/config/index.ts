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

  open_router_api_KEY: process.env.OPEN_ROUTER_API_KEY as string,
  stript_secret_key: process.env.STRIPE_SECRET_KEY as string,

  jwt: {
    jwt_secret: process.env.JWT_SECRET as string,
    expires_in: process.env.EXPIRES_IN as string,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET as string,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
    reset_pass_secret: process.env.RESET_PASS_TOKEN as string,
    reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN as string,
  },
  salt_round: process.env.SALT_ROUND,
  reset_pass_link: process.env.RESET_PASS_LINK,

  emailSender: {
    email: process.env.EMAIL,
    app_pass: process.env.APP_PASS,
  },
};
