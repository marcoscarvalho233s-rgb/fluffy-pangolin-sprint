import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';

interface PhotoCardProps {
  photo: any;
  onDelete: (id: number) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onDelete }) => {
  return (
    <Card className="overflow-hidden group">
      <div className="relative aspect-square">
        <img 
          src={photo.url} 
          alt={photo.nome_arquivo} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
          <Button
            variant="destructive"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(photo.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-3">
        <p className="font-medium text-sm truncate">{photo.nome_arquivo}</p>
        <p className="text-xs text-gray-500">
          {photo.tamanho_kb || 0}KB • {new Date(photo.data_upload).toLocaleDateString('pt-BR')}
        </p>
      </div>
    </Card>
  );
};