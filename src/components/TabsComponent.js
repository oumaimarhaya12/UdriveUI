"use client"

import "../styles/dashboard.css"

const TabsComponent = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="modern-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`modern-tab ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
          {activeTab === tab.id && <div className="tab-indicator"></div>}
        </button>
      ))}
    </div>
  )
}

export default TabsComponent
