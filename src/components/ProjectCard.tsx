import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users } from 'lucide-react';

interface ProjectCardProps {
  project: any;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
          <span className="text-5xl">📷</span>
        </div>
        {project.compartilhado && (
          <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow">
            <Users className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1">{project.nome}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{project.descricao || 'Sem descrição'}</p>
        <div className="flex justify-between text-xs text-gray-400">
          <span>{project.fotos_count || 0} fotos</span>
          <span>{new Date(project.data_criacao).toLocaleDateString('pt-BR')}</span>
        </div>
        {project.proprietario !== 'demo@exemplo.com' && (
          <div className="text-xs text-purple-500 italic mt-2">
            Compartilhado por: {project.proprietario}
          </div>
        )}
      </CardContent>
    </Card>
  );
};