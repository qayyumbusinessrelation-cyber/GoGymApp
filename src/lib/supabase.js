import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nrkqpugylrwflpeyofyc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ya3FwdWd5bHJ3ZmxwZXlvZnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2ODA5NzIsImV4cCI6MjA4OTI1Njk3Mn0.kvBwMInT16c_R6pDuELS8ZdFfnxLIt8IGRjdZMIe5X8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
