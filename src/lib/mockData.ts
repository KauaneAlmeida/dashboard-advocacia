export interface Lead {
  id: string;
  clienteNome: string;
  clienteTelefone: string;
  clienteEmail: string;
  areaJuridica: string;
  status: 'Novo' | 'Atribuído' | 'Contatado' | 'Convertido' | 'Perdido' | 'Inválido';
  temperatura: 'Quente' | 'Morno' | 'Frio';
  urgencia: 'Alta' | 'Média' | 'Baixa';
  origem: 'Web' | 'WhatsApp' | 'Indicação' | 'Manual';
  advogadoId: string;
  advogadoNome: string;
  diasSemResposta: number;
  proximaAcao: string;
  urgenciaFollowup: 'Alta' | 'Média' | 'Normal' | 'Baixa';
  precisaFollowup: boolean;
  descricao: string;
  notas?: string;
  dataCriacao: string;
  dataAtualizacao: string;
  dataEvento: string;
}

export interface Advogado {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  especialidades: string[];
  foto: string;
  totalLeads: number;
  leadsNovos: number;
  leadsEmAndamento: number;
  leadsConvertidos: number;
  leadsPerdidos: number;
  leadsPrecisamFollowup: number;
  taxaConversao: number;
  taxaResposta: number;
  tempoMedioResposta: string;
}

export const mockAdvogados: Advogado[] = [
  {
    id: '1',
    nome: 'Dr. Victor Silveira',
    email: 'victor@escritorio.com.br',
    telefone: '+55 (11) 93225-8806',
    especialidades: ['Direito Penal', 'Direito Cível', 'Direito de Família'],
    foto: 'https://imgur.com/C2QXNDq.png',
    totalLeads: 78,
    leadsNovos: 12,
    leadsEmAndamento: 32,
    leadsConvertidos: 18,
    leadsPerdidos: 12,
    leadsPrecisamFollowup: 5,
    taxaConversao: 23.1,
    taxaResposta: 85,
    tempoMedioResposta: '< 24h'
  },
];

export const mockLeads: Lead[] = [
  {
    id: '1',
    clienteNome: 'João Silva',
    clienteTelefone: '+55 (11) 98765-4321',
    clienteEmail: 'joao@email.com',
    areaJuridica: 'Direito Penal',
    status: 'Novo',
    temperatura: 'Quente',
    urgencia: 'Alta',
    origem: 'Web',
    advogadoId: '1',
    advogadoNome: 'Dr. Victor Silveira',
    diasSemResposta: 7,
    proximaAcao: 'Ligar urgente',
    urgenciaFollowup: 'Alta',
    precisaFollowup: true,
    descricao: 'Cliente precisa de defesa criminal urgente',
    dataCriacao: '2025-10-08 10:30',
    dataAtualizacao: '2025-10-08 10:30',
    dataEvento: '2025-10-08'
  },
  {
    id: '2',
    clienteNome: 'Maria Oliveira',
    clienteTelefone: '+55 (11) 91234-5678',
    clienteEmail: 'maria@email.com',
    areaJuridica: 'Direito de Família',
    status: 'Atribuído',
    temperatura: 'Morno',
    urgencia: 'Média',
    origem: 'WhatsApp',
    advogadoId: '1',
    advogadoNome: 'Dr. Victor Silveira',
    diasSemResposta: 4,
    proximaAcao: 'Realizar primeiro contato',
    urgenciaFollowup: 'Média',
    precisaFollowup: true,
    descricao: 'Processo de divórcio consensual',
    dataCriacao: '2025-10-11 14:20',
    dataAtualizacao: '2025-10-11 14:20',
    dataEvento: '2025-10-11'
  },
  {
    id: '3',
    clienteNome: 'Pedro Santos',
    clienteTelefone: '+55 (11) 99876-5432',
    clienteEmail: 'pedro@email.com',
    areaJuridica: 'Direito Trabalhista',
    status: 'Contatado',
    temperatura: 'Quente',
    urgencia: 'Alta',
    origem: 'Indicação',
    advogadoId: '2',
    advogadoNome: 'Dra. Ana Paula Lima',
    diasSemResposta: 1,
    proximaAcao: 'Aguardar documentos',
    urgenciaFollowup: 'Normal',
    precisaFollowup: false,
    descricao: 'Demissão sem justa causa - cálculos trabalhistas',
    dataCriacao: '2025-10-14 09:15',
    dataAtualizacao: '2025-10-14 16:30',
    dataEvento: '2025-10-14'
  },
  {
    id: '4',
    clienteNome: 'Ana Costa',
    clienteTelefone: '+55 (11) 97654-3210',
    clienteEmail: 'ana@email.com',
    areaJuridica: 'Direito Cível',
    status: 'Convertido',
    temperatura: 'Quente',
    urgencia: 'Baixa',
    origem: 'Web',
    advogadoId: '2',
    advogadoNome: 'Dra. Ana Paula Lima',
    diasSemResposta: 0,
    proximaAcao: 'Cliente convertido',
    urgenciaFollowup: 'Baixa',
    precisaFollowup: false,
    descricao: 'Ação de cobrança - contrato firmado',
    dataCriacao: '2025-10-10 11:00',
    dataAtualizacao: '2025-10-15 10:00',
    dataEvento: '2025-10-10'
  },
  {
    id: '5',
    clienteNome: 'Carlos Ferreira',
    clienteTelefone: '+55 (11) 96543-2109',
    clienteEmail: 'carlos@email.com',
    areaJuridica: 'Direito Tributário',
    status: 'Novo',
    temperatura: 'Frio',
    urgencia: 'Média',
    origem: 'Manual',
    advogadoId: '2',
    advogadoNome: 'Dra. Ana Paula Lima',
    diasSemResposta: 5,
    proximaAcao: 'Enviar proposta',
    urgenciaFollowup: 'Média',
    precisaFollowup: true,
    descricao: 'Consultoria fiscal para MEI',
    dataCriacao: '2025-10-10 15:45',
    dataAtualizacao: '2025-10-10 15:45',
    dataEvento: '2025-10-10'
  },
  {
    id: '6',
    clienteNome: 'Juliana Ribeiro',
    clienteTelefone: '+55 (11) 95432-1098',
    clienteEmail: 'juliana@email.com',
    areaJuridica: 'Direito Empresarial',
    status: 'Atribuído',
    temperatura: 'Morno',
    urgencia: 'Alta',
    origem: 'Web',
    advogadoId: '3',
    advogadoNome: 'Dr. Carlos Mendes',
    diasSemResposta: 3,
    proximaAcao: 'Agendar reunião',
    urgenciaFollowup: 'Média',
    precisaFollowup: true,
    descricao: 'Abertura de empresa LTDA',
    dataCriacao: '2025-10-12 08:30',
    dataAtualizacao: '2025-10-12 08:30',
    dataEvento: '2025-10-12'
  },
  {
    id: '7',
    clienteNome: 'Roberto Alves',
    clienteTelefone: '+55 (11) 94321-0987',
    clienteEmail: 'roberto@email.com',
    areaJuridica: 'Direito Penal',
    status: 'Perdido',
    temperatura: 'Frio',
    urgencia: 'Baixa',
    origem: 'WhatsApp',
    advogadoId: '1',
    advogadoNome: 'Dr. Victor Silveira',
    diasSemResposta: 15,
    proximaAcao: 'Não respondeu',
    urgenciaFollowup: 'Baixa',
    precisaFollowup: false,
    descricao: 'Não retornou contatos',
    dataCriacao: '2025-09-30 10:00',
    dataAtualizacao: '2025-10-05 10:00',
    dataEvento: '2025-09-30'
  }
];

export const getLeadsByStatus = (status: string) => {
  return mockLeads.filter(lead => lead.status === status);
};

export const getLeadsNeedingFollowup = () => {
  return mockLeads.filter(lead => lead.precisaFollowup).sort((a, b) => {
    const urgencyOrder = { 'Alta': 0, 'Média': 1, 'Normal': 2, 'Baixa': 3 };
    return urgencyOrder[a.urgenciaFollowup] - urgencyOrder[b.urgenciaFollowup] || b.diasSemResposta - a.diasSemResposta;
  });
};

export const getLeadsByAdvogado = (advogadoId: string) => {
  return mockLeads.filter(lead => lead.advogadoId === advogadoId);
};

export const getDashboardStats = () => {
  const totalLeads = mockLeads.length;
  const convertidos = mockLeads.filter(l => l.status === 'Convertido').length;
  const followupsPendentes = mockLeads.filter(l => l.precisaFollowup).length;
  const taxaConversao = totalLeads > 0 ? (convertidos / totalLeads * 100).toFixed(1) : '0';
  
  return {
    totalLeads,
    convertidos,
    taxaConversao: parseFloat(taxaConversao),
    followupsPendentes
  };
};

export const getLeadsByDay = () => {
  const days = ['08/10', '09/10', '10/10', '11/10', '12/10', '13/10', '14/10', '15/10'];
  return days.map((day, index) => ({
    date: day,
    leads: Math.floor(Math.random() * 15) + 5
  }));
};

export const getLeadsByStatusDistribution = () => {
  const statuses = ['Novo', 'Atribuído', 'Contatado', 'Convertido', 'Perdido'];
  return statuses.map(status => ({
    name: status,
    value: mockLeads.filter(l => l.status === status).length
  }));
};
