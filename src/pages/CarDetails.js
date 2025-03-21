"use client"
import { useParams } from "react-router-dom"
import Header2 from "../components/Header2"
import Footer from "../components/footer"
import CarDetailsComponent from "../components/CarDetailsComponent"
import PaymentDetails from "../components/PaymentDetails"
import FactsInNumbers from "../components/FactsInNmb"
import "../styles/CarDetails.css"

function CarDetailsPage() {
  const { carId } = useParams()

  return (
    <div className="car-details-page">
      <Header2 />
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
