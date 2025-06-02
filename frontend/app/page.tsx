import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
                Join the movement that rewards you for growing rare and endangered seeds while helping create a greener,
                more sustainable future.
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
                    Our platform creates a sustainable ecosystem where everyone benefits
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Coins className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Earn While You Grow</h3>
                      <p className="text-muted-foreground">
                        Get rewarded with adopt-a-seed coins for growing and documenting your plants&apos; progress.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Leaf className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Preserve Biodiversity</h3>
                      <p className="text-muted-foreground">
                        Help preserve rare and endangered plant species by growing them in different environments.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Globe className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Cleaner Environment</h3>
                      <p className="text-muted-foreground">
                        Contribute to cleaner air and a healthier planet by increasing plant growth worldwide.
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
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">What Our Growers Say</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Hear from our community members who are contributing to a sustainable future
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <p className="text-sm text-muted-foreground">Urban Gardener</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  &quot;Participating in adopt-a-seed has been a rewarding experience. I&apos;ve cultivated rare herbs
                  on my balcony and earned over 500 adopt-a-seed coins. It&apos;s fulfilling to contribute to
                  biodiversity while being rewarded for my efforts.&quot;
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <h4 className="font-semibold">Michael Chen</h4>
                    <p className="text-sm text-muted-foreground">Community Garden Leader</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  &quot;Our community garden has thrived with the rare seeds we&apos;ve adopted through adopt-a-seed.
                  The platform has connected us with unique plant species, fostering a sense of community and
                  contributing to environmental sustainability.&quot;
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <h4 className="font-semibold">Elena Rodriguez</h4>
                    <p className="text-sm text-muted-foreground">Environmental Scientist</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  &quot;As an environmental scientist, I value the data collected on seed adaptation to various
                  environments. adopt-a-seed not only supports biodiversity but also provides valuable insights for
                  scientific research. The rewards are an added bonus!&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 md:py-24 bg-green-800 text-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Join the Green Revolution Today</h2>
              <p className="text-xl max-w-2xl opacity-90">
                Start growing, earning, and making a positive impact on our planet. Sign up now and get your first seeds
                for free!
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
