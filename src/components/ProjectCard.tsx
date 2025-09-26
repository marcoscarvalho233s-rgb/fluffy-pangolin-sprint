import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users } from 'lucide-react';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
          <span className="text-4xl opacity-50">📷</span>
        </div>
        {project.compartilhado && (
          <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow">
            <Users className="h-4 w-4" />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1">{project.nome}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {project.descricao || 'Sem descrição'}
        </p>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{project.fotos_count || 0} fotos</span>
          <span>{new Date(project.data_criacao).toLocaleDateString('pt-BR')}</span>
        </div>
        {project.proprietario !== 'demo@exemplo.com' && (
          <div className="text-xs text-purple-600 italic mt-2">
            Compartilhado por: {project.proprietario}
          </div>
        )}
      </CardContent>
    </Card>
  );
};