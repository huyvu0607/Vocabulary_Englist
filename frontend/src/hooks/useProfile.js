import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../contexts/AuthProvider.jsx';

export function useProfile() {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, role, target_course_id, target_score, daily_words')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: Boolean(userId),
  });
}
