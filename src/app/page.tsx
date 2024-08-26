import HomePage from "@/components/landing-page/home-page";
import Navbar from "@/components/landing-page/Navbar";


export default function Home() {





  return (
    <main className="w-full">
      <Navbar  />
    <div  className="w-full max-w-[1600px]   min-h-screen     mx-auto">
      <HomePage  />
       </div>
    </main>
  );
}
