import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase.js';

export function useLessonWords(lessonId) {
  return useQuery({
    queryKey: ['lesson-words', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lesson_words')
        .select(`
          position, 
          words(
            id, word, part_of_speech, phonetic, meaning_vi, 
            example_en, example_vi, 
            user_vocabularies(is_learned)
          )
        `)
        .eq('lesson_id', lessonId)
        .order('position');

      if (error) throw error;
      return data;
    },
    enabled: Boolean(lessonId),
  });
}
