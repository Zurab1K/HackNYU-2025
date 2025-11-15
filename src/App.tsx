import "./App.css";
import { Callout } from "./components/Callout";
import { Features } from "./components/Features";
import { Hero } from "./components/Hero";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="page-shell">
      <NavBar />
      <main>
        <Hero />
        <Features />
        <Callout />
      </main>
      <Footer />
    </div>
  );
}

export default App;
