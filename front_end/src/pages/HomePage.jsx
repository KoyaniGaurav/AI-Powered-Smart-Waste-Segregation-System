import AboutSection from "../components/AboutSection";
import CategorySection from "../components/CategorySection";
import HeroSection from "../components/HeroSection";
import HomeCtaSection from "../components/HomeCtaSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <CategorySection />
      <HomeCtaSection />
    </main>
  );
}
