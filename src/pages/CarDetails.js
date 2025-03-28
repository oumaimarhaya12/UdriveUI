"use client"
import { useParams } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/footer"
import CarDetailsComponent from "../components/CarDetailsComponent"
import PaymentDetails from "../components/PaymentDetails"
import FactsInNumbers from "../components/FactsInNmb"
import "../styles/CarDetails.css"

function CarDetailsPage() {
  const { carId } = useParams()

  return (
    <div className="car-details-page">
      <Header />
      <div className="content-container">
        <CarDetailsComponent carId={carId} />
        <PaymentDetails />
        <FactsInNumbers />
      </div>
      <Footer />
    </div>
  )
  //éugfrlhl"'f
}

export default CarDetailsPage
