export interface User {
  id: string;
  email: string;
  [key: string]: any;
}

export interface Project {
  id: number;
  nome: string;
  descricao: string;
  data_criacao: string;
  fotos_count: number;
  proprietario: string;
  compartilhado: boolean;
  usuario_id?: string;
}

export interface Photo {
  id: number;
  nome_arquivo: string;
  url: string;
  tamanho_kb: number;
  tipo_mime: string;
  data_upload: string;
  projeto_id: number;
  storage_path?: string;
}

export interface Share {
  id: number;
  projeto_id: number;
  email_convidado: string;
  permissao: string;
  data_convite: string;
  status: string;
}