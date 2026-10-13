import { ApBuild, ApClients, ApCta, ApFaq, ApHero, ApIndustries, ApShipped, ApSubNav, ApTech, ApWhy, ApWorking } from '../components/approach/ApproachSections';
import { APPROACH_SEO } from '../content/approach';
import { usePageMeta } from '../router';
import '../styles/approach-tokens.css';

/** iyanLabs v4 · Our Approach. Section order is fixed by the founder brief. */
export function ApproachPage() {
  usePageMeta(APPROACH_SEO.title, APPROACH_SEO.description, '/approach');
  return (
    <div className="ap">
      <ApHero />
      <ApSubNav />
      <ApWhy />
      <ApClients />
      <ApBuild />
      <ApWorking />
      <ApTech />
      <ApIndustries />
      <ApShipped />
      <ApFaq />
      <ApCta />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://iyanlabs.com/' },
          { '@type': 'ListItem', position: 2, name: 'Our Approach', item: 'https://iyanlabs.com/approach' },
        ],
      }) }} />
    </div>
  );
}
