import { Link } from "wouter";
import { Star } from "lucide-react";

export default function Header() {
  return (
    <header className="premium-header border-b border-border/20 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center space-x-3 cursor-pointer hover-elevate transition-transform duration-300">
              <div className="flex items-center space-x-1 luxury-glow rounded-full p-2">
                <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold" style={{ color: '#C1E8FF' }}>9</span>
              </div>
              <div>
                <h1 className="text-xl font-bold header-title">9 Star Renovations</h1>
                <p className="text-sm header-subtitle">Luxury Property Services</p>
              </div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/landlord-request" data-testid="link-landlord-request">
              <span className="transition-all cursor-pointer font-medium hover:scale-105 inline-block" style={{ color: '#C1E8FF' }}>
                Landlord
              </span>
            </Link>
            <Link href="/tenant-request" data-testid="link-tenant-request">
              <span className="transition-all cursor-pointer font-medium hover:scale-105 inline-block" style={{ color: '#C1E8FF' }}>
                Tenant
              </span>
            </Link>
            <Link href="/admin/requests" data-testid="link-admin">
              <span className="transition-all cursor-pointer font-medium hover:scale-105 inline-block" style={{ color: '#C1E8FF' }}>
                Admin
              </span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
