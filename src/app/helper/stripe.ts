import Stripe from "stripe";
import config from "../../config";

export const stripe = new Stripe(config.stript_secret_key)



