import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://supabase.shampooautomat.shop';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzE1MDUwODAwLAogICJleHAiOiAxODcyODE3MjAwCn0.ICBw01FtPCputg1ZvKzBvk0TA-3uiDZXQArYhjwj0-M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);