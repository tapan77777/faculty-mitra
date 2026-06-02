import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import HowItWorks from "@/components/HowItWorks";
import WhatsAppDemo from "@/components/WhatsAppDemo";
import Features from "@/components/Features";
import WhyWhatsApp from "@/components/WhyWhatsApp";
import Team from "@/components/Team";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <WhatsAppDemo />
      <Features />
      <WhyWhatsApp />
      <Team />
      <Footer />
    </main>
  );
}
