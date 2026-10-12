import type { ReactElement } from 'react';
import type { ServiceId } from '../../content/site';
import './ServiceVisuals.css';

/*
 * Six compact, code-driven service visuals. All loops are CSS keyframes that only run when
 * the parent tile has `.is-in` (in view) and motion is enabled, so they cost nothing off-screen.
 */

function Salesforce() {
  return (
    <div className="mv mv-sf">
      <div className="mv-sf__stages"><span>Lead</span><span>Opportunity</span><span>Customer</span></div>
      <div className="mv-sf__bar"><i /></div>
      <div className="mv-sf__cards">
        {['Retail account', 'Logistics account', 'Service case'].map((t, i) => (
          <div key={t} className="mv-sf__card" style={{ ['--i' as string]: i }}><b />{t}<em>{['Qualified', 'Proposal', 'Won'][i]}</em></div>
        ))}
      </div>
    </div>
  );
}

function Mulesoft() {
  return (
    <div className="mv mv-ms">
      <div className="mv-ms__col">{['CRM', 'ERP', 'DB'].map((s) => <span key={s} className="mv-ms__src">{s}</span>)}</div>
      <div className="mv-ms__layers">
        {['System', 'Process', 'Experience'].map((l, i) => <span key={l} className="mv-ms__layer" style={{ ['--i' as string]: i }}>{l}</span>)}
        <i className="mv-ms__packet" /><i className="mv-ms__packet mv-ms__packet--2" />
      </div>
      <div className="mv-ms__col">{['App', 'Cloud'].map((s) => <span key={s} className="mv-ms__dst">{s}</span>)}</div>
    </div>
  );
}

function Mobile() {
  return (
    <div className="mv mv-mb">
      <div className="mv-mb__phone">
        <span className="mv-mb__notch" />
        <div className="mv-mb__scr mv-mb__scr--a"><b>Today</b><span className="mv-mb__card">4 visits</span><span className="mv-mb__bars"><i /><i /><i /><i /><i /></span></div>
        <div className="mv-mb__scr mv-mb__scr--b"><b>Site visit</b><span className="mv-mb__task done">Check in</span><span className="mv-mb__task done">Photos</span><span className="mv-mb__task now">Confirm order</span></div>
        <div className="mv-mb__scr mv-mb__scr--c"><span className="mv-mb__tick"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} /></svg></span><b>Order confirmed</b></div>
      </div>
    </div>
  );
}

function Web() {
  return (
    <div className="mv mv-wb">
      <div className="mv-wb__win">
        <div className="mv-wb__chrome"><i /><i /><i /><span>yourbrand.com</span></div>
        <div className="mv-wb__page">
          <span className="mv-wb__blk mv-wb__blk--nav" style={{ ['--i' as string]: 0 }} />
          <span className="mv-wb__blk mv-wb__blk--hero" style={{ ['--i' as string]: 1 }} />
          <span className="mv-wb__blk mv-wb__blk--a" style={{ ['--i' as string]: 2 }} />
          <span className="mv-wb__blk mv-wb__blk--b" style={{ ['--i' as string]: 3 }} />
          <span className="mv-wb__blk mv-wb__blk--c" style={{ ['--i' as string]: 4 }} />
        </div>
      </div>
      <div className="mv-wb__score">
        <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" className="mv-wb__track" /><circle cx="20" cy="20" r="16" className="mv-wb__ring" pathLength={1} /></svg>
        <span>Perf</span>
        <small>illustrative</small>
      </div>
    </div>
  );
}

function Agents() {
  const steps = ['Plan', 'Use tool', 'Act', 'Result'];
  return (
    <div className="mv mv-ag">
      <span className="mv-ag__goal">Goal</span>
      <span className="mv-ag__think"><i /><i /><i /></span>
      <div className="mv-ag__steps">
        {steps.map((s, i) => <span key={s} className="mv-ag__step" style={{ ['--i' as string]: i }}>{s}</span>)}
      </div>
    </div>
  );
}

function Chatbots() {
  const answer = 'Your order ships today. Want tracking by WhatsApp?'.split(' ');
  return (
    <div className="mv mv-cb">
      <div className="mv-cb__msg mv-cb__msg--user">Where is my order?</div>
      <div className="mv-cb__typing"><i /><i /><i /></div>
      <div className="mv-cb__msg mv-cb__msg--bot">
        {answer.map((w, i) => <span key={i} style={{ ['--i' as string]: i }}>{w} </span>)}
      </div>
      <div className="mv-cb__chips"><span>Yes, please</span><span>Talk to a person</span></div>
    </div>
  );
}

const MAP: Record<ServiceId, () => ReactElement> = { salesforce: Salesforce, mulesoft: Mulesoft, mobile: Mobile, web: Web, agents: Agents, chatbots: Chatbots };

export function ServiceVisual({ id }: { id: ServiceId }) {
  const V = MAP[id];
  return <div className="mv-wrap" aria-hidden="true"><V /></div>;
}
