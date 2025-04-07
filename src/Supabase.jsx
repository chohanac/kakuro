import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lrjecdxchgpgwvfansby.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyamVjZHhjaGdwZ3d2ZmFuc2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5ODY3MDIsImV4cCI6MjA1OTU2MjcwMn0.ORv15-Q0VVaaKWF4giPCIHIJyDr2dpGxBntgECoeD3s';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


