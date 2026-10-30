import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbkmnbgbzshelfsnbvhq.supabase.co';

const supabaseKey = 'sb_publishable_daPAaBJg5A-oQIXUAGNZhQ_mgW-LTlb';

export const supabase = createClient(supabaseUrl, supabaseKey);
