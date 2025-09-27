import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Chrome } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onGoogleLogin: () => void;
  loading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onGoogleLogin, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-800 p-3 rounded-full">
              <Camera className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-800">Meus Projetos</CardTitle>
          <CardDescription className="text-gray-600">Organize e compartilhe suas fotos</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-300 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-gray-300 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white" type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Ou continue com</span>
              </div>
            </div>
            <Button 
              type="button" 
              onClick={onGoogleLogin}
              className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
              disabled={loading}
            >
              <Chrome className="h-5 w-5 mr-2" />
              Entrar com Google
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};