import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, MoreVertical, Share2, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  project: any;
  onClick: () => void;
  onShare: (project: any) => void;
  onDelete: (project: any) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, onShare, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all duration-300 border border-gray-200 bg-white rounded-lg"
      onClick={onClick}
    >
      <div className="relative">
        <div className="h-40 bg-gray-100 flex items-center justify-center rounded-t-lg">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
        </div>
        {project.compartilhado && (
          <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-sm">
            <Users className="h-5 w-5 text-gray-600" />
          </div>
        )}
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger 
            onClick={(e) => e.stopPropagation()}
            className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm hover:bg-white transition-colors"
          >
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            className="w-48"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => onShare(project)}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={() => onDelete(project)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1">{project.nome}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{project.descricao || 'Sem descrição'}</p>
        <div className="flex justify-between text-xs text-gray-400">
          <span>{project.fotos_count || 0} fotos</span>
          <span>{new Date(project.data_criacao).toLocaleDateString('pt-BR')}</span>
        </div>
        {project.proprietario !== 'demo@exemplo.com' && (
          <div className="text-xs text-gray-500 italic mt-2">
            Compartilhado por: {project.proprietario}
          </div>
        )}
      </CardContent>
    </Card>
  );
};