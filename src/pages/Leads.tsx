import { useState, useEffect } from "react";
import { Search, Filter, Eye, Phone, MessageCircle, Mail, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getLeads, openWhatsApp, openPhoneDialer, openEmail } from "@/lib/api";
import type { Lead } from "@/lib/types";

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLeads({ limit: 1000 });
      setLeads(data);
    } catch (err) {
      console.error("Erro ao carregar leads:", err);
      setError("Erro ao carregar leads");
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.cliente_telefone.includes(searchTerm) ||
      lead.cliente_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "Todos" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Novo: "bg-yellow-500",
      Atribuído: "bg-blue-500",
      Contatado: "bg-green-400",
      Convertido: "bg-green-600",
      Perdido: "bg-red-500",
      Inválido: "bg-gray-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getTemperaturaColor = (temp: string) => {
    const colors: Record<string, string> = {
      Quente: "bg-red-500",
      Morno: "bg-orange-500",
      Frio: "bg-blue-500",
    };
    return colors[temp] || "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <div className="pt-20 flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando leads...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <div className="pt-20 flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">Erro ao carregar leads</p>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadLeads}>Tentar novamente</Button>
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
          <h1 className="text-4xl font-bold mb-2">Leads</h1>
          <p className="text-muted-foreground">Gerencie todos os seus leads jurídicos</p>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Buscar por nome, telefone ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos os Status</SelectItem>
              <SelectItem value="Novo">Novo</SelectItem>
              <SelectItem value="Atribuído">Atribuído</SelectItem>
              <SelectItem value="Contatado">Contatado</SelectItem>
              <SelectItem value="Convertido">Convertido</SelectItem>
              <SelectItem value="Perdido">Perdido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Mostrando <span className="font-semibold text-foreground">{filteredLeads.length}</span> de{" "}
            <span className="font-semibold text-foreground">{leads.length}</span> leads
          </p>
        </div>

        {/* Grid de Leads */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <Card key={lead.lead_id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{lead.cliente_nome}</h3>
                    <p className="text-sm text-muted-foreground">{lead.areas_available}</p>
                  </div>
                  <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                </div>

                <div className="text-sm space-y-1">
                  <p>📞 {lead.cliente_telefone}</p>
                  <p>📧 {lead.cliente_email}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`${getTemperaturaColor(lead.lead_temperature)} text-white`}>
                    {lead.lead_temperature}
                  </Badge>
                  <Badge variant="outline">{lead.urgency}</Badge>
                </div>

                {/* Botões rápidos */}
                <div className="flex justify-between gap-2 pt-3 border-t">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => openWhatsApp(lead.cliente_telefone)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => openPhoneDialer(lead.cliente_telefone)}>
                    <Phone className="w-4 h-4 mr-2" /> Ligar
                  </Button>
                  {lead.cliente_email && (
                    <Button variant="outline" className="flex-1" onClick={() => openEmail(lead.cliente_email)}>
                      <Mail className="w-4 h-4 mr-2" /> Email
                    </Button>
                  )}
                </div>

                {/* Botão de Detalhes */}
                <Button
                  variant="secondary"
                  className="w-full mt-3"
                  onClick={() => setSelectedLead(lead)}
                >
                  <Eye className="w-4 h-4 mr-2" /> Ver detalhes
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Nenhum lead encontrado</p>
          </div>
        )}

        {/* Dialog de Detalhes */}
        <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Detalhes do Lead</DialogTitle>
              <DialogDescription>Informações completas e ações rápidas</DialogDescription>
            </DialogHeader>

            {selectedLead && (
              <div className="space-y-6">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{selectedLead.cliente_nome}</h3>
                    <p className="text-muted-foreground">{selectedLead.cliente_email}</p>
                  </div>
                  <Badge className={getStatusColor(selectedLead.status)}>{selectedLead.status}</Badge>
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
                    <p className="text-sm font-medium text-muted-foreground">Temperatura</p>
                    <Badge className={`${getTemperaturaColor(selectedLead.lead_temperature)} text-white`}>
                      {selectedLead.lead_temperature}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Urgência</p>
                    <p className="font-semibold">{selectedLead.urgency}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Dias sem Resposta</p>
                    <p
                      className={`font-semibold ${
                        selectedLead.dias_sem_resposta > 2 ? "text-orange-600" : ""
                      }`}
                    >
                      {selectedLead.dias_sem_resposta}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Descrição</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">{selectedLead.descricao}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Próxima Ação</p>
                  <p className="font-semibold text-orange-600">{selectedLead.proxima_acao}</p>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => openWhatsApp(selectedLead.cliente_telefone)}>
                    <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => openPhoneDialer(selectedLead.cliente_telefone)}>
                    <Phone className="w-4 h-4 mr-2" /> Ligar
                  </Button>
                  {selectedLead.cliente_email && (
                    <Button variant="outline" className="flex-1" onClick={() => openEmail(selectedLead.cliente_email)}>
                      <Mail className="w-4 h-4 mr-2" /> Email
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

export default Leads;
