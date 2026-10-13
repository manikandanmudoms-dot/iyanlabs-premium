/**
 * Our Approach page content (iyanLabs v4).
 * Facts come from the founder brief or https://iyanlabs.com (home, about, products, contact).
 * Headline accents are wrapped in {braces} and render as gradient text.
 */
export type Tone = 'mobile' | 'varavu' | 'ai' | 'web' | 'saas' | 'mulesoft' | 'salesforce' | 'custom';

export const TONE: Record<Tone, string> = {
  mobile: '#FF6B3D',
  varavu: '#F59E0B',
  ai: '#EC4899',
  web: '#8B5CF6',
  saas: '#6366F1',
  mulesoft: '#22D3EE',
  salesforce: '#3B82F6',
  custom: '#34D399',
};

export const APPROACH_SEO = {
  title: 'Our Approach | iyanLabs',
  description:
    'See how iyanLabs works: certified architects, business-first discovery, transparent delivery and post-launch support across mobile apps, Varavu, AI agents, websites, SaaS, MuleSoft, Salesforce and custom applications.',
};

export const SUBNAV = [
  { id: 'why', label: 'Why iyanLabs' },
  { id: 'clients', label: 'Clients' },
  { id: 'build', label: 'What We Build' },
  { id: 'working', label: 'How We Work' },
  { id: 'tech', label: 'Technologies' },
  { id: 'industries', label: 'Industries' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'faq', label: 'FAQ' },
];

export const HERO = {
  eyebrow: 'Our approach',
  headline: 'We {Understand} Before We Engineer.',
  body: 'Every engagement starts with your business, not our technology preferences. Certified architects, a business-first process and support after launch mean you always know what happens next.',
  trust: ['Est. 2023 · Bengaluru', '20+ team members', '4× MuleSoft certified', '10× Salesforce certified', 'Clients in India, UAE, US, UK & Southeast Asia'],
  phases: ['Discover', 'Design', 'Build', 'Launch'],
};

export const WHY = {
  eyebrow: 'Why iyanLabs',
  headline: 'Why Companies Choose {iyanLabs.}',
  reasons: [
    { stat: '14', unit: 'yrs', title: '14 Years of Experience', description: 'Our leadership brings 14 years of hands-on experience delivering enterprise technology.', size: 'lg' },
    { stat: '4×10', unit: '', title: 'Certified Architects', description: '4 MuleSoft and 10 Salesforce certifications across our architects.', size: 'lg', badges: ['4× MuleSoft', '10× Salesforce'] },
    { title: 'One Partner, Full Stack', description: 'Mobile, web, AI, SaaS, integration and CRM delivered by one accountable team.' },
    { title: 'Business-First Discovery', description: 'We deep-dive into your goals, pain points and technical landscape before writing a single line of code.' },
    { title: 'Radical Transparency', description: 'Clear scope, direct communication, no hidden timelines and no surprise invoices.' },
    { title: 'We Stay After Launch', description: 'Every project includes a 30-day post-launch warranty, with optional ongoing support.' },
  ],
};

/** Quotes copied word for word from https://iyanlabs.com. Add a third only once name and company are confirmed. */
export const TESTIMONIALS = {
  eyebrow: 'Client stories',
  headline: 'What Our {Clients} Say.',
  items: [
    {
      quote: 'IyanLabs built a field-force mobile app that our medical representatives now rely on every day across multiple cities. Doctor visit logs, sample tracking, and order submissions — all streamlined into one intuitive app. It completely replaced our paper-based process and improved field team accountability overnight.',
      name: 'Mr. M. MohanRam', initials: 'MM', role: 'Director, Formulation India', tag: 'Mobile App', tone: 'mobile' as Tone,
    },
    {
      quote: 'Managing appointments, staff schedules, and billing across our Tamil Nadu branches was always a challenge. IyanLabs delivered a mobile app that ties every branch together seamlessly — our team stays organised, customers can book easily, and I can oversee all locations from my phone in real time.',
      name: 'Mr. Jagadeesh', initials: 'MJ', role: 'Director, Great Makers', tag: 'Mobile App', tone: 'mobile' as Tone,
    },
  ],
};

export const BUILD = {
  eyebrow: 'What we build',
  headline: 'Solutions Built for How Your {Business} Works.',
  items: [
    { title: 'Mobile Apps', description: 'Cross-platform iOS and Android apps, from wireframe to App Store.', tone: 'mobile' as Tone, icon: 'M8 3h8a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 16 21H8a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 8 3zM11 18h2' },
    { title: 'Billing & Business Apps (via Varavu)', description: 'Our own billing and business management platform for mobile, web and desktop.', tone: 'varavu' as Tone, icon: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3' },
    { title: 'AI Agents & Chatbots', description: 'Agents that complete tasks and chatbots that answer, capture leads and hand over to your team.', tone: 'ai' as Tone, icon: 'M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4zM18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9z' },
    { title: 'Websites', description: 'Fast, responsive, search-friendly websites that turn visitors into customers.', tone: 'web' as Tone, icon: 'M3.5 5.5h17v13h-17zM3.5 9h17M7 12h5M7 15h8' },
    { title: 'SaaS Product Development', description: 'Multi-tenant products designed, built and scaled from idea to launch.', tone: 'saas' as Tone, icon: 'M7 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17 8.5a4.5 4.5 0 0 1 .5 8.97L17 18H7zM12 11v5M9.5 13.5 12 11l2.5 2.5' },
    { title: 'Integration Platform (MuleSoft iPaaS)', description: 'API-led connectivity across cloud, on-premise and legacy systems.', tone: 'mulesoft' as Tone, icon: 'M5 6h4v4H5zM15 6h4v4h-4zM10 15h4v4h-4zM9 8h6M7 10l4 5M17 10l-4 5' },
    { title: 'Salesforce CRM', description: 'Sales, Service and Experience Cloud solutions with Apex and Lightning Web Components.', tone: 'salesforce' as Tone, icon: 'M7 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17 8.5a4.5 4.5 0 0 1 .5 8.97L17 18H7z' },
    { title: 'Custom Applications', description: 'Tailored software for workflows no off-the-shelf tool handles well.', tone: 'custom' as Tone, icon: 'M8 7 3 12l5 5M16 7l5 5-5 5M13.5 5l-3 14' },
  ],
};

export const WORKING = {
  eyebrow: 'How we work',
  headline: 'What Working With Us {Actually} Looks Like.',
  steps: [
    { number: '01', title: 'Discover', description: 'We deep-dive into your goals, pain points and technical landscape before writing a single line of code.', youGet: 'A clearly defined problem and success criteria.', tone: '#22D3EE' },
    { number: '02', title: 'Design', description: 'Architecture, wireframes and system design — every decision justified and aligned to your outcomes.', youGet: 'A practical solution blueprint.', tone: '#6366F1' },
    { number: '03', title: 'Build', description: 'Agile sprints with continuous delivery, real feedback loops and no surprises at the finish line.', youGet: 'A working, tested solution.', tone: '#8B5CF6' },
    { number: '04', title: 'Launch', description: "We don't disappear after go-live. Ongoing support, monitoring and iteration as you grow.", youGet: 'A supported release with a 30-day warranty.', tone: '#EC4899' },
    { number: '05', title: 'Impact', description: 'Faster workflows, connected systems and better experiences that increase customer satisfaction and grow your business.', youGet: "Measurable improvement and a roadmap for what's next.", tone: '#34D399' },
  ],
};

export const TECH = {
  eyebrow: 'Our technology expertise',
  headline: 'Technologies That Power Your {Digital} Success.',
  highlights: [
    { value: 14, suffix: '', label: 'Years of experience' },
    { value: 4, suffix: '×', label: 'MuleSoft certifications' },
    { value: 10, suffix: '×', label: 'Salesforce certifications' },
  ],
  groups: [
    { group: 'Mobile', tone: '#FF6B3D', items: ['Flutter', 'Kotlin', 'Native iOS & Android', 'React Native'] },
    { group: 'Frontend', tone: '#8B5CF6', items: ['React'] },
    { group: 'Backend', tone: '#34D399', items: ['Python', 'Node.js'] },
    { group: 'Integration', tone: '#22D3EE', items: ['MuleSoft Anypoint', 'DataWeave', 'Anypoint MQ', 'REST & SOAP APIs'] },
    { group: 'CRM', tone: '#3B82F6', items: ['Salesforce', 'Apex', 'Lightning Web Components', 'Sales & Service Cloud'] },
  ],
};

/** Founder must confirm each industry before launch; remove any without real delivery experience. */
export const INDUSTRIES = {
  eyebrow: 'Industries',
  headline: 'Industries We {Serve.}',
  items: [
    { name: 'Banking & Finance', icon: 'M3 10h18M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18M12 3l9 5H3z' },
    { name: 'Supply Chain & Logistics', icon: 'M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19a1.5 1.5 0 1 0 0-.01M17 19a1.5 1.5 0 1 0 0-.01' },
    { name: 'Healthcare', icon: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10zM12 9v5M9.5 11.5h5' },
    { name: 'Wholesale Distribution', icon: 'M3 9l9-5 9 5v10H3zM8 19v-6h8v6' },
    { name: 'E-commerce', icon: 'M5 6h15l-2 8H7zM5 6 4 3H2M9 19a1.5 1.5 0 1 0 0-.01M17 19a1.5 1.5 0 1 0 0-.01' },
    { name: 'B2B SaaS', icon: 'M7 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17 8.5a4.5 4.5 0 0 1 .5 8.97L17 18H7z' },
    { name: 'HR Tech', icon: 'M9 8a3 3 0 1 0 0-.01M3 20c.8-3.4 3-5 6-5s5.2 1.6 6 5M17 11l2 2 3-4' },
    { name: 'Staffing & Recruitment', icon: 'M8 7a3 3 0 1 0 0-.01M16 7a3 3 0 1 0 0-.01M2 20c.6-3 2.8-4.5 6-4.5s5.4 1.5 6 4.5M14 15.6c.6-.1 1.3-.1 2-.1 3.2 0 5.4 1.5 6 4.5' },
    { name: 'Restaurant Tech', icon: 'M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 2-2 6 0 8v10' },
    { name: 'Automotive', icon: 'M5 16h14l-1.5-5.5A2 2 0 0 0 15.6 9H8.4a2 2 0 0 0-1.9 1.5zM3 16h18v3H3zM7 19v1M17 19v1' },
  ],
};

export const SHIPPED = {
  eyebrow: 'Proof of work',
  headline: "What We've Shipped for Clients — and {Ourselves.}",
  summary: { value: 40, label: 'projects shipped on time and on spec' },
  items: [
    { title: 'Mobile Apps', stat: '12', statLabel: 'apps live', detail: 'Including a field-force app for medical representatives and a multi-branch appointment, staff and billing app.', tone: 'mobile' as Tone, visual: 'phones' },
    { title: 'Varavu — Our Own Product', stat: '3', statLabel: 'platforms: mobile, web, desktop', detail: 'Billing and business management for small businesses, with GST-ready invoicing, revenue dashboard, payment reminders and live sync.', tone: 'varavu' as Tone, visual: 'varavu', cta: { label: 'Explore Varavu', url: 'https://iyanlabs.com/products.html' } },
    { title: 'Enterprise Integration with MuleSoft', stat: '20+', statLabel: 'integrations delivered', detail: 'Including real-time payment gateway integrations for a fintech, CRM-to-ERP synchronisation, a multi-cloud API gateway serving 3M+ requests per day, and event-driven architecture for a logistics platform.', tone: 'mulesoft' as Tone, visual: 'network' },
    { title: 'Salesforce CRM', stat: '20+', statLabel: 'applications delivered', detail: 'Salesforce applications and implementations across Sales, Service, Marketing and Experience Cloud.', tone: 'salesforce' as Tone, visual: 'crm' },
  ],
};

export const FAQ = {
  eyebrow: 'FAQ',
  headline: 'Questions, {Answered.}',
  items: [
    { q: 'How long does a typical project take?', a: 'Timelines vary by complexity. A focused mobile app typically takes 8–14 weeks, a Salesforce implementation 4–16 weeks, and MuleSoft integration projects 6–12 weeks. We give you a specific estimate after our discovery call.' },
    { q: 'Do you offer post-launch support?', a: 'Yes. All projects come with a 30-day post-launch warranty. We also offer ongoing support retainers for maintenance, feature additions and monitoring.' },
    { q: 'Can you work with our existing development team?', a: 'Yes. We work as staff augmentation, as a dedicated squad embedded within your team, or by taking full ownership of a project. We adapt to your workflow and tools.' },
    { q: 'Do you work with international clients?', a: "Yes. While we're based in Bengaluru, we work with clients across the US, UK, UAE and Southeast Asia. All communication and deliverables are in English." },
    { q: 'How do you decide where AI is worth using?', a: 'During discovery we review your workflows and data to find tasks where AI genuinely helps, then design guardrails and human approval where decisions matter.' },
  ],
};

export const CTA = {
  headline: "Let's Start with Your {Challenge.}",
  body: 'Tell us what you’re trying to solve. We reply to every enquiry within 24 hours.',
  email: 'reachus@iyanlabs.com',
  phone: '+91 9994412001',
  phoneHref: 'tel:+919994412001',
  hours: 'Mon–Fri, 9am–6pm IST',
};
