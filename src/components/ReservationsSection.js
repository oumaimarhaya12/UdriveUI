"use client"

import { useState } from "react"
import TabsComponent from "./TabsComponent"
import ReservationsTable from "./ReservationsTable"
import "../styles/ReservationsSection.css"

const ReservationsSection = ({
  pendingReservations,
  confirmedReservations,
  isLoading,
  handleApproveReservation,
  handleRejectReservation,
  formatDate,
}) => {
  const [activeTab, setActiveTab] = useState("pending")

  const tabs = [
    { id: "pending", label: "Pending Reservations" },
    { id: "confirmed", label: "Confirmed Reservations" },
  ]

  return (
    <div className="reservations-section">
      <TabsComponent activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

      {activeTab === "pending" && (
        <ReservationsTable
          reservations={pendingReservations}
          isLoading={isLoading}
          activeTab={activeTab}
          handleApproveReservation={handleApproveReservation}
          handleRejectReservation={handleRejectReservation}
          formatDate={formatDate}
        />
      )}

      {activeTab === "confirmed" && (
        <ReservationsTable
          reservations={confirmedReservations}
          isLoading={isLoading}
          activeTab={activeTab}
          handleApproveReservation={handleApproveReservation}
          handleRejectReservation={handleRejectReservation}
          formatDate={formatDate}
        />
      )}
    </div>
  )
}

export default ReservationsSection

