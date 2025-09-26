// Mock implementation since we can't install @supabase/supabase-js
export const supabase = {
  auth: {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      // Mock authentication - in a real app, this would call Supabase
      if (email && password) {
        return {
          data: {
            user: {
              id: 'mock-user-id',
              email
            }
          },
          error: null
        };
      } else {
        return {
          data: { user: null },
          error: { message: 'Invalid credentials' }
        };
      }
    },
    signOut: async () => {
      // Mock sign out
      return { error: null };
    }
  }
};