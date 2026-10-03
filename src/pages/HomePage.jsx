// ==========================================================================
// CAREERLY — HOME PAGE
// ==========================================================================
import React from "react";
import TopBar from "../components/TopBar";
import Hero from "../components/Hero";
import CompanyCard from "../components/CompanyCard";
import PromoBlock from "../components/PromoBlock";
import FeaturePillars from "../components/FeaturePillars";
import { Footer } from "../components/Footer";
import Icon from "../components/Icons";
import { companies } from "../data";

export default function HomePage({ onNavigate, onSelectJob }) {
  return (
    <>
      <TopBar avatarLetter="T" onMenu={() => {}} onOpenApp={() => {}} />
      <Hero
        title="Find the right company for you"
        subtitle="Everything you need to know about a company, all in one place."
        onSearch={() => onNavigate("search")}
      />

      <main className="page">
        <section className="section">
          <h2 className="section-title">Explore companies</h2>
          <p className="section-sub">Browse ratings, reviews and open roles.</p>
          <div className="company-scroll">
            {companies.map((c) => (
              <CompanyCard
                key={c.id}
                name={c.name}
                logoColor={c.logoColor}
                logoShape={c.logoShape}
                rating={c.rating}
                reviews={c.reviews}
                jobs={c.jobs}
                onClick={() => onSelectJob(c.id)}
              />
            ))}
          </div>
        </section>

        <PromoBlock
          tint="pink"
          icon={<Icon name="mail" size={44} color="#7c3aed" />}
          text={<>Receive new <b>Founder</b> jobs in <b>Adelaide SA 5000</b> direct in your inbox?</>}
          buttonLabel="Create alert"
          onButtonClick={() => {}}
        />

        <PromoBlock
          tint="blue"
          icon={<Icon name="edit" size={44} color="#0d1b3e" />}
          text="The more you add to your profile, the more you stand out from other candidates."
          buttonLabel="Complete your profile"
          onButtonClick={() => onNavigate("profile")}
        />

        <FeaturePillars
          pillars={[
            { icon: <Icon name="heart" size={40} color="var(--pink-500)" />, title: "Culture and values", subtitle: "Find out about the company culture" },
            { icon: <Icon name="chat" size={40} color="var(--pink-500)" />, title: "Ratings and reviews", subtitle: "Read reviews from employees" },
            { icon: <Icon name="gift" size={40} color="var(--pink-500)" />, title: "Perks and benefits", subtitle: "Find perks that matter to you" },
          ]}
        />

        <section className="link-list">
          <div className="link-row">See community guidelines <span className="arrow">→</span></div>
          <div className="link-row">Information for employers <span className="arrow">→</span></div>
        </section>

        <Footer />
      </main>
    </>
  );
}
