import React from 'react';
import { Button } from "@/components/ui/button";
import { Camera } from 'lucide-react';

interface HeaderProps {
  userEmail: string;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userEmail, onLogout }) => {
  return (
    <header className="border-b bg-white">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          <Camera className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold">Meus Projetos</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Olá, {userEmail}</span>
          <Button variant="outline" onClick={onLogout}>
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};