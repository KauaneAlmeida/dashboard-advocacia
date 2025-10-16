import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Simulando login
      if (email && password) {
        toast.success("Login realizado com sucesso!");
        localStorage.setItem("isAuthenticated", "true");
        navigate("/dashboard");
      } else {
        toast.error("Por favor, preencha todos os campos");
      }
    } else {
      // Simulando registro
      if (email && password && name) {
        toast.success("Conta criada com sucesso! Faça login para continuar.");
        setIsLogin(true);
        setPassword("");
      } else {
        toast.error("Por favor, preencha todos os campos");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 gradient-accent rounded-2xl flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-3xl">L</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-bold">
            {isLogin ? "Bem-vindo ao LeadJus" : "Criar Conta"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin 
              ? "Faça login para acessar seu dashboard jurídico" 
              : "Cadastre-se para começar a gerenciar seus leads"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Dr. João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full gradient-accent text-white font-semibold">
              {isLogin ? "Entrar" : "Criar Conta"}
            </Button>
            <div className="text-sm text-center">
              {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-accent hover:underline font-medium"
              >
                {isLogin ? "Cadastre-se" : "Faça login"}
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Auth;
