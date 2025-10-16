import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Bell, UserCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Leads", path: "/leads" },
    { icon: Bell, label: "Follow-ups", path: "/followups" },
    { icon: UserCircle, label: "Advogados", path: "/advogados" },
    { icon: Settings, label: "Configurações", path: "/settings" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 gradient-primary border-b border-white/10 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 gradient-accent rounded-lg flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">LeadJus</span>
          </Link>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-secondary text-primary font-semibold shadow-glow" 
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="hidden md:inline text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
