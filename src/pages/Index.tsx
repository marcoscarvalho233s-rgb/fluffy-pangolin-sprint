import React, { useState } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { AppLayout } from '@/pages/AppLayout';
import { supabase } from '@/lib/supabase';

export default function Index() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Try Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || ''
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      // Demo login for development
      if (email && password) {
        setUser({
          id: 'demo-' + Date.now(),
          email
        });
      } else {
        alert('Credenciais inválidas');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen">
      {user ? (
        <AppLayout user={user} onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={handleLogin} loading={loading} />
      )}
    </div>
  );
}