import { Button } from "@/components/ui/button";
import { ArrowRight, Coins, Globe, Leaf, Sprout } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
              <div className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 mb-2">
                Boilerplate
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">Leck Eier 🫩🤤</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Join the movement that rewards you for growing some balls. You should consider to leck eier if this is
                not the text you were expecting
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="bg-green-700">
                  <Link href="/login">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24 bg-green-50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How It Works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A simple process that benefits you and our planet
              </p>
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

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="/jonathan.png?height=600&width=600"
                  alt="Features"
                  width={600}
                  height={600}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    A Win-Win for You and the Planet
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Our platform creates a sustainable ecosystem where everyone gets to leck eier
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Coins className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Leck leck leck eier</h3>
                      <p className="text-muted-foreground">Get rewarded with coins for each eier you leck</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Leaf className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Preserve Eier</h3>
                      <p className="text-muted-foreground">Help preserve rare and endangered plant species by leck.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Globe className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Cleaner Eier lecken</h3>
                      <p className="text-muted-foreground">
                        Contribute to cleaner cleaner Eier lecken by showering at least 3 times a week.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-green-50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">What Our Eier Say</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Please leck meine Eier</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <h4 className="font-semibold">Leonard Eisingen</h4>
                    <p className="text-sm text-muted-foreground">Professional Eier lecker</p>
                  </div>
                </div>
                <p className="text-muted-foreground">&quot;I love lecking eier nom nom nom nom nom nom nom &quot;</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <h4 className="font-semibold">Michael Leck</h4>
                    <p className="text-sm text-muted-foreground">Community Eier Lecker</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  &quot;Our community garden has thrived with each of us lecking Eier every single day&quot;
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <h4 className="font-semibold">Eila Lecker</h4>
                    <p className="text-sm text-muted-foreground">Environmental Eier Lecker</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  &quot;As Environmental Eier lecker I need constant affirmation of my Eier lecken&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 md:py-24 bg-green-800 text-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Join the Green Eier Leck Revolution Today
              </h2>
              <p className="text-xl max-w-2xl opacity-90">
                Start lecken, lecken and lecken to make a positive impact on our planet. Sign up now and get your first
                Eier geleckt for free
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
