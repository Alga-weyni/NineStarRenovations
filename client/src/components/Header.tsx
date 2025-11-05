import { Link } from "wouter";
import { Star } from "lucide-react";

export default function Header() {
  return (
    <header className="glass-card border-b border-border backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center space-x-3 cursor-pointer hover-elevate transition-transform duration-300">
              <div className="flex items-center space-x-1 luxury-glow rounded-full p-2">
                <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold gradient-text">9</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">9 Star Renovations</h1>
                <p className="text-sm" style={{ color: 'var(--color-accent)' }}>Luxury Property Services</p>
              </div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/landlord-request" data-testid="link-landlord-request">
              <span className="text-foreground hover:text-highlight transition-all cursor-pointer font-medium hover:scale-105 inline-block">
                Landlord
              </span>
            </Link>
            <Link href="/tenant-request" data-testid="link-tenant-request">
              <span className="text-foreground hover:text-highlight transition-all cursor-pointer font-medium hover:scale-105 inline-block">
                Tenant
              </span>
            </Link>
            <Link href="/admin/requests" data-testid="link-admin">
              <span className="text-foreground hover:text-highlight transition-all cursor-pointer font-medium hover:scale-105 inline-block">
                Admin
              </span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
