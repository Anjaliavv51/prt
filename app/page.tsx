import Hero from "@/components/Hero";
import { FloatingNav } from "@/components/ui/floating-navbar";
import BentoGrid from "@/components/Grid";
import { navItems } from "@/data";
//import CanvasCursor from "@/components/cursor";


export default function Home() {
  return (
    <main className="relative bg-black-100 flex justify-center items-center
    flex-col overflow-hidden
    mx-auto sm:px-10 px-5" suppressHydrationWarning>
      {/*<CanvasCursor/>*/}
      <div className="max-w-7xl w-full">
        <FloatingNav
          navItems={navItems}
        />
        <Hero/>
        <BentoGrid/>
      </div>
    </main>
  );
}