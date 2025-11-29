import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Shield, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold text-sm">
              FG
            </div>
            <span className="font-semibold text-lg">FlowGuide</span>
          </div>
          <Link to="/login">
            <Button variant="outline" className="border-thin">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 xl:py-32">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl xl:text-6xl font-bold tracking-tight text-balance">
            Your AI-Powered Financial Memory Assistant
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Track every transaction, get intelligent advice, and achieve your financial goals with FlowGuide Personal.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link to="/login">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-thin">
              Learn More
            </Button>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-8 xl:p-12 shadow-card">
          <div className="aspect-video bg-background rounded border border-border flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-lg mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Dashboard Preview</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-20">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">AI-Powered Insights</h3>
            <p className="text-muted-foreground">
              Get personalized financial advice and insights powered by advanced AI technology.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">Secure & Private</h3>
            <p className="text-muted-foreground">
              Your financial data is encrypted and protected with enterprise-grade security.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">Track Your Progress</h3>
            <p className="text-muted-foreground">
              Monitor your financial goals and watch your wealth grow over time.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
          2025 FlowGuide Personal
        </div>
      </footer>
    </div>
  );
}
