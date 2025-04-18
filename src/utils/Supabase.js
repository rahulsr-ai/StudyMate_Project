import { createClient } from "@supabase/supabase-js";



const supabase = createClient(
    "https://jtxvaqctajkhgkjekams.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0eHZhcWN0YWpraGdramVrYW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5OTQ1NDYsImV4cCI6MjA1NjU3MDU0Nn0.IJZ8nAiJ03JNQBUMd2LaTCoKb3GjQv1IBJfDDUNBR-8"
);

export default supabase;
