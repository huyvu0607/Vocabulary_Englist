import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../contexts/AuthProvider.jsx';

export function useToggleLearned() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ wordId, isLearned }) => {
      if (!supabase || !user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('user_vocabularies')
        .upsert(
          { 
            user_id: user.id, 
            word_id: wordId, 
            is_learned: isLearned 
          }, 
          { onConflict: 'user_id,word_id' }
        );
      
      if (error) throw error;
      return { wordId, isLearned };
    },
    onMutate: async ({ wordId, isLearned }) => {
      await queryClient.cancelQueries({ queryKey: ['lesson-words'] });
      const previousQueries = queryClient.getQueriesData({ queryKey: ['lesson-words'] });

      previousQueries.forEach(([queryKey, data]) => {
        if (Array.isArray(data)) {
          queryClient.setQueryData(queryKey, data.map(item => {
            if (item?.words?.id === wordId) {
              const userVocabs = item.words.user_vocabularies || [];
              const updatedVocabs = userVocabs.length 
                ? [{ ...userVocabs[0], is_learned: isLearned }]
                : [{ is_learned: isLearned }];
              return { ...item, words: { ...item.words, user_vocabularies: updatedVocabs } };
            }
            return item;
          }));
        }
      });

      return { previousQueries };
    },
    onError: (err, variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      // Notification is handled by the component calling the mutation
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-words'] });
    },
  });
}
