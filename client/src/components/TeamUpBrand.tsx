/**
 * Team Up Civic Editorial style: use the supplied TeamUP Foundation logo as the source of truth,
 * then keep the paper/ink palette and restrained bunting around it rather than redrawing the mark.
 */

const TEAMUP_FOUNDATION_LOGO = "/images/teamup-foundation-logo-transparent-local.png";

export function TeamUpLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`teamup-logo ${compact ? "teamup-logo--compact" : ""}`}>
      <img className="teamup-logo__source" src={TEAMUP_FOUNDATION_LOGO} alt="TeamUP Foundation" />
    </span>
  );
}

export function BuntingDivider({ light = false }: { light?: boolean }) {
  return (
    <div className={`bunting-divider ${light ? "bunting-divider--light" : ""}`} aria-hidden="true">
      <span className="bunting-divider__line" />
      <span className="bunting-divider__flag bunting-divider__flag--one" />
      <span className="bunting-divider__flag bunting-divider__flag--two" />
      <span className="bunting-divider__flag bunting-divider__flag--three" />
      <span className="bunting-divider__bulb" />
      <span className="bunting-divider__flag bunting-divider__flag--four" />
      <span className="bunting-divider__flag bunting-divider__flag--five" />
      <span className="bunting-divider__line" />
    </div>
  );
}
