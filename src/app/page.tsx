import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import MarqueeBand from '@/components/landing/MarqueeBand';
import FeaturesSection from '@/components/landing/FeaturesSection';
import TopicsPreview from '@/components/landing/TopicsPreview';
import HowItWorks from '@/components/landing/HowItWorks';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import Spotlight from '@/components/ui/Spotlight';

export default function HomePage() {
  return (
    <main className="flex-1">
      <Spotlight />
      <Navbar />
      <HeroSection />
      <MarqueeBand />
      <FeaturesSection />
      <TopicsPreview />
      <HowItWorks />
      <CTASection />
      <Footer />
    </main>
  );
}
