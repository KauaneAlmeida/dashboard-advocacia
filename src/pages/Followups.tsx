import { useState, useEffect } from "react";
import { RefreshCw, Phone, MessageCircle, Mail, AlertCircle, Send, Flame, Snowflake, Users, Loader2, CheckCircle, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// Configure sua URL da API
const API_URL = "https://law-firm-backend-936902782519.us-central1.run.app"; 

const Followups = () => {
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  
  // Estados do envio em massa
  const [showMassDialog, setShowMassDialog] = useState(false);
  const [tipoEnvio, setTipoEnvio] = useState(null);
  const [previewLeads, setPreviewLeads] = useState([]);
  const [enviandoMassa, setEnviandoMassa] = useState(false);
  const [resultadoEnvio, setResultadoEnvio] = useState(null);
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    loadFollowups();
    
    // Auto-refresh a cada 30 segundos
    const interval = setInterval(loadFollowups, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadFollowups = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/analytics/leads/followup`);
      const data = await response.json();
      
      if (data.success) {
        setFollowups(data.data || []);
        toast.success(`${data.data?.length || 0} leads carregados`);
      }
    } catch (err) {
      console.error('Erro:', err);
      toast.error("Erro ao carregar follow-ups");
    } finally {
      setLoading(false);
    }
  };

  const abrirDialogoMassa = async (tipo) => {
    try {
      setTipoEnvio(tipo);
      setShowMassDialog(true);
      setResultadoEnvio(null);
      
      // Carregar preview
      const response = await fetch(`${API_URL}/api/v1/whatsapp/preview-followup/${tipo}`);
      const data = await response.json();
      
      if (data.success) {
        setPreviewLeads(data.leads || []);
      }
    } catch (err) {
      console.error('Erro:', err);
      toast.error("Erro ao carregar preview");
    }
  };

  const enviarFollowupMassa = async () => {
    try {
      setEnviandoMassa(true);
      setProgresso(0);
      
      // Simular progresso (3s por mensagem em média)
      const totalLeads = previewLeads.length;
      const tempoEstimado = totalLeads * 3; // segundos
      const intervalo = setInterval(() => {
        setProgresso(prev => {
          if (prev >= 95) {
            clearInterval(intervalo);
            return 95;
          }
          return prev + (100 / (tempoEstimado / 0.5)); // atualiza a cada 0.5s
        });
      }, 500);
      
      toast.info(`Enviando para ${totalLeads} leads... Isso pode levar alguns minutos.`);

      const response = await fetch(`${API_URL}/api/v1/whatsapp/send-mass-followup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo_lead: tipoEnvio,
          delay_entre_mensagens: 3
        })
      });

      clearInterval(intervalo);
      setProgresso(100);
      
      const resultado = await response.json();
      setResultadoEnvio(resultado);
      
      if (resultado.success) {
        toast.success(
          `🎉 ${resultado.mensagens_enviadas} mensagens enviadas!`,
          { duration: 5000 }
        );
        
        if (resultado.mensagens_falhadas > 0) {
          toast.warning(
            `⚠️ ${resultado.mensagens_falhadas} falharam`,
            { duration: 5000 }
          );
        }
      } else {
        toast.error("Erro ao enviar mensagens");
      }

    } catch (err) {
      console.error('Erro:', err);
      toast.error("Erro ao enviar mensagens");
      setProgresso(0);
    } finally {
      setEnviandoMassa(false);
    }
  };

  const fecharDialogo = () => {
    setShowMassDialog(false);
    setResultadoEnvio(null);
    setProgresso(0);
    loadFollowups(); // Recarregar lista
  };

  const getUrgenciaColor = (urgencia) => {
    const colors = {
      'Alta': 'bg-red-500',
      'Média': 'bg-orange-500',
      'Normal': 'bg-yellow-500',
      'Baixa': 'bg-green-500'
    };
    return colors[urgencia] || 'bg-gray-500';
  };

  const getTemperaturaEmoji = (temp) => {
    const emojis = {
      'Quente': '🔥',
      'Hot': '🔥',
      'Morno': '🌡️',
      'Warm': '🌡️',
      'Frio': '❄️',
      'Cold': '❄️'
    };
    return emojis[temp] || '📊';
  };

  const contarPorTemperatura = () => {
    const quentes = followups.filter(l => 
      ['quente', 'hot'].includes(l.lead_temperature?.toLowerCase())
    ).length;
    
    const frios = followups.filter(l => 
      ['frio', 'cold'].includes(l.lead_temperature?.toLowerCase())
    ).length;
    
    return { quentes, frios, total: followups.length };
  };

  const openWhatsApp = (phone, message) => {
    const phoneClean = phone.replace(/\D/g, '');
    const url = `https://wa.me/${phoneClean}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const openPhoneDialer = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const openEmail = (email, subject) => {
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Navbar />
        <div className="pt-20 px-4 max-w-7xl mx-auto pb-12">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando follow-ups...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = contarPorTemperatura();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                🔔 Follow-ups Pendentes
              </h1>
              <p className="text-muted-foreground">Leads que precisam de atenção urgente</p>
            </div>
            <Button onClick={loadFollowups} variant="outline" size="lg">
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>

          {/* Cards de Envio em Massa */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Leads Quentes */}
            <Card className="border-2 border-red-200 hover:border-red-300 transition-all hover:shadow-lg bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Flame className="w-5 h-5 text-red-500" />
                  Leads Quentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-4xl font-bold text-red-600 dark:text-red-400">{stats.quentes}</p>
                    <p className="text-sm text-muted-foreground">leads quentes</p>
                  </div>
                  <Flame className="w-16 h-16 text-red-200 dark:text-red-900 opacity-50" />
                </div>
                <Button 
                  onClick={() => abrirDialogoMassa('quente')}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold shadow-lg"
                  disabled={stats.quentes === 0}
                  size="lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Follow-up em Massa
                </Button>
              </CardContent>
            </Card>

            {/* Leads Frios */}
            <Card className="border-2 border-blue-200 hover:border-blue-300 transition-all hover:shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Snowflake className="w-5 h-5 text-blue-500" />
                  Leads Frios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{stats.frios}</p>
                    <p className="text-sm text-muted-foreground">leads frios</p>
                  </div>
                  <Snowflake className="w-16 h-16 text-blue-200 dark:text-blue-900 opacity-50" />
                </div>
                <Button 
                  onClick={() => abrirDialogoMassa('frio')}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg"
                  disabled={stats.frios === 0}
                  size="lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Follow-up em Massa
                </Button>
              </CardContent>
            </Card>

            {/* Todos os Leads */}
            <Card className="border-2 border-purple-200 hover:border-purple-300 transition-all hover:shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-purple-500" />
                  Todos os Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">total de leads</p>
                  </div>
                  <Users className="w-16 h-16 text-purple-200 dark:text-purple-900 opacity-50" />
                </div>
                <Button 
                  onClick={() => abrirDialogoMassa('todos')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg"
                  disabled={stats.total === 0}
                  size="lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar para Todos
                </Button>
              </CardContent>
            </Card>
          </div>

          <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500">
            {followups.length} leads precisam de atenção
          </Badge>
        </div>

        {/* Lista de Leads */}
        {followups.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              📊 Ordenados por urgência e tempo sem resposta
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {followups.map((lead) => (
                <Card 
                  key={lead.lead_id}
                  className="hover:shadow-xl transition-all cursor-pointer border-l-4 hover:scale-105"
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
                      <Badge className={`${getUrgenciaColor(lead.urgencia_followup)} text-white`}>
                        {lead.urgencia_followup}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>{lead.cliente_telefone}</span>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-950 border-2 border-red-300 dark:border-red-700 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">⏰</span>
                        <span className="font-bold text-red-700 dark:text-red-400">
                          {lead.dias_sem_resposta} dias sem resposta
                        </span>
                      </div>
                      <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                        {lead.proxima_acao}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getTemperaturaEmoji(lead.lead_temperature)}</span>
                      <span className="text-sm font-medium">{lead.lead_temperature}</span>
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
            <p className="text-muted-foreground text-lg">
              Nenhum lead precisa de follow-up no momento.
            </p>
          </div>
        )}

        {/* Dialog de Envio em Massa */}
        <Dialog open={showMassDialog} onOpenChange={fecharDialogo}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                {tipoEnvio === 'quente' && <><Flame className="w-6 h-6 text-red-500" /> Follow-up Leads Quentes</>}
                {tipoEnvio === 'frio' && <><Snowflake className="w-6 h-6 text-blue-500" /> Follow-up Leads Frios</>}
                {tipoEnvio === 'todos' && <><Users className="w-6 h-6 text-purple-500" /> Follow-up Todos os Leads</>}
              </DialogTitle>
              <DialogDescription>
                Enviar mensagem de follow-up em massa via WhatsApp
              </DialogDescription>
            </DialogHeader>

            {!resultadoEnvio ? (
              <>
                {/* Preview e Confirmação */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                    <p className="font-semibold mb-2 flex items-center gap-2">
                      📋 Preview do Envio:
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <strong className="text-2xl">{previewLeads.length}</strong> leads receberão mensagem
                      </p>
                      <p className="text-xs text-muted-foreground">
                        • Delay de 3 segundos entre cada mensagem<br/>
                        • Mensagem personalizada com nome do cliente<br/>
                        • Tempo estimado: ~{Math.ceil(previewLeads.length * 3 / 60)} minutos
                      </p>
                    </div>
                  </div>

                  {/* Lista de Leads que Receberão */}
                  {previewLeads.length > 0 && (
                    <div className="max-h-64 overflow-y-auto border-2 rounded-lg p-4 bg-muted/30">
                      <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                        👥 Leads que receberão mensagem:
                      </p>
                      <div className="space-y-2">
                        {previewLeads.slice(0, 15).map((lead, i) => (
                          <div key={i} className="flex items-center justify-between text-sm p-2 bg-background rounded border hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getTemperaturaEmoji(lead.temperatura)}</span>
                              <div>
                                <p className="font-medium">{lead.cliente_nome}</p>
                                <p className="text-xs text-muted-foreground">{lead.areas_available}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-mono">{lead.cliente_telefone}</p>
                              <p className="text-xs text-red-600 dark:text-red-400">
                                {lead.dias_sem_resposta} dias
                              </p>
                            </div>
                          </div>
                        ))}
                        {previewLeads.length > 15 && (
                          <p className="text-xs text-center text-muted-foreground py-2 bg-muted rounded">
                            ... e mais {previewLeads.length - 15} leads
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Progress Bar durante envio */}
                  {enviandoMassa && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Enviando mensagens...</span>
                        <span className="text-muted-foreground">{Math.round(progresso)}%</span>
                      </div>
                      <Progress value={progresso} className="h-2" />
                      <p className="text-xs text-center text-muted-foreground">
                        Por favor, aguarde. Não feche esta janela.
                      </p>
                    </div>
                  )}
                </div>

                <DialogFooter className="gap-2">
                  <Button 
                    variant="outline" 
                    onClick={fecharDialogo}
                    disabled={enviandoMassa}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={enviarFollowupMassa}
                    disabled={enviandoMassa || previewLeads.length === 0}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {enviandoMassa ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Confirmar e Enviar
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                {/* Resultado do Envio */}
                <div className="space-y-4">
                  <div className="text-center py-6">
                    <div className="mb-4">
                      {resultadoEnvio.mensagens_enviadas > 0 ? (
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      {resultadoEnvio.mensagens_enviadas > 0 ? 'Envio Concluído!' : 'Envio Falhou'}
                    </h3>
                    <p className="text-muted-foreground">
                      {resultadoEnvio.tempo_total_formatado}
                    </p>
                  </div>

                  {/* Estatísticas */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {resultadoEnvio.total_leads}
                      </p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {resultadoEnvio.mensagens_enviadas}
                      </p>
                      <p className="text-xs text-muted-foreground">Enviadas</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                      <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                        {resultadoEnvio.mensagens_falhadas}
                      </p>
                      <p className="text-xs text-muted-foreground">Falhadas</p>
                    </div>
                  </div>

                  {/* Detalhes dos Envios */}
                  {resultadoEnvio.detalhes && resultadoEnvio.detalhes.length > 0 && (
                    <div className="max-h-64 overflow-y-auto border rounded-lg p-3 bg-muted/30">
                      <p className="text-sm font-semibold mb-3">Detalhes:</p>
                      <div className="space-y-1">
                        {resultadoEnvio.detalhes.map((detalhe, i) => (
                          <div 
                            key={i} 
                            className={`text-xs flex items-center justify-between p-2 rounded ${
                              detalhe.sucesso 
                                ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800' 
                                : 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {detalhe.sucesso ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                              <span className="font-medium">{detalhe.cliente}</span>
                            </div>
                            <span className="text-muted-foreground">{detalhe.telefone}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button onClick={fecharDialogo} className="w-full" size="lg">
                    Fechar
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog de Detalhes do Lead Individual */}
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
                  <Badge className={`${getUrgenciaColor(selectedLead.urgencia_followup)} text-white`}>
                    {selectedLead.urgencia_followup} - {selectedLead.dias_sem_resposta} dias
                  </Badge>
                </div>

                <div className="bg-red-50 dark:bg-red-950 border-2 border-red-300 dark:border-red-700 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">⚠️</span>
                    <div>
                      <p className="font-bold text-red-700 dark:text-red-400 text-lg">
                        {selectedLead.dias_sem_resposta} dias sem resposta!
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-400">
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
                </div>

                {selectedLead.descricao && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Descrição do Caso</p>
                    <p className="text-sm bg-muted p-3 rounded-lg">{selectedLead.descricao}</p>
                  </div>
                )}

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

export default Followups