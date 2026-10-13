import { ButtonLink } from '../components/ui/Button';
import { usePageMeta } from '../router';

export function NotFoundPage() {
  usePageMeta('Page not found | iyanLabs', 'The page you were looking for could not be found.', '/404');
  return (
    <section className="section" style={{ minHeight: '80vh', display: 'grid', placeItems: 'center', textAlign: 'center' }} aria-labelledby="nf-title">
      <div className="aurora aurora--soft" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="container" style={{ display: 'grid', gap: 20, justifyItems: 'center' }}>
        <p className="eyebrow">Error 404</p>
        <h1 id="nf-title" className="t-h2">This page drifted out of <span className="grad">orbit.</span></h1>
        <p className="t-lead">The page you were looking for doesn’t exist or has moved.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <ButtonLink href="/" icon="none">Back to Home</ButtonLink>
          <ButtonLink href="/#contact" variant="ghost" icon="none">Contact Us</ButtonLink>
        </div>
      </div>
    </section>
  );
}
