# 🚀 LeadJus - Dashboard Jurídico Inteligente

Sistema completo de gestão de leads para advogados com follow-up automatizado, analytics em tempo real e integração com WhatsApp.

## ✨ Características

### 🎯 Funcionalidades Principais

- **Dashboard Interativo**: KPIs em tempo real com gráficos dinâmicos
- **Gestão de Leads**: Organize e acompanhe todos os seus leads em um só lugar
- **Follow-up Automatizado**: Notificações inteligentes para leads que precisam de atenção
- **Performance de Advogados**: Acompanhe métricas individuais e comparativas
- **Integração WhatsApp**: Contato direto com um clique
- **Analytics Avançado**: Gráficos de linha, pizza e barras com Recharts

### 🎨 Design

- **Estilo**: Minimalista inspirado na Apple
- **Cores**: Azul escuro (#0A2540) + Ciano vibrante (#00D4FF)
- **Tipografia**: Montserrat
- **Totalmente Responsivo**: Desktop, tablet e mobile
- **Animações Suaves**: Transições fluidas e interativas

### 📊 Páginas

1. **Landing Page**: Apresentação do sistema
2. **Login/Registro**: Autenticação completa
3. **Dashboard**: Visão geral com gráficos e KPIs
4. **Leads**: Lista completa com filtros avançados
5. **Follow-ups**: Leads urgentes que precisam de atenção
6. **Advogados**: Performance individual de cada advogado
7. **Configurações**: Perfil, notificações e integrações

## 🛠️ Tecnologias

- **React 18** + TypeScript
- **Vite** - Build tool ultra-rápido
- **TailwindCSS** - Utility-first CSS
- **shadcn/ui** - Componentes UI modernos
- **Recharts** - Gráficos interativos
- **React Router** - Navegação SPA
- **Lucide React** - Ícones modernos
- **Sonner** - Notificações elegantes

## 🚀 Como Usar

### Acesso Rápido

1. Acesse a aplicação
2. Clique em "Login" ou "Começar Agora"
3. Faça login com qualquer email/senha (demo)
4. Explore o dashboard!

### Login Demo

- **Email**: qualquer email válido
- **Senha**: qualquer senha
- O sistema está em modo demo com dados mockados

## 📱 Funcionalidades Implementadas

### ✅ Autenticação
- Login/Registro com validação
- Proteção de rotas
- Logout

### ✅ Dashboard
- 4 KPIs principais (Total Leads, Convertidos, Taxa de Conversão, Follow-ups)
- Gráfico de linha (evolução temporal)
- Gráfico de pizza (distribuição por status)
- Gráfico de barras (top 3 advogados)

### ✅ Gestão de Leads
- Cards visuais com todas as informações
- Busca por nome, telefone ou email
- Filtro por status
- Detalhes completos em modal
- Integração WhatsApp (link direto)
- Ações: Ver detalhes, WhatsApp, Ligar

### ✅ Follow-ups
- Lista de leads urgentes (>2 dias sem resposta)
- Ordenação por urgência
- Destaque visual para leads críticos
- Ações rápidas

### ✅ Advogados
- Cards com foto e informações
- Métricas individuais
- Taxa de conversão com barra de progresso
- Ranking de performance

### ✅ Configurações
- Edição de perfil
- Dark/Light mode
- Notificações
- Integrações (WhatsApp, Gmail)

## 🎨 Design System

### Cores Principais
```css
--primary: #0A2540 (Azul escuro)
--secondary: #00D4FF (Ciano)
--success: #34a853 (Verde)
--warning: #fbbc04 (Laranja)
--destructive: #ea4335 (Vermelho)
```

### Gradientes
```css
--gradient-hero: Azul escuro → Ciano
--gradient-accent: Ciano claro → Ciano
--gradient-primary: Azul escuro variações
```

### Componentes Customizados
- Buttons com 8 variantes (default, destructive, outline, secondary, ghost, link, success, warning)
- Cards com hover effects e borders dinâmicos
- Stats cards com ícones e cores temáticas
- Progress bars animadas

## 📊 Dados Mock

O sistema usa dados mockados realistas incluindo:
- 7 leads de exemplo
- 3 advogados
- Gráficos com dados dos últimos 8 dias
- Distribuição por status
- Performance comparativa

## 🔐 Segurança

- Rotas protegidas com ProtectedRoute
- Validação de autenticação
- LocalStorage para sessão
- Redirecionamentos automáticos

## 🎯 Próximos Passos (Backend Integration)

Para conectar com a API real mencionada:

1. Substituir mock data por chamadas à API
2. Implementar Firebase Authentication
3. Conectar endpoints de analytics
4. Integração real com WhatsApp Business
5. Push notifications
6. PWA com service workers

### API Endpoints Preparados
```typescript
GET  /api/analytics/leads
GET  /api/analytics/leads/followup
GET  /api/analytics/advogados
GET  /api/analytics/dashboard/summary
POST /api/whatsapp/send-followup
PUT  /api/leads/{id}/status
PUT  /api/leads/{id}/assign
POST /api/leads/{id}/note
```

## 🎉 Destaques

- ✨ **100% Clicável**: Todas as interações funcionais
- 🎨 **Design Profissional**: Visual moderno e clean
- 📱 **Totalmente Responsivo**: Funciona em todos os dispositivos
- ⚡ **Performance**: Build otimizado com Vite
- 🔄 **Estado Gerenciado**: React hooks e context
- 🎯 **UX Excepcional**: Navegação intuitiva

## 📄 Licença

Projeto desenvolvido para demonstração de capacidades frontend.

---

**Desenvolvido com ❤️ usando React + TypeScript + TailwindCSS**
