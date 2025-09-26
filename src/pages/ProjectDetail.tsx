import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Upload, Download, Share2, ArrowLeft } from 'lucide-react';
import { PhotoCard } from '@/components/PhotoCard';
import { CameraModal } from '@/components/CameraModal';
import { ShareModal } from '@/components/ShareModal';
import { Photo, Project } from '@/types';
import { supabase } from '@/lib/supabase';
import { notifyN8N } from '@/lib/n8n';

interface ProjectDetailPageProps {
  project: Project;
  onBack: () => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ project, onBack }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProjectPhotos();
  }, [project.id]);

  const loadProjectPhotos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('fotos')
        .select('*')
        .eq('projeto_id', project.id);
      
      if (error) throw error;
      
      if (data) {
        setPhotos(data as Photo[]);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCapturePhoto = async (blob: Blob) => {
    const fileName = `foto_${Date.now()}.jpg`;
    const photo = await savePhoto(blob, fileName, true);
    if (photo) {
      setPhotos(prev => [photo, ...prev]);
      updateProjectPhotoCount(1);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const photo = await savePhoto(file, file.name);
      if (photo) {
        setPhotos(prev => [photo, ...prev]);
        updateProjectPhotoCount(1);
      }
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const savePhoto = async (file: Blob, fileName: string, isCamera = false) => {
    try {
      let photoUrl = null;
      let storagePath = null;

      // Upload to Supabase Storage
      const fileExt = isCamera ? 'jpg' : fileName.split('.').pop();
      const uniqueName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      storagePath = `projetos/${project.id}/${uniqueName}`;

      const { error: uploadError } = await supabase.storage
        .from('fotos-projetos')
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('fotos-projetos')
        .getPublicUrl(storagePath);
      
      photoUrl = publicUrl;

      // Notify n8n
      notifyN8N('foto_upload', {
        projeto_id: project.id,
        arquivo: uniqueName,
        url: photoUrl,
        usuario: 'demo@exemplo.com', // In a real app, this would be the actual user
        tamanho: file.size
      });

      const newPhoto: Photo = {
        id: Date.now() + Math.random(),
        nome_arquivo: fileName,
        url: photoUrl,
        tamanho_kb: Math.round(file.size / 1024),
        tipo_mime: file.type,
        data_upload: new Date().toISOString(),
        projeto_id: project.id,
        storage_path: storagePath
      };

      // Save to database
      const { error: insertError } = await supabase
        .from('fotos')
        .insert(newPhoto);
      
      if (insertError) throw insertError;

      return newPhoto;
    } catch (error) {
      console.error('Save photo error:', error);
      return null;
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (!confirm('Tem certeza que deseja deletar esta foto?')) return;

    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;

    try {
      // Delete from Supabase Storage
      if (photo.storage_path) {
        await supabase.storage
          .from('fotos-projetos')
          .remove([photo.storage_path]);
        
        await supabase
          .from('fotos')
          .delete()
          .eq('id', photoId);

        // Notify n8n
        notifyN8N('foto_delete', {
          projeto_id: project.id,
          arquivo: photo.nome_arquivo,
          usuario: 'demo@exemplo.com' // In a real app, this would be the actual user
        });
      }

      setPhotos(prev => prev.filter(p => p.id !== photoId));
      updateProjectPhotoCount(-1);
    } catch (error) {
      console.error('Delete photo error:', error);
      alert('Erro ao deletar a foto.');
    }
  };

  const updateProjectPhotoCount = async (delta: number) => {
    try {
      const newCount = Math.max((project.fotos_count || 0) + delta, 0);
      
      await supabase
        .from('projetos')
        .update({ fotos_count: newCount })
        .eq('id', project.id);
    } catch (error) {
      console.error('Update project count error:', error);
    }
  };

  const handleDownloadProject = async () => {
    if (photos.length === 0) {
      alert('Nenhuma foto para baixar');
      return;
    }

    alert('Funcionalidade de download em desenvolvimento. Em uma versão completa, isso criaria um ZIP com todas as fotos do projeto.');
    
    // Notify n8n
    notifyN8N('projeto_download', {
      projeto_id: project.id,
      projeto_nome: project.nome,
      usuario: 'demo@exemplo.com', // In a real app, this would be the actual user
      total_fotos: photos.length,
      formato: 'zip'
    });
  };

  const handleShareProject = async (email: string, permission: string) => {
    if (email === 'demo@exemplo.com') {
      alert('Você não pode compartilhar com você mesmo');
      return;
    }

    try {
      const newShare = {
        id: Date.now(),
        projeto_id: project.id,
        email_convidado: email,
        permissao: permission,
        data_convite: new Date().toISOString(),
        status: 'pendente'
      };

      // Save to database
      await supabase
        .from('compartilhamentos')
        .insert(newShare);
      
      await supabase
        .from('projetos')
        .update({ compartilhado: true })
        .eq('id', project.id);

      alert(`Convite enviado para ${email}!`);
    } catch (error) {
      console.error('Share project error:', error);
      alert('Erro ao compartilhar projeto.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{project.nome}</h1>
            <p className="text-muted-foreground">{photos.length} fotos</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setIsCameraOpen(true)}>
            <Camera className="mr-2 h-4 w-4" /> Tirar Foto
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" /> Galeria
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          
          {photos.length > 0 && (
            <Button variant="outline" onClick={handleDownloadProject}>
              <Download className="mr-2 h-4 w-4" /> Baixar ZIP
            </Button>
          )}
          
          <Button variant="outline" onClick={() => setIsShareModalOpen(true)}>
            <Share2 className="mr-2 h-4 w-4" /> Compartilhar
          </Button>
        </div>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📷</div>
          <h3 className="text-xl font-semibold mb-2">Nenhuma foto ainda</h3>
          <p className="text-muted-foreground mb-4">Use a câmera para tirar fotos ou adicione da galeria</p>
          <div className="flex justify-center gap-2">
            <Button onClick={() => setIsCameraOpen(true)}>
              <Camera className="mr-2 h-4 w-4" /> Tirar Foto
            </Button>
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" /> Adicionar da Galeria
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map(photo => (
            <PhotoCard 
              key={photo.id} 
              photo={photo} 
              onDelete={handleDeletePhoto} 
            />
          ))}
        </div>
      )}

      <CameraModal
        open={isCameraOpen}
        projectName={project.nome}
        onOpenChange={setIsCameraOpen}
        onCapture={handleCapturePhoto}
      />

      <ShareModal
        open={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
        onShare={handleShareProject}
        userEmail="demo@exemplo.com" // In a real app, this would be the actual user email
      />
    </div>
  );
};