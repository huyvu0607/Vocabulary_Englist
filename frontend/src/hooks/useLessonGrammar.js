import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase.js';

export function useLessonGrammar(lessonId) {
  return useQuery({
    queryKey: ['grammar', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grammar_points')
        .select('id, title, content, position')
        .eq('lesson_id', lessonId)
        .order('position');

      if (error) throw error;
      return data;
    },
    enabled: Boolean(lessonId),
  });
}