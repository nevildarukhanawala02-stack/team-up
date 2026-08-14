import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { BuntingDivider, TeamUpLogo } from "@/components/TeamUpBrand";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="not-found-page section-paper">
      <header className="not-found-page__header"><a href="/" aria-label="Team Up home"><TeamUpLogo compact /></a></header>
      <main className="not-found-page__main">
        <p className="eyebrow"><span className="eyebrow__dot" /> A small detour</p>
        <h1>That page<br /><em>isn’t here.</em></h1>
        <p>It may have moved, or perhaps it was only ever a first thought. Let’s take you somewhere useful.</p>
        <BuntingDivider />
        <button className="arrow-link not-found-page__back" type="button" onClick={handleGoHome}><ArrowLeft size={17} /> Back to the homepage <ArrowRight size={17} /></button>
      </main>
    </div>
  );
}
