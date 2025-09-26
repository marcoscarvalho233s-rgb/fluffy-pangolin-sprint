import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { ProjectsPage } from '@/pages/Projects';
import { ProjectDetailPage } from '@/pages/ProjectDetail';
import { Project } from '@/types';

interface AppLayoutProps {
  user: { id: string; email: string };
  onLogout: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState<'projects' | 'project'>('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('project');
  };

  const handleBackToProjects = () => {
    setCurrentView('projects');
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header userEmail={user.email} onLogout={onLogout} />
      
      <main className="flex-1">
        {currentView === 'projects' ? (
          <ProjectsPage user={user} onSelectProject={handleSelectProject} />
        ) : selectedProject ? (
          <ProjectDetailPage project={selectedProject} onBack={handleBackToProjects} />
        ) : (
          <div className="container py-8">
            <p>Erro: Projeto não encontrado</p>
            <Button onClick={handleBackToProjects}>Voltar para Projetos</Button>
          </div>
        )}
      </main>
    </div>
  );
};