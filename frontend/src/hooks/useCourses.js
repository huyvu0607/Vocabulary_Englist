import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase.js';

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('position');

      if (error) throw error;
      return data;
    },
    enabled: Boolean(supabase),
  });
}
