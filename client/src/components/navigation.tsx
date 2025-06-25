import { useState } from "react";
import { Menu, X, Rocket } from "lucide-react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "#home", label: "Home" },
    { href: "#timeline", label: "Timeline" },
    { href: "#calendar", label: "Calendar" },
    { href: "#tourism", label: "Tourism" },
    { href: "#dashboard", label: "Dashboard" },
    { href: "#quiz", label: "Quiz" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-morphism">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold flex items-center gap-2" style={{ color: 'hsl(207, 90%, 54%)' }}>
            <Rocket className="w-6 h-6" />
            <span style={{ fontFamily: 'Orbitron, monospace' }}>AstralChronos</span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="transition-colors duration-300 hover:text-blue-400"
              >
                {item.label}
              </button>
            ))}
          </div>
          
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left transition-colors duration-300 hover:text-blue-400"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
