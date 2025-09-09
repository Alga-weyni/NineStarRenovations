import { Link } from "wouter";

export default function Header() {
  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center space-x-3 cursor-pointer hover-elevate">
              <div className="flex items-center space-x-1">
                <span className="star-icon text-2xl">⭐</span>
                <span className="text-2xl font-bold text-foreground">9</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">9 Star Renovations</h1>
                <p className="text-sm text-muted-foreground">Serving Winnipeg</p>
              </div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/landlord-request" data-testid="link-landlord-request">
              <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Landlord
              </span>
            </Link>
            <Link href="/tenant-request" data-testid="link-tenant-request">
              <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Tenant
              </span>
            </Link>
            <a
              href="/admin/requests?password=admin123"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-admin"
            >
              Admin
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
