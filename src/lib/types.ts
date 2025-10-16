/**
 * Types.ts - Definições de tipos para todo o app
 * Mapeia exatamente o que vem do backend
 */

export interface Lead {
  lead_id: string;
  cliente_nome: string;
  cliente_telefone: string;
  cliente_email: string;
  advogado_id: string;
  advogado_nome: string;
  status: 'Novo' | 'Atribuído' | 'Contatado' | 'Convertido' | 'Perdido' | 'Inválido';
  areas_available: string;
  lead_temperature: 'Quente' | 'Morno' | 'Frio';
  urgency: 'Alta' | 'Média' | 'Baixa';
  source: string;
  descricao: string;
  dias_sem_resposta: number;
  proxima_acao: string;
  urgencia_followup: 'Alta' | 'Média' | 'Normal' | 'Baixa';
  precisa_followup: 'Sim' | 'Não';
  data_evento: string;
  created_at: string;
  updated_at: string;
  dias_desde_criacao: number;
}

export interface Advogado {
  advogado_id: string;
  nome: string;
  telefone: string;
  email?: string;
  foto?: string;
  especialidades: string;
  areas_atuacao: string;
  status: string;
  total_leads: number;
  leads_novos: number;
  leads_em_andamento: number;
  leads_convertidos: number;
  leads_perdidos: number;
  leads_precisam_followup: number;
  taxa_conversao: number;
  taxa_resposta: number;
  tempo_medio_resposta: string;
}

export interface DashboardSummary {
  total_leads: number;
  total_advogados: number;
  taxa_resposta: number;
  taxa_conversao: number;
  leads_novos: number;
  leads_convertidos: number;
  leads_perdidos: number;
  leads_em_andamento: number;
  leads_precisam_followup: number;
  distribuicao_status: {
    [key: string]: number;
  };
  notificacao_status: {
    respondidos: number;
    nao_respondidos: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  language?: string;
  timestamp?: string;
}

export interface FollowupResponse extends ApiResponse<Lead[]> {
  total_followups: number;
}