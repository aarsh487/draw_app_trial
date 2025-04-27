import { Hero } from "../components/Hero";
import { Navbar } from "../components/Navbar";
  

export default function Home() {
  return (
  <div className="bg-gradient-to-t from-slate-50 to-violet-50">
    <Navbar />
    <Hero />
  </div>
  );
}
