import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Database, Shield, Zap, LineChart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <Link href="/" className="font-semibold">
              DB Schema Visualizer
            </Link>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/about" className="text-sm font-medium">
              About
            </Link>
            <Link href="/pricing" className="text-sm font-medium">
              Pricing
            </Link>
            <Link href="/docs" className="text-sm font-medium">
              Docs
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 px-6 md:px-10 lg:px-16 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Understand Your Database at a Glance
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Turn complex SQL schemas into beautiful, interactive diagrams that
            make database relationships easy to understand.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-8">
                Start for free
              </Button>
            </Link>
            <Link href="/live">
              <Button variant="outline" size="lg" className="rounded-full px-8">
                Try the demo
              </Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-16">
              Powerful features for database visualization
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-xl shadow-sm">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Instant Visualization
                </h3>
                <p className="text-muted-foreground">
                  Paste your SQL schema and instantly see relationships in a
                  beautiful, interactive diagram.
                </p>
              </div>

              <div className="bg-background p-6 rounded-xl shadow-sm">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure by Design</h3>
                <p className="text-muted-foreground">
                  Your database schemas are yours alone - we process all
                  visualization client-side for complete privacy.
                </p>
              </div>

              <div className="bg-background p-6 rounded-xl shadow-sm">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Multiple SQL Dialects
                </h3>
                <p className="text-muted-foreground">
                  Support for PostgreSQL, MySQL, and MS SQL Server with
                  automatic dialect detection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container max-w-5xl">
            <div className="bg-primary/5 border rounded-2xl p-10 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to visualize your database?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of developers who use our tool to understand and
                document their databases.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="rounded-full px-8">
                    Create free account
                  </Button>
                </Link>
                <Link href="/live">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8"
                  >
                    Try without account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <span className="font-medium">DB Schema Visualizer</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DB Schema Visualizer. All rights
            reserved.
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm hover:text-primary">
              Terms
            </Link>
            <Link href="/contact" className="text-sm hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
