import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase.js';

export function useCourseTree(courseId) {
  return useQuery({
    queryKey: ['course-tree', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          position,
          units(
            id,
            title,
            position,
            lessons(
              id,
              title,
              position
            )
          )
        `)
        .eq('id', courseId)
        .single();

      if (error) throw error;

      return {
        ...data,
        units: [...(data.units ?? [])]
          .sort((a, b) => a.position - b.position)
          .map((unit) => ({
            ...unit,
            lessons: [...(unit.lessons ?? [])].sort((a, b) => a.position - b.position),
          })),
      };
    },
    enabled: Boolean(supabase && courseId),
  });
}
