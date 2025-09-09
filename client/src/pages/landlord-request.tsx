import EmergencyHeader from "@/components/EmergencyHeader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LandlordRequestForm from "@/components/forms/LandlordRequestForm";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function LandlordRequestPage() {
  const handleDownloadPDF = () => {
    window.open('/forms/landlord-blank.pdf', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <EmergencyHeader />
      <Header />
      
      {/* Hero Section */}
      <section className="hero-gradient text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Professional Property Repair<br />and Maintenance
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">For Landlords in Winnipeg</p>
          <p className="text-lg mb-12 opacity-80">Fast. Reliable. Licensed & Insured.</p>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-card text-card-foreground rounded-lg p-8 form-shadow">
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏢</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">For Landlords</h3>
                <p className="text-muted-foreground">
                  Property maintenance, repairs, and renovations for rental properties
                </p>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleDownloadPDF}
                  className="w-full"
                  size="lg"
                  data-testid="button-download-landlord-pdf"
                >
                  📄 Download Blank PDF
                </Button>
                <Button 
                  onClick={() => {
                    document.getElementById('landlord-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  variant="secondary"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  size="lg"
                  data-testid="button-scroll-to-form"
                >
                  📝 Submit Request Online
                </Button>
                <Link href="/tenant-request">
                  <Button variant="outline" className="w-full" size="lg" data-testid="button-tenant-form">
                    Need Tenant Form Instead?
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="landlord-form" className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LandlordRequestForm />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground">Comprehensive property maintenance solutions</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Emergency Repairs</h3>
              <p className="text-muted-foreground">24/7 emergency response for urgent property issues</p>
            </div>
            
            <div className="bg-card rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Property Maintenance</h3>
              <p className="text-muted-foreground">Regular maintenance to keep properties in top condition</p>
            </div>
            
            <div className="bg-card rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔨</span>
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
