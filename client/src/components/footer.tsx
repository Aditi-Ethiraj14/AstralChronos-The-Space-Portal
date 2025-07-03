import { Rocket, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 border-t" style={{ backgroundColor: 'hsl(240, 62%, 6%)', borderColor: 'hsl(220, 69%, 36%, 0.2)' }}>
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl mb-4 flex items-center gap-2" style={{ fontFamily: 'Orbitron, monospace', color: 'hsl(207, 90%, 54%)' }}>
              <Rocket className="w-5 h-5" />
              AstralChronos
            </h3>
            <p className="text-gray-400 text-sm">
              Your gateway to exploring the cosmos through history, real-time data, and AI-powered experiences.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#timeline" className="transition-colors hover:text-blue-400">Space Timeline</a></li>
              <li><a href="#calendar" className="transition-colors hover:text-blue-400">Event Calendar</a></li>
              <li><a href="#tourism" className="transition-colors hover:text-blue-400">Space Tourism</a></li>
              <li><a href="#dashboard" className="transition-colors hover:text-blue-400">Live Dashboard</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="transition-colors hover:text-blue-400">NASA APIs</a></li>
              <li><a href="#" className="transition-colors hover:text-blue-400">Space News</a></li>
              <li><a href="#" className="transition-colors hover:text-blue-400">Educational Content</a></li>
              <li><a href="#quiz" className="transition-colors hover:text-blue-400">Space Quizzes</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/aditi_.146/" className="text-gray-400 hover:text-electric-blue transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 1.5A4 4 0 0 0 3.5 7.5v9A4 4 0 0 0 7.5 20.5h9a4 4 0 0 0 4-4v-9a4 4 0 0 0-4-4h-9zm4.5 3.25a4.75 4.75 0 1 1 0 9.5a4.75 4.75 0 0 1 0-9.5zm0 1.5a3.25 3.25 0 1 0 0 6.5a3.25 3.25 0 0 0 0-6.5zm5.2-.75a.8.8 0 1 1 0 1.6a.8.8 0 0 1 0-1.6z"/>
                </svg>
              </a>
              <a href="https://github.com/Aditi-Ethiraj14" className="text-gray-400 hover:text-electric-blue transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/aditi-ethiraj14/" className="text-gray-400 hover:text-electric-blue transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-cosmic-blue/20 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p className="flex items-center justify-center gap-2">
            &copy; 2025 AstralChronos. Made with <Heart className="w-4 h-4 text-red-500" /> by Aditi Ethiraj for space enthusiasts worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
