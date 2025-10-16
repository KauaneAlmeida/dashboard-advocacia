import { useState, useEffect } from "react";
import { TrendingUp, Users, CheckCircle, Bell, AlertCircle } from "lucide-react";
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getDashboardSummary, getAdvogados, getLeads, processLeadsOverTime, processStatusDistribution, STATUS_COLORS } from "@/lib/api";
import type { DashboardSummary, Advogado, Lead } from "@/lib/types";

const Dashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [advogados, setAdvogados] = useState<Advogado[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar dados do backend em paralelo
      const [summaryData, advogadosData, leadsData] = await Promise.all([
        getDashboardSummary(),
        getAdvogados(),
        getLeads({ limit: 1000 })
      ]);

      setSummary(summaryData);
      setAdvogados(advogadosData);
      setLeads(leadsData);
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Processar dados para gráficos
  const leadsOverTime = leads.length > 0 ? processLeadsOverTime(leads) : [];
  const statusDistribution = leads.length > 0 ? processStatusDistribution(leads) : [];
  
  // Top 3 advogados por conversão
  const topAdvogados = [...advogados]
    .sort((a, b) => b.taxa_conversao - a.taxa_conversao)
    .slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando dashboard...</p>
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
              <p className="text-lg font-semibold mb-2">Erro ao carregar dados</p>
              <p className="text-muted-foreground mb-4">{error}</p>
              <button 
                onClick={loadDashboardData}
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

  if (!summary) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral dos seus leads e performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total de Leads"
            value={summary.total_leads}
            icon={TrendingUp}
            trend={`${summary.leads_novos} novos leads`}
            variant="default"
          />
          <StatCard
            title="Leads Convertidos"
            value={summary.leads_convertidos}
            icon={CheckCircle}
            trend={`${summary.taxa_conversao.toFixed(1)}% taxa de conversão`}
            variant="success"
          />
          <StatCard
            title="Taxa de Conversão"
            value={`${summary.taxa_conversao.toFixed(1)}%`}
            icon={Users}
            trend={`${summary.taxa_resposta.toFixed(1)}% taxa de resposta`}
            variant="default"
          />
          <StatCard
            title="Follow-ups Pendentes"
            value={summary.leads_precisam_followup}
            icon={Bell}
            trend="Requer atenção"
            variant="warning"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Leads ao Longo do Tempo</CardTitle>
              <CardDescription>Últimos 8 dias</CardDescription>
            </CardHeader>
            <CardContent>
              {leadsOverTime.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={leadsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="leads" 
                      stroke="#00D4FF" 
                      strokeWidth={3}
                      dot={{ fill: '#00D4FF', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  Sem dados para exibir
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Status</CardTitle>
              <CardDescription>Todos os leads</CardDescription>
            </CardHeader>
            <CardContent>
              {statusDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(Number(percent) * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#999'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  Sem dados para exibir
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        {topAdvogados.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top Advogados por Conversão</CardTitle>
              <CardDescription>Ranking de performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topAdvogados}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="nome" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="total_leads" fill="#4285f4" name="Total Leads" />
                  <Bar dataKey="leads_convertidos" fill="#34a853" name="Convertidos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;