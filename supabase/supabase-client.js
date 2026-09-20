const SUPABASE_URL = "https://xwyemudnvqrbnuvmrwwk.supabase.co";
const SUPABASE_KEY = "sb_publishable_xEfNNealcJeZlz2vgXUwsw_qAZPjyaZ";

window.supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);