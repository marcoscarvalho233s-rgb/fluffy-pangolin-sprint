import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FolderOpen, 
  Camera, 
  Users, 
  Settings, 
  LogOut,
  PlusCircle,
  Image
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  userEmail: string;
  onLogout: () => void;
  onCreateProject: () => void;
  projects: any[];
  onProjectSelect: (project: any) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  userEmail, 
  onLogout, 
  onCreateProject,
  projects,
  onProjectSelect
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Meus Projetos', icon: FolderOpen, path: '/projects' },
    { name: 'Câmera', icon: Camera, path: '/camera' },
    { name: 'Compartilhados', icon: Users, path: '/shared' },
    { name: 'Configurações', icon: Settings, path: '/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Get the 3 most recent projects
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime())
    .slice(0, 3);

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-gray-800 p-2 rounded-lg">
            <Camera className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Meus Projetos</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.name}
                variant={isActive(item.path) ? "secondary" : "ghost"}
                className="w-full justify-start gap-3 py-2 h-auto"
                onClick={() => navigate(item.path)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Button>
            );
          })}
        </nav>

        {/* Quick Access Projects */}
        {recentProjects.length > 0 && (
          <div className="px-4 mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500">Acesso Rápido</h3>
            </div>
            <div className="space-y-1">
              {recentProjects.map((project) => (
                <Button
                  key={project.id}
                  variant="ghost"
                  className="w-full justify-start gap-3 py-2 h-auto truncate"
                  onClick={() => onProjectSelect(project)}
                >
                  <Image className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <span className="truncate text-left">{project.nome}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button 
          className="w-full justify-start gap-3 py-2 h-auto mb-4 bg-gray-800 hover:bg-gray-700"
          onClick={onCreateProject}
        >
          <PlusCircle className="h-5 w-5" />
          <span>Novo Projeto</span>
        </Button>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
            <div>
              <p className="text-sm font-medium text-gray-800 truncate max-w-[120px]">{userEmail}</p>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};