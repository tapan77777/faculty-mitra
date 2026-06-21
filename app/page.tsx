import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import WhyWhatsApp from "@/components/WhyWhatsApp";
import Sources from "@/components/Sources";
import TechStack from "@/components/TechStack";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Problem />
      <Features />
      <HowItWorks />
      <WhyWhatsApp />
      <Sources />
      <TechStack />
      <Team />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}
