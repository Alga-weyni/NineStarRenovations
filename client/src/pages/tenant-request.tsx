import EmergencyHeader from "@/components/EmergencyHeader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TenantRequestForm from "@/components/forms/TenantRequestForm";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function TenantRequestPage() {
  const handleDownloadPDF = () => {
    window.open('/forms/tenant-blank.pdf', '_blank');
  };

  return (
    <div className="min-h-screen">
      <EmergencyHeader />
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text luxury-glow">
            Professional Property Repair<br />and Maintenance
          </h1>
          <p className="text-2xl md:text-3xl mb-8 text-foreground font-light">For Tenants in Winnipeg</p>
          <p className="text-lg mb-12 text-accent">Fast. Reliable. Licensed & Insured.</p>
          
          <div className="max-w-2xl mx-auto">
            <div className="glass-card rounded-xl p-10 card-hover">
              <div className="mb-8">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 luxury-glow" style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-highlight))' }}>
                  <span className="text-5xl">🏠</span>
                </div>
                <h3 className="text-3xl font-bold mb-3 gradient-text">For Tenants</h3>
                <p className="text-lg text-foreground">
                  Report maintenance issues and request repairs for your unit
                </p>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleDownloadPDF}
                  className="w-full"
                  size="lg"
                  data-testid="button-download-tenant-pdf"
                >
                  📄 Download Blank PDF
                </Button>
                <Button 
                  onClick={() => {
                    document.getElementById('tenant-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  variant="secondary"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  size="lg"
                  data-testid="button-scroll-to-form"
                >
                  📝 Submit Request Online
                </Button>
                <Link href="/landlord-request">
                  <Button variant="outline" className="w-full" size="lg" data-testid="button-landlord-form">
                    Need Landlord Form Instead?
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="tenant-form" className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <TenantRequestForm />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 gradient-text">Our Services</h2>
            <p className="text-xl text-muted-foreground">Comprehensive property maintenance solutions</p>
            <div className="luxury-divider mx-auto w-24 mt-6"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card rounded-xl p-8 text-center card-hover">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 luxury-glow" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}>
                <span className="text-3xl">🔧</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Emergency Repairs</h3>
              <p className="text-muted-foreground">24/7 emergency response for urgent property issues</p>
            </div>
            
            <div className="glass-card rounded-xl p-8 text-center card-hover">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 luxury-glow" style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-highlight))' }}>
                <span className="text-3xl">🏠</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Property Maintenance</h3>
              <p className="text-muted-foreground">Regular maintenance to keep properties in top condition</p>
            </div>
            
            <div className="glass-card rounded-xl p-8 text-center card-hover">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 luxury-glow" style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))' }}>
                <span className="text-3xl">🔨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Renovations</h3>
              <p className="text-muted-foreground">Complete renovation services for property improvements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">Contact 9 Star Renovations</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">📞</span>
              </div>
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-muted-foreground">
                <a href="tel:2044814243" className="hover:text-foreground transition-colors">
                  (204) 481-4243
                </a>
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">📧</span>
              </div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-muted-foreground">
                <a href="mailto:info@9starrenovations.com" className="hover:text-foreground transition-colors">
                  info@9starrenovations.com
                </a>
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">📍</span>
              </div>
              <h3 className="font-semibold mb-2">Service Area</h3>
              <p className="text-muted-foreground">Winnipeg, Manitoba</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Sticky Emergency CTA (Mobile) */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden z-40">
        <a
          href="tel:2044814243"
          className="block bg-destructive text-destructive-foreground text-center py-3 px-4 rounded-lg font-semibold shadow-lg"
          data-testid="button-mobile-emergency"
        >
          🚨 Emergency: (204) 481-4243
        </a>
      </div>
    </div>
  );
}
