import { useState, useEffect } from "react";
import { RefreshCw, Phone, MessageCircle, Mail, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { getFollowupLeads, openWhatsApp, openPhoneDialer, openEmail } from "@/lib/api";
import type { Lead } from "@/lib/types";
import { toast } from "sonner";

const Followups = () => {
  const [followups, setFollowups] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    loadFollowups();
  }, []);

  const loadFollowups = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFollowupLeads();
      setFollowups(data);
      toast.success("Lista atualizada!");
    } catch (err) {
      console.error('Erro ao carregar follow-ups:', err);
      setError('Erro ao carregar follow-ups');
      toast.error("Erro ao atualizar lista");
    } finally {
      setLoading(false);
    }
  };

  const getUrgenciaColor = (urgencia: string) => {
    const colors: Record<string, string> = {
      'Alta': 'bg-red-500',
      'Média': 'bg-orange-500',
      'Normal': 'bg-yellow-500',
      'Baixa': 'bg-green-500'
    };
    return colors[urgencia] || 'bg-gray-500';
  };

  const getTemperaturaEmoji = (temp: string) => {
    const emojis: Record<string, string> = {
      'Quente': '🔥',
      'Morno': '🌡️',
      'Frio': '❄️'
    };
    return emojis[temp] || '📊';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando follow-ups...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">Erro ao carregar follow-ups</p>
              <p className="text-muted-foreground mb-4">{error}</p>
              <button 
                onClick={loadFollowups}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">🔔 Follow-ups Pendentes</h1>
              <p className="text-muted-foreground">Leads que precisam de atenção urgente</p>
            </div>
            <Button onClick={loadFollowups} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
          
          <Badge className="text-lg px-4 py-2 bg-orange-500">
            {followups.length} leads precisam de atenção
          </Badge>
        </div>

        {followups.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Ordenados por urgência e tempo sem resposta
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {followups.map((lead) => (
                <Card 
                  key={lead.lead_id}
                  className="hover:shadow-lg transition-shadow cursor-pointer border-l-4"
                  style={{ 
                    borderLeftColor: lead.urgencia_followup === 'Alta' ? '#ef4444' : 
                                    lead.urgencia_followup === 'Média' ? '#f97316' : '#eab308'
                  }}
                  onClick={() => setSelectedLead(lead)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{lead.cliente_nome}</h3>
                        <p className="text-sm text-muted-foreground">{lead.areas_available}</p>
                      </div>
                      <Badge className={getUrgenciaColor(lead.urgencia_followup)}>
                        {lead.urgencia_followup}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>{lead.cliente_telefone}</span>
                      </div>
                      {lead.cliente_email && (
                        <div className="flex items-center text-sm">
                          <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span className="truncate">{lead.cliente_email}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">⏰</span>
                        <span className="font-bold text-red-700">
                          {lead.dias_sem_resposta} dias sem resposta
                        </span>
                      </div>
                      <p className="text-xs text-red-600 font-medium">
                        {lead.proxima_acao}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{getTemperaturaEmoji(lead.lead_temperature)}</span>
                      <span className="text-sm font-medium">{lead.lead_temperature}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{lead.urgency}</span>
                    </div>

                    <div className="text-xs text-muted-foreground pt-3 border-t">
                      <div>👨‍⚖️ {lead.advogado_nome}</div>
                      <div>📅 Criado em: {lead.created_at}</div>
                      <div>📊 Status: {lead.status}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mb-4 text-6xl">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Parabéns!</h2>
            <p className="text-muted-foreground text-lg mb-4">
              Nenhum lead precisa de follow-up no momento.
            </p>
            <p className="text-muted-foreground">
              Todos os leads estão sendo acompanhados.
            </p>
          </div>
        )}

        {/* Lead Details Dialog */}
        <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Detalhes do Lead - Follow-up</DialogTitle>
              <DialogDescription>Informações completas e ações rápidas</DialogDescription>
            </DialogHeader>
            {selectedLead && (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{selectedLead.cliente_nome}</h3>
                    <p className="text-muted-foreground">{selectedLead.cliente_email}</p>
                  </div>
                  <Badge className={getUrgenciaColor(selectedLead.urgencia_followup)}>
                    {selectedLead.urgencia_followup} - {selectedLead.dias_sem_resposta} dias
                  </Badge>
                </div>

                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">⚠️</span>
                    <div>
                      <p className="font-bold text-red-700 text-lg">
                        {selectedLead.dias_sem_resposta} dias sem resposta!
                      </p>
                      <p className="text-sm text-red-600">
                        Ação necessária: <span className="font-semibold">{selectedLead.proxima_acao}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                    <p className="font-semibold">{selectedLead.cliente_telefone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Área Jurídica</p>
                    <p className="font-semibold">{selectedLead.areas_available}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Advogado</p>
                    <p className="font-semibold">{selectedLead.advogado_nome}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status Atual</p>
                    <p className="font-semibold">{selectedLead.status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Temperatura</p>
                    <p className="font-semibold">
                      {getTemperaturaEmoji(selectedLead.lead_temperature)} {selectedLead.lead_temperature}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Urgência</p>
                    <p className="font-semibold">{selectedLead.urgency}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Origem</p>
                    <p className="font-semibold">{selectedLead.source}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Criado em</p>
                    <p className="font-semibold">{selectedLead.created_at}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Descrição do Caso</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">{selectedLead.descricao}</p>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t">
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      openWhatsApp(
                        selectedLead.cliente_telefone,
                        `Olá ${selectedLead.cliente_nome}! Estou entrando em contato sobre sua consulta jurídica em ${selectedLead.areas_available}. Como posso ajudar?`
                      );
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => openPhoneDialer(selectedLead.cliente_telefone)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Ligar
                  </Button>
                  {selectedLead.cliente_email && (
                    <Button 
                      variant="outline"
                      onClick={() => openEmail(
                        selectedLead.cliente_email,
                        `Consulta Jurídica - ${selectedLead.areas_available}`
                      )}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Followups;