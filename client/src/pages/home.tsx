import EmergencyHeader from "@/components/EmergencyHeader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Building2, Home, Shield, FileText } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <EmergencyHeader />
      <Header />
      
      <section className="hero-gradient text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            9 Star Renovations
          </h1>
          <p className="text-xl md:text-2xl mb-4 opacity-90">
            Professional Property Services in Winnipeg
          </p>
          <p className="text-lg mb-8 opacity-80">
            Licensed • Insured • Trusted by Property Owners & Tenants
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Submit a Service Request</h2>
            <p className="text-lg text-muted-foreground">Choose the form that applies to you</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Landlord Request</CardTitle>
                <CardDescription>For property owners and management companies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Property maintenance and repairs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Turnover services</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Renovations and upgrades</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Emergency repairs</span>
                  </li>
                </ul>
                <Link href="/landlord-request">
                  <Button className="w-full" size="lg">
                    Submit Landlord Request
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle className="text-2xl">Tenant Request</CardTitle>
                <CardDescription>For residential tenants reporting issues</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-secondary mr-2">✓</span>
                    <span>Plumbing and electrical issues</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-2">✓</span>
                    <span>Heating and cooling problems</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-2">✓</span>
                    <span>Appliance repairs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-2">✓</span>
                    <span>General maintenance</span>
                  </li>
                </ul>
                <Link href="/tenant-request">
                  <Button className="w-full bg-secondary hover:bg-secondary/90" size="lg">
                    Submit Tenant Request
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            <Card className="bg-muted/30">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Admin Portal</CardTitle>
                <CardDescription>For 9 Star Renovations staff only</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/admin/requests">
                  <Button variant="outline" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Access Admin Panel
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose 9 Star Renovations?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Fast Response</h3>
              <p className="text-muted-foreground">
                Emergency services available 24/7 with quick response times
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">Licensed & Insured</h3>
              <p className="text-muted-foreground">
                Fully licensed contractors with comprehensive insurance coverage
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Quality Work</h3>
              <p className="text-muted-foreground">
                Experienced professionals delivering high-quality results
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
