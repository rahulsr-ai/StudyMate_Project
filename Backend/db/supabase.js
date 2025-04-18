import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv'
dotenv.config(); // ✅ Load .env file into process.env


const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
);


export default supabase;
