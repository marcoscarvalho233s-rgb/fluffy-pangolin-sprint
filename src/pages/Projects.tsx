import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { ProjectCard } from '@/components/ProjectCard';
import { NewProjectModal } from '@/components/NewProjectModal';
import { Project } from '@/types';
import { supabase } from '@/lib/supabase';
import { notifyN8N } from '@/lib/n8n';

interface ProjectsPageProps {
  user: { id: string; email: string };
  onSelectProject: (project: Project) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ user, onSelectProject }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, [user.id]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projetos')
        .select('*')
        .eq('usuario_id', user.id);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setProjects(data as Project[]);
      } else {
        loadDemoData();
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    setProjects([
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
    ]);
  };

  const handleCreateProject = async (name: string, description: string) => {
    const newProject: Project = {
      id: Date.now(),
      nome: name,
      descricao: description,
      data_criacao: new Date().toISOString(),
      fotos_count: 0,
      proprietario: user.email,
      compartilhado: false,
      usuario_id: user.id
    };

    try {
      const { error } = await supabase
        .from('projetos')
        .insert(newProject);
      
      if (error) throw error;
      
      setProjects(prev => [newProject, ...prev]);
      
      // Notify n8n
      notifyN8N('projeto_criado', {
        projeto_id: newProject.id,
        projeto_nome: newProject.nome,
        usuario: user.email
      });
    } catch (error) {
      console.error('Create project error:', error);
      alert('Erro ao criar projeto.');
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
        <div>
          <h1 className="text-3xl font-bold">Meus Projetos</h1>
          <p className="text-muted-foreground">Organize e compartilhe suas fotos por projetos</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Projeto
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📷</div>
          <h3 className="text-xl font-semibold mb-2">Nenhum projeto ainda</h3>
          <p className="text-muted-foreground mb-4">Crie seu primeiro projeto para começar</p>
          <Button onClick={() => setIsModalOpen(true)}>Criar Projeto</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => onSelectProject(project)} 
            />
          ))}
        </div>
      )}

      <NewProjectModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCreate={handleCreateProject}
      />
    </div>
  );
};