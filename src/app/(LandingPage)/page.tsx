import Banner from "@/components/landing/home/Banner";
import LanguageToggle from "@/components/toggles/LanguageToggle";

export default function Home() {
  return (
    <section className="relative flex min-h-screen items-center justify-center">
      <div className="absolute top-32 right-12 z-1000 mb-4 pb-4 md:right-40 lg:right-64">
        <LanguageToggle />
      </div>
      <Banner />
    </section>
  );
}
