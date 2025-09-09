export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="flex items-center space-x-1">
              <span className="star-icon text-2xl">⭐</span>
              <span className="text-xl font-bold">9</span>
            </div>
            <span className="text-xl font-bold">9 Star Renovations</span>
          </div>
          <p className="text-background/80 mb-4">Professional Property Maintenance • Licensed & Insured</p>
          <p className="text-background/60 text-sm">
            <a href="tel:2044814243" data-testid="link-footer-phone">(204) 481-4243</a> •{" "}
            <a href="mailto:info@9starrenovations.com" data-testid="link-footer-email">info@9starrenovations.com</a> • Serving Winnipeg
          </p>
          <p className="text-background/60 text-xs mt-4">
            © 2025 9 Star Renovations - All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
