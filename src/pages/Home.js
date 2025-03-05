import Header from "../components/Header";
import HeroForm from "../components/HeroForm";
import WhyUdrive from "../components/WhyUdrive";
import HowItWorks from "../components/HowItWorks";
import FactsInNumbers from "../components/FactsInNmb";
import Footer from "../components/footer";
import "../App.css";

function Home() {
  return (
    <div className="Home">
      <Header />
      <HeroForm />
      <WhyUdrive />
      <HowItWorks />
      <FactsInNumbers />
      <Footer />
    </div>
  );
}

export default Home;
