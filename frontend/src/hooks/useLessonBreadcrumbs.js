import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase.js';

export function useLessonBreadcrumbs(lessonId) {
  return useQuery({
    queryKey: ['lesson-breadcrumbs', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select(`
          id, title, 
          units(id, title, courses(id, title))
        `)
        .eq('id', lessonId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: Boolean(lessonId),
  });
}
