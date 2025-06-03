import { Button } from "@/components/ui/button";
import { ArrowRight, Coins, Leaf, Sprout } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-green-50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How To Get Started</h2>
              <Button asChild size="lg" className="bg-green-700">
                <Link href="/sport">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white shadow-sm">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Sprout className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Search & Adopt</h3>
                <p className="text-muted-foreground">
                  Browse our database of seeds from registered local seed databases and adopt the ones you want to grow.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white shadow-sm">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Grow & Report</h3>
                <p className="text-muted-foreground">
                  Grow your adopted seeds and report their progress. Our community will help you with tips and guidance.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white shadow-sm">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Coins className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Earn & Withdraw</h3>
                <p className="text-muted-foreground">
                  Earn adopt-a-seed coins for your contributions, which can be withdrawn as our custom cryptocurrency.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
