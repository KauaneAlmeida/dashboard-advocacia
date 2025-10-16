import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Bell, Zap } from "lucide-react";

const Index = () => {
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem("isAuthenticated") === "true";
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen gradient-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="pt-8 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-2xl">L</span>
              </div>
              <span className="text-white font-bold text-2xl">LeadJus</span>
            </div>
            <Link to="/auth">
              <Button 
                variant="outline" 
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                Login
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div className="py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Transforme Leads em clientes Convertidos
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
              Sistema completo de gestão de leads para advogados com follow-up automatizado, 
              analytics em tempo real e integração com WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="gradient-accent text-white text-lg px-8 py-6 shadow-glow hover:scale-105 transition-transform"
                >
                  Começar Agora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button 
                size="lg"
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-lg px-8 py-6"
                onClick={() => {
                  // Scroll to features or show demo
                  document.querySelector('.pb-20')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Ver Demonstração
              </Button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="pb-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
            <div className="w-14 h-14 gradient-accent rounded-xl flex items-center justify-center mb-4">
              <Bell className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Follow-up Inteligente</h3>
            <p className="text-white/70">
              Nunca mais perca um lead. Sistema de notificações automáticas para leads que precisam de atenção.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
            <div className="w-14 h-14 gradient-accent rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Analytics em Tempo Real</h3>
            <p className="text-white/70">
              Acompanhe métricas de conversão, performance de advogados e evolução dos leads em dashboards interativos.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
            <div className="w-14 h-14 gradient-accent rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Integração WhatsApp</h3>
            <p className="text-white/70">
              Contate seus leads com um clique direto pelo WhatsApp. Agilidade no atendimento e mais conversões.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
