import Navbar from "@/components/layout/Navbar";
import Image from "next/image";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#f58220] via-white to-white">
      <Navbar />
      <Image
        src="/images/Ellipse.png"
        alt="Wellbeing Survey Banner"
        width={1600}
        height={1600}
        className="absolute inset-0 top-0 z-10 h-48 w-full"
        priority
      />
      {children}
    </div>
  );
};

export default RootLayout;
