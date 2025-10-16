import { MessageCircle, Phone, Eye, MapPin, ThermometerSun, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lead } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface LeadCardProps {
  lead: Lead;
  onViewDetails: (lead: Lead) => void;
}

const LeadCard = ({ lead, onViewDetails }: LeadCardProps) => {
  const statusColors = {
    'Novo': 'bg-warning text-warning-foreground',
    'Atribuído': 'bg-primary text-primary-foreground',
    'Contatado': 'bg-success/70 text-white',
    'Convertido': 'bg-success text-success-foreground',
    'Perdido': 'bg-destructive text-destructive-foreground',
    'Inválido': 'bg-muted text-muted-foreground'
  };

  const urgencyBorderColors = {
    'Alta': 'border-l-destructive',
    'Média': 'border-l-warning',
    'Baixa': 'border-l-success',
  };

  const temperaturaIcons = {
    'Quente': '🔥',
    'Morno': '☀️',
    'Frio': '❄️'
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Olá ${lead.clienteNome}, sou ${lead.advogadoNome}. Recebi seu contato sobre ${lead.areaJuridica}.`);
    window.open(`https://wa.me/${lead.clienteTelefone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${lead.clienteTelefone}`;
  };

  return (
    <Card className={cn(
      "border-l-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
      urgencyBorderColors[lead.urgencia],
      lead.precisaFollowup && "shadow-warning/20"
    )}>
      <CardContent className="p-5">
        <div className="space-y-4">
          {lead.precisaFollowup && (
            <div className="flex items-center justify-between text-sm font-medium text-destructive">
              <span>⚠️ URGENTE - {lead.diasSemResposta} dias sem resposta</span>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-lg">{lead.clienteNome}</h3>
              <Badge className={statusColors[lead.status]}>{lead.status}</Badge>
            </div>
            
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {lead.clienteTelefone}
              </p>
              <p className="flex items-center gap-2">
                📧 {lead.clienteEmail}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">{lead.areaJuridica}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span>{lead.advogadoNome.split(' ')[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              <ThermometerSun className="w-4 h-4 text-primary" />
              <span>{temperaturaIcons[lead.temperatura]} {lead.temperatura}</span>
            </div>
          </div>

          <div className="pt-3 border-t">
            <p className="text-sm font-medium mb-1">Próxima ação:</p>
            <p className="text-sm text-muted-foreground">{lead.proximaAcao}</p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleWhatsApp}
              className="flex-1 bg-success hover:bg-success/90"
              size="sm"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            <Button 
              onClick={handleCall}
              variant="outline"
              size="sm"
            >
              <Phone className="w-4 h-4" />
            </Button>
            <Button 
              onClick={() => onViewDetails(lead)}
              variant="outline"
              size="sm"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadCard;
