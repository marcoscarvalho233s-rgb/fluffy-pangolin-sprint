import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { LoginForm } from "@/components/LoginForm";
import { ProjectCard } from "@/components/ProjectCard";
import { PhotoCard } from "@/components/PhotoCard";
import { CameraView } from "@/components/CameraView";
import { ProjectHeader } from "@/components/ProjectHeader";
import { NewProjectModal } from "@/components/NewProjectModal";
import { ShareModal } from "@/components/ShareModal";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { notifyN8N } from "@/lib/n8n";
import { motion } from "framer-motion";
import { 
  Camera as CameraIcon, 
  Image, 
  Users, 
  Calendar,
  TrendingUp,
  FolderOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { toast } = useToast();

  // Load demo data
  useEffect(() => {
    if (!user) return;
    
    const demoProjects = [
      {
        id: 1,
        nome: 'Reforma da Casa',
        descricao: 'Acompanhamento das obras',
        data_criacao: '2024-01-14T10:00:00Z',
        fotos_count: 12,
        proprietario: user.email,
        compartilhado: false
      },
      {
        id: 2,
        nome: 'Viagem Família',
        descricao: 'Fotos da viagem para Gramado',
        data_criacao: '2024-01-09T10:00:00Z',
        fotos_count: 45,
        proprietario: user.email,
        compartilhado: true
      },
      {
        id: 3,
        nome: 'Projeto Trabalho',
        descricao: 'Documentação do projeto',
        data_criacao: '2024-01-11T10:00:00Z',
        fotos_count: 8,
        proprietario: 'outro@email.com',
        compartilhado: true
      }
    ];
    
    setProjects(demoProjects);
  }, [user]);

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
        setUser({ ...data.user, email });
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao Meus Projetos"
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // Demo login fallback
      if (email && password) {
        setUser({ id: 'demo-' + Date.now(), email });
        toast({
          title: "Modo demonstração",
          description: "Você está usando o aplicativo em modo de demonstração"
        });
      } else {
        toast({
          title: "Erro no login",
          description: "Credenciais inválidas",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      // Try Supabase Google authentication
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
      
      // The OAuth flow will redirect the user
    } catch (error: any) {
      console.error('Google login error:', error);
      // Demo login fallback
      setUser({ id: 'demo-' + Date.now(), email: 'demo@gmail.com' });
      toast({
        title: "Modo demonstração",
        description: "Você está usando o aplicativo em modo de demonstração"
      });
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setUser(null);
    setSelectedProject(null);
    setPhotos([]);
    setShowCamera(false);
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta"
    });
  };

  const handleProjectSelect = (project: any) => {
    setSelectedProject(project);
    // Load demo photos
    const demoPhotos = Array.from({ length: project.fotos_count }, (_, i) => ({
      id: i + 1,
      nome_arquivo: `foto_${i + 1}.jpg`,
      url: `https://picsum.photos/seed/${project.id}-${i}/400/400`,
      tamanho_kb: Math.floor(Math.random() * 2000) + 500,
      tipo_mime: 'image/jpeg',
      data_upload: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      projeto_id: project.id
    }));
    setPhotos(demoPhotos);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setPhotos([]);
  };

  const handleCapturePhoto = async (blob: Blob) => {
    if (!selectedProject) return;
    
    try {
      const fileName = `foto_${Date.now()}.jpg`;
      
      // Create photo object
      const photo = {
        id: Date.now(),
        nome_arquivo: fileName,
        url: URL.createObjectURL(blob),
        tamanho_kb: Math.round(blob.size / 1024),
        tipo_mime: blob.type,
        data_upload: new Date().toISOString(),
        projeto_id: selectedProject.id
      };
      
      // Add to photos list
      setPhotos(prev => [photo, ...prev]);
      
      // Update project photo count
      setProjects(prev => prev.map(p => 
        p.id === selectedProject.id 
          ? { ...p, fotos_count: (p.fotos_count || 0) + 1 } 
          : p
      ));
      
      // Update selected project
      setSelectedProject(prev => ({
        ...prev,
        fotos_count: (prev.fotos_count || 0) + 1
      }));
      
      // Notify n8n
      await notifyN8N('foto_upload', {
        projeto_id: selectedProject.id,
        arquivo: fileName,
        url: photo.url,
        usuario: user.email,
        tamanho: blob.size
      });
      
      toast({
        title: "Foto capturada!",
        description: "A foto foi adicionada ao projeto"
      });
    } catch (error) {
      console.error('Capture photo error:', error);
      toast({
        title: "Erro ao capturar foto",
        description: "Não foi possível adicionar a foto ao projeto",
        variant: "destructive"
      });
    } finally {
      setShowCamera(false);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!selectedProject) return;
    
    try {
      const newPhotos = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const photo = {
          id: Date.now() + i,
          nome_arquivo: file.name,
          url: URL.createObjectURL(file),
          tamanho_kb: Math.round(file.size / 1024),
          tipo_mime: file.type,
          data_upload: new Date().toISOString(),
          projeto_id: selectedProject.id
        };
        
        newPhotos.push(photo);
      }
      
      // Add to photos list
      setPhotos(prev => [...newPhotos, ...prev]);
      
      // Update project photo count
      setProjects(prev => prev.map(p => 
        p.id === selectedProject.id 
          ? { ...p, fotos_count: (p.fotos_count || 0) + files.length } 
          : p
      ));
      
      // Update selected project
      setSelectedProject(prev => ({
        ...prev,
        fotos_count: (prev.fotos_count || 0) + files.length
      }));
      
      toast({
        title: "Fotos adicionadas!",
        description: `${files.length} foto(s) foram adicionadas ao projeto`
      });
    } catch (error) {
      console.error('File upload error:', error);
      toast({
        title: "Erro ao adicionar fotos",
        description: "Não foi possível adicionar as fotos ao projeto",
        variant: "destructive"
      });
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (!selectedProject) return;
    
    try {
      const photo = photos.find(p => p.id === photoId);
      if (!photo) return;
      
      // Remove from photos list
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      
      // Update project photo count
      setProjects(prev => prev.map(p => 
        p.id === selectedProject.id 
          ? { ...p, fotos_count: Math.max((p.fotos_count || 0) - 1, 0) } 
          : p
      ));
      
      // Update selected project
      setSelectedProject(prev => ({
        ...prev,
        fotos_count: Math.max((prev.fotos_count || 0) - 1, 0)
      }));
      
      // Notify n8n
      await notifyN8N('foto_delete', {
        projeto_id: selectedProject.id,
        arquivo: photo.nome_arquivo,
        usuario: user.email
      });
      
      toast({
        title: "Foto excluída",
        description: "A foto foi removida do projeto"
      });
    } catch (error) {
      console.error('Delete photo error:', error);
      toast({
        title: "Erro ao excluir foto",
        description: "Não foi possível remover a foto do projeto",
        variant: "destructive"
      });
    }
  };

  const handleDownloadProject = async () => {
    if (!selectedProject || photos.length === 0) return;
    
    try {
      toast({
        title: "Download não disponível",
        description: "O download de ZIP não está configurado neste exemplo",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível gerar o arquivo ZIP",
        variant: "destructive"
      });
    }
  };

  const handleCreateProject = async (name: string, description: string) => {
    try {
      const newProject = {
        id: Date.now(),
        nome: name,
        descricao: description,
        data_criacao: new Date().toISOString(),
        fotos_count: 0,
        proprietario: user.email,
        compartilhado: false
      };
      
      setProjects(prev => [newProject, ...prev]);
      setShowNewProjectModal(false);
      
      toast({
        title: "Projeto criado!",
        description: `O projeto "${name}" foi criado com sucesso`
      });
    } catch (error) {
      console.error('Create project error:', error);
      toast({
        title: "Erro ao criar projeto",
        description: "Não foi possível criar o novo projeto",
        variant: "destructive"
      });
    }
  };

  const handleShareProject = async (email: string, permission: string) => {
    if (!selectedProject) return;
    
    try {
      if (email === user.email) {
        toast({
          title: "Ação não permitida",
          description: "Você não pode compartilhar com você mesmo",
          variant: "destructive"
        });
        return;
      }
      
      // Update project
      setProjects(prev => prev.map(p => 
        p.id === selectedProject.id 
          ? { ...p, compartilhado: true } 
          : p
      ));
      
      // Update selected project
      setSelectedProject(prev => ({
        ...prev,
        compartilhado: true
      }));
      
      toast({
        title: "Projeto compartilhado!",
        description: `Convite enviado para ${email}`
      });
      
      setShowShareModal(false);
    } catch (error) {
      console.error('Share project error:', error);
      toast({
        title: "Erro ao compartilhar",
        description: "Não foi possível compartilhar o projeto",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProject = async (project: any) => {
    try {
      // Remove project
      setProjects(prev => prev.filter(p => p.id !== project.id));
      
      // If the deleted project was selected, go back to projects list
      if (selectedProject && selectedProject.id === project.id) {
        setSelectedProject(null);
        setPhotos([]);
      }
      
      toast({
        title: "Projeto excluído",
        description: `O projeto "${project.nome}" foi removido`
      });
    } catch (error) {
      console.error('Delete project error:', error);
      toast({
        title: "Erro ao excluir projeto",
        description: "Não foi possível remover o projeto",
        variant: "destructive"
      });
    }
  };

  // Dashboard stats
  const totalPhotos = projects.reduce((sum, project) => sum + (project.fotos_count || 0), 0);
  const sharedProjects = projects.filter(project => project.compartilhado).length;
  const recentProjects = [...projects].sort((a, b) => 
    new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime()
  ).slice(0, 3);

  if (!user) {
    return <LoginForm onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} loading={loading} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gray-800 p-2 rounded-lg">
                <span className="text-xl text-white">📷</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-800">Meus Projetos</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden md:inline">Olá, {user.email}</span>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-gray-300 hover:bg-gray-100 text-gray-700"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedProject ? (
          <>
            <ProjectHeader
              title={selectedProject.nome}
              photoCount={selectedProject.fotos_count || 0}
              onBack={handleBackToProjects}
              onCamera={() => setShowCamera(true)}
              onUpload={handleFileUpload}
              onDownload={handleDownloadProject}
              onShare={() => setShowShareModal(true)}
            />
            
            {photos.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {photos.map(photo => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PhotoCard 
                      photo={photo} 
                      onDelete={handleDeletePhoto} 
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-5xl mb-4 text-gray-300">📷</div>
                <h3 className="text-xl font-medium mb-2 text-gray-700">Nenhuma foto ainda</h3>
                <p className="text-gray-500 mb-6">
                  Use a câmera para tirar fotos ou adicione da galeria
                </p>
              </motion.div>
            )}
          </>
        ) : (
          <>
            {/* Dashboard Stats */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects.length}</div>
                  <p className="text-xs text-muted-foreground">projetos criados</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Fotos</CardTitle>
                  <CameraIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPhotos}</div>
                  <p className="text-xs text-muted-foreground">fotos armazenadas</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Projetos Compartilhados</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sharedProjects}</div>
                  <p className="text-xs text-muted-foreground">projetos compartilhados</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Projetos Recentes</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{recentProjects.length}</div>
                  <p className="text-xs text-muted-foreground">criados recentemente</p>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Quick Actions */}
            <motion.div 
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Meus Projetos</h2>
                <p className="text-gray-500">Organize e compartilhe suas fotos por projetos</p>
              </div>
              <Button 
                onClick={() => setShowNewProjectModal(true)}
                className="bg-gray-800 hover:bg-gray-700 text-white"
              >
                Novo Projeto
              </Button>
            </motion.div>
            
            {/* Recent Projects */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">Projetos Recentes</h3>
                <Button 
                  variant="ghost" 
                  onClick={() => {}}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Ver todos
                </Button>
              </div>
              
              {recentProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentProjects.map(project => (
                    <ProjectCard 
                      key={project.id}
                      project={project} 
                      onClick={() => handleProjectSelect(project)} 
                      onShare={(proj) => {
                        setSelectedProject(proj);
                        setShowShareModal(true);
                      }}
                      onDelete={handleDeleteProject}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                  <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-700 mb-2">Nenhum projeto recente</h4>
                  <p className="text-gray-500 mb-4">Crie seu primeiro projeto para começar</p>
                  <Button 
                    onClick={() => setShowNewProjectModal(true)}
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                  >
                    Criar Projeto
                  </Button>
                </div>
              )}
            </motion.div>
            
            {/* All Projects */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-lg font-medium text-gray-800 mb-4">Todos os Projetos</h3>
              
              {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map(project => (
                    <ProjectCard 
                      key={project.id}
                      project={project} 
                      onClick={() => handleProjectSelect(project)} 
                      onShare={(proj) => {
                        setSelectedProject(proj);
                        setShowShareModal(true);
                      }}
                      onDelete={handleDeleteProject}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4 text-gray-300">📁</div>
                  <h3 className="text-xl font-medium mb-2 text-gray-700">Nenhum projeto encontrado</h3>
                  <p className="text-gray-500 mb-6">
                    Crie seu primeiro projeto para começar a organizar suas fotos
                  </p>
                  <Button 
                    onClick={() => setShowNewProjectModal(true)}
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                  >
                    Criar Projeto
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </main>

      {/* Camera View */}
      {showCamera && selectedProject && (
        <CameraView
          projectTitle={selectedProject.nome}
          onCapture={handleCapturePhoto}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* New Project Modal */}
      <NewProjectModal
        open={showNewProjectModal}
        onOpenChange={setShowNewProjectModal}
        onCreate={handleCreateProject}
      />

      {/* Share Modal */}
      <ShareModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        onShare={handleShareProject}
      />
    </div>
  );
};

export default Index;