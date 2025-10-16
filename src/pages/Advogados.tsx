import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { mockAdvogados } from "@/lib/mockData";
import { Mail, Phone } from "lucide-react";

const Advogados = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">👨‍⚖️ Advogados</h1>
          <p className="text-muted-foreground">Performance individual e métricas de cada advogado</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockAdvogados.map((advogado, index) => (
            <Card key={advogado.id} className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <img 
                    src={advogado.foto} 
                    alt={advogado.nome}
                    className="w-20 h-20 rounded-full border-4 border-primary/20"
                  />
                  <div className="flex-1">
                    <CardTitle className="mb-1">{advogado.nome}</CardTitle>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {advogado.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {advogado.telefone}
                      </div>
                    </div>
                  </div>
                  {index === 0 && (
                    <Badge className="bg-warning">🏆 Top 1</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">📍 Especialidades:</p>
                  <div className="flex flex-wrap gap-2">
                    {advogado.especialidades.map((esp) => (
                      <Badge key={esp} variant="outline">{esp}</Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <p className="font-semibold">📊 Performance:</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Leads</p>
                      <p className="text-2xl font-bold">{advogado.totalLeads}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Convertidos</p>
                      <p className="text-2xl font-bold text-success">{advogado.leadsConvertidos}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Em Andamento</p>
                      <p className="text-2xl font-bold text-primary">{advogado.leadsEmAndamento}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Perdidos</p>
                      <p className="text-2xl font-bold text-destructive">{advogado.leadsPerdidos}</p>
                    </div>
                  </div>

                  {advogado.leadsPrecisamFollowup > 0 && (
                    <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                      <p className="text-sm font-medium text-warning">
                        🔔 {advogado.leadsPrecisamFollowup} leads precisam de follow-up
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Taxa de Conversão</p>
                      <p className="text-sm font-bold">{advogado.taxaConversao}%</p>
                    </div>
                    <Progress value={advogado.taxaConversao} className="h-3" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Taxa de Resposta</p>
                      <p className="font-semibold">{advogado.taxaResposta}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tempo Médio</p>
                      <p className="font-semibold">{advogado.tempoMedioResposta}</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  Ver Leads Atribuídos
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Advogados;
