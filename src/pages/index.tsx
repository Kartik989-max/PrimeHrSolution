import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import IndustriesSection from "../components/IndustriesSection";
import CompaniesSection from "../components/CompaniesSection";
import AboutSection from "../components/AboutSection";
import CallToActionSection from "../components/CallToActionSection";
import JobCategories from "@/components/JobCategories";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex flex-col items-center justify-between text-[#183153]">
      <main className="flex flex-col items-center  w-full">
        <HeroSection />
        <CompaniesSection />
        <StatsSection />
        <JobCategories />
        <IndustriesSection />
        <AboutSection />
        <CallToActionSection />
      </main>
    </div>
  );
}
