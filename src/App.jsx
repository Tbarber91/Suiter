// ==========================================================================
// CAREERLY — ROOT APP COMPONENT
// Simple state-based navigation (no router dependency).
// Replace with react-router if your project uses it.
// ==========================================================================
import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import JobDetailPage from "./pages/JobDetailPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { BottomNav } from "./components/Footer";

export default function App() {
  // route = { name: "home" | "search" | "detail" | "login" | "profile", jobId?: string }
  const [route, setRoute] = useState({ name: "home" });

  const navigate = (name) => setRoute({ name });
  const openJob = (jobId) => setRoute({ name: "detail", jobId });
  const back = () => setRoute({ name: "home" });

  return (
    <div className="app">
      {route.name === "home" && (
        <HomePage onNavigate={navigate} onSelectJob={openJob} />
      )}
      {route.name === "search" && (
        <SearchResultsPage onSelectJob={openJob} onBack={() => navigate("home")} />
      )}
      {route.name === "detail" && (
        <JobDetailPage jobId={route.jobId} onBack={back} />
      )}
      {route.name === "login" && <LoginPage onLogin={() => navigate("home")} />}
      {route.name === "profile" && <ProfilePage onNavigate={navigate} />}

      {/* Bottom nav hidden on login + detail (detail has its own apply bar) */}
      {route.name !== "login" && route.name !== "detail" && (
        <BottomNav
          active={route.name === "search" ? "search" : route.name}
          onNavigate={(key) => {
            if (key === "home") navigate("home");
            else if (key === "search") navigate("search");
            else if (key === "profile") navigate("profile");
            // "saved" / "messages" can be wired up later
          }}
        />
      )}
    </div>
  );
}
