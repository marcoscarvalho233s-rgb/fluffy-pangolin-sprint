import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Download, Share2 } from 'lucide-react';

interface ProjectHeaderProps {
  title: string;
  photoCount: number;
  onBack: () => void;
  onCamera: () => void;
  onUpload: (files: FileList) => void;
  onDownload: () => void;
  onShare: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  title,
  photoCount,
  onBack,
  onCamera,
  onUpload,
  onDownload,
  onShare
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <p className="text-gray-500">{photoCount} fotos</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button onClick={onCamera} className="bg-gray-800 hover:bg-gray-700 text-white">
          <Camera className="h-4 w-4 mr-2" />
          Tirar Foto
        </Button>
        
        <label className="cursor-pointer">
          <Button className="bg-gray-600 hover:bg-gray-500 text-white">
            <Download className="h-4 w-4 mr-2" />
            Galeria
          </Button>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            onChange={(e) => e.target.files && onUpload(e.target.files)}
          />
        </label>
        
        <Button 
          onClick={onDownload} 
          className="bg-gray-500 hover:bg-gray-400 text-white"
          disabled={photoCount === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Baixar ZIP
        </Button>
        
        <Button onClick={onShare} className="bg-gray-400 hover:bg-gray-300 text-gray-800">
          <Share2 className="h-4 w-4 mr-2" />
          Compartilhar
        </Button>
      </div>
    </div>
  );
};