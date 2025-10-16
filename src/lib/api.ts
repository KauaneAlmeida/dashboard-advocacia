/**
 * API Service - Comunicação com o Backend
 * Base URL: https://law-firm-backend-936902782519.us-central1.run.app
 */

import type { Lead, Advogado, DashboardSummary, ApiResponse, FollowupResponse } from './types';

const API_BASE_URL = 'https://law-firm-backend-936902782519.us-central1.run.app';

/**
 * Helper genérico para fazer requisições
 */
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Backend retorna { success: true, data: [...] }
    if (data.success === false) {
      throw new Error(data.message || 'Erro na API');
    }

    return data;
  } catch (error) {
    console.error(`❌ Erro na requisição ${endpoint}:`, error);
    throw error;
  }
}

/**
 * 📊 GET /api/analytics/leads
 * Busca todos os leads (com filtros opcionais)
 */
export async function getLeads(filters?: {
  start_date?: string;
  end_date?: string;
  status?: string;
  advogado_id?: string;
  limit?: number;
}): Promise<Lead[]> {
  const params = new URLSearchParams();
  
  if (filters?.start_date) params.append('start_date', filters.start_date);
  if (filters?.end_date) params.append('end_date', filters.end_date);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.advogado_id) params.append('advogado_id', filters.advogado_id);
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const queryString = params.toString();
  const endpoint = `/api/analytics/leads${queryString ? `?${queryString}` : ''}`;

  const response = await apiRequest<ApiResponse<Lead[]>>(endpoint);
  return response.data;
}

/**
 * 🔔 GET /api/analytics/leads/followup
 * Busca leads que precisam de follow-up
 */
export async function getFollowupLeads(): Promise<Lead[]> {
  const response = await apiRequest<FollowupResponse>('/api/analytics/leads/followup');
  return response.data;
}

/**
 * 👨‍⚖️ GET /api/analytics/advogados
 * Busca todos os advogados com suas métricas
 */
export async function getAdvogados(): Promise<Advogado[]> {
  const response = await apiRequest<ApiResponse<Advogado[]>>('/api/analytics/advogados');
  return response.data;
}

/**
 * 📈 GET /api/analytics/dashboard/summary
 * Busca resumo do dashboard (métricas gerais)
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await apiRequest<ApiResponse<DashboardSummary>>('/api/analytics/dashboard/summary');
  return response.data;
}

/**
 * 📞 Abre WhatsApp do cliente
 */
export function openWhatsApp(telefone: string, mensagem?: string): void {
  // Remove formatação do telefone
  const numeroLimpo = telefone.replace(/\D/g, '');
  
  const mensagemPadrao = mensagem || 'Olá! Vi seu contato e gostaria de conversar sobre sua consulta jurídica.';
  const mensagemCodificada = encodeURIComponent(mensagemPadrao);
  
  const url = `https://wa.me/${numeroLimpo}?text=${mensagemCodificada}`;
  window.open(url, '_blank');
}

/**
 * 📱 Abre discador de telefone
 */
export function openPhoneDialer(telefone: string): void {
  const numeroLimpo = telefone.replace(/\D/g, '');
  window.location.href = `tel:${numeroLimpo}`;
}

/**
 * 📧 Abre cliente de email
 */
export function openEmail(email: string, assunto?: string): void {
  const assuntoCodificado = assunto ? encodeURIComponent(assunto) : '';
  window.location.href = `mailto:${email}${assunto ? `?subject=${assuntoCodificado}` : ''}`;
}

/**
 * 🔄 Health check da API
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await apiRequest<{ status: string }>('/api/analytics/health');
    return response.status === 'healthy';
  } catch {
    return false;
  }
}

/**
 * 📊 Processa dados para gráfico de linha (leads ao longo do tempo)
 */
export function processLeadsOverTime(leads: Lead[]): Array<{ date: string; leads: number }> {
  const grouped: Record<string, number> = {};

  leads.forEach(lead => {
    const date = lead.data_evento;
    grouped[date] = (grouped[date] || 0) + 1;
  });

  return Object.entries(grouped)
    .map(([date, count]) => ({
      date: formatDateForChart(date),
      leads: count
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-8); // Últimos 8 dias
}

/**
 * 🥧 Processa dados para gráfico de pizza (distribuição por status)
 */
export function processStatusDistribution(leads: Lead[]): Array<{ name: string; value: number }> {
  const grouped: Record<string, number> = {};

  leads.forEach(lead => {
    grouped[lead.status] = (grouped[lead.status] || 0) + 1;
  });

  return Object.entries(grouped).map(([name, value]) => ({
    name,
    value
  }));
}

/**
 * 🗓️ Formata data para exibição no gráfico (dd/MM)
 */
function formatDateForChart(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
}

/**
 * 🎨 Mapeamento de cores por status
 */
export const STATUS_COLORS: Record<string, string> = {
  'Novo': '#fbbc04',
  'Atribuído': '#4285f4',
  'Contatado': '#81c784',
  'Convertido': '#34a853',
  'Perdido': '#ea4335',
  'Inválido': '#9e9e9e'
};