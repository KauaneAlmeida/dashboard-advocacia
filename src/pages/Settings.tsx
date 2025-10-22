import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { LogOut, Moon } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  
  // Estados para os campos do perfil
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [oab, setOab] = useState("");
  
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Carregar dados salvos ao montar o componente
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setName(profile.name || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
      setOab(profile.oab || "");
    }

    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications) {
      setNotifications(savedNotifications === "true");
    }

    const savedEmailNotifications = localStorage.getItem("emailNotifications");
    if (savedEmailNotifications) {
      setEmailNotifications(savedEmailNotifications === "true");
    }

    // Garantir que o dark mode está sempre ativo
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast.success("Logout realizado com sucesso!");
    navigate("/");
  };

  const handleSave = () => {
    // Salvar dados do perfil
    const profile = { name, email, phone, oab };
    localStorage.setItem("userProfile", JSON.stringify(profile));
    
    // Salvar preferências de notificações
    localStorage.setItem("notifications", notifications.toString());
    localStorage.setItem("emailNotifications", emailNotifications.toString());
    
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">⚙️ Configurações</h1>
          <p className="text-muted-foreground">Gerencie suas preferências e informações do perfil</p>
        </div>

        <div className="space-y-6">
          {/* Perfil */}
          <Card>
            <CardHeader>
              <CardTitle>Perfil do Usuário</CardTitle>
              <CardDescription>Atualize suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Digite seu nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com.br"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+55 (11) 98765-4321"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="oab">OAB</Label>
                  <Input 
                    id="oab" 
                    value={oab}
                    onChange={(e) => setOab(e.target.value)}
                    placeholder="SP 123456"
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="gradient-accent text-white">
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>

          {/* Aparência */}
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>Tema do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Modo Escuro</p>
                    <p className="text-sm text-muted-foreground">Tema escuro ativado permanentemente</p>
                  </div>
                </div>
                <Switch checked={true} disabled />
              </div>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>Gerencie como você recebe notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações Push</p>
                  <p className="text-sm text-muted-foreground">Receba alertas de follow-ups urgentes</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações por Email</p>
                  <p className="text-sm text-muted-foreground">Receba resumos diários por email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
            </CardContent>
          </Card>

          {/* Integrações */}
          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>Conecte ferramentas externas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">📱</span>
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp Business</p>
                    <p className="text-sm text-muted-foreground">Conectado</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Configurar</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground text-xl">📧</span>
                  </div>
                  <div>
                    <p className="font-medium">Gmail</p>
                    <p className="text-sm text-muted-foreground">Não conectado</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Conectar</Button>
              </div>
            </CardContent>
          </Card>

          {/* Zona de Perigo */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
              <CardDescription>Ações irreversíveis</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleLogout} variant="destructive" className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Sair da Conta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;