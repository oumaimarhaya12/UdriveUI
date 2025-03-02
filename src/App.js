import Header from "./components/Header";
import HeroForm from "./components/HeroForm";
import WhyUdrive from "./components/WhyUdrive";
import HowItWorks from "./components/HowItWorks";
import FactsInNumbers from "./components/FactsInNmb";
import Footer from "./components/footer";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <HeroForm />
      <WhyUdrive />
      <HowItWorks />
      <FactsInNumbers />
      <Footer />
    </div>
  );
}

export default App;
