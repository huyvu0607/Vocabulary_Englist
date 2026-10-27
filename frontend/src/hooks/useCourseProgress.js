import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase.js';

export function useCourseProgress(courseId) {
  return useQuery({
    queryKey: ['course-progress', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_progress')
        .select('level, ref_id, total_words, learned_words')
        .eq('p_course_id', courseId);

      if (!error) return data;

      const { data: lessonWords, error: lessonWordsError } = await supabase
        .from('lesson_words')
        .select(`
          lesson_id,
          words(user_vocabularies(is_learned)),
          lessons!inner(
            unit_id,
            units!inner(id, course_id)
          )
        `)
        .eq('lessons.units.course_id', courseId);

      if (lessonWordsError) throw lessonWordsError;

      const progressByUnit = new Map();
      let totalWords = 0;
      let learnedWords = 0;

      for (const item of lessonWords ?? []) {
        const unit = item.lessons?.units;
        if (!unit) continue;

        const isLearned = item.words?.user_vocabularies?.[0]?.is_learned === true;
        const current = progressByUnit.get(unit.id) ?? {
          level: 'unit',
          ref_id: unit.id,
          total_words: 0,
          learned_words: 0,
        };

        current.total_words += 1;
        if (isLearned) current.learned_words += 1;
        progressByUnit.set(unit.id, current);
        totalWords += 1;
        if (isLearned) learnedWords += 1;
      }

      return [
        {
          level: 'course',
          ref_id: courseId,
          total_words: totalWords,
          learned_words: learnedWords,
        },
        ...progressByUnit.values(),
      ];
    },
    enabled: Boolean(courseId),
  });
}