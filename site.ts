/**
 * Central content model. External URLs, contact details, leadership and delivery figures
 * were verified against https://iyanlabs.com/ and the official iyanLabs LinkedIn page.
 * Headline accents are marked with {braces} and rendered in the editorial serif.
 */

export const LINKS = {
  site: 'https://iyanlabs.com/',
  varavu: 'https://iyanlabs.com/products.html',
  linkedin: 'https://in.linkedin.com/in/iyan-labs-764abb402',
  email: 'reachus@iyanlabs.com',
} as const;

export const NAV = [
  { label: 'Our Approach', href: '#approach' },
  { label: 'Services', href: '#services' },
  { label: 'Our Work', href: '#work' },
  { label: 'About', href: '#about' },
] as const;

export const HERO = {
  eyebrow: "Engineering what's next",
  support: 'Technology that moves your business forward.',
  body: 'From Salesforce solutions and MuleSoft integrations to high-performance mobile applications, iyanLabs turns complex business challenges into connected digital experiences.',
  trust: 'Business-first thinking. Engineering-led delivery. Built for what comes next.',
  ticker: ['Salesforce', 'MuleSoft', 'Mobile'],
};

export const MARQUEE = [
  'Salesforce', 'Apex', 'Lightning Web Components', 'OmniStudio', 'MuleSoft Anypoint', 'DataWeave',
  'API-led connectivity', 'iOS', 'Android', 'React Native', 'Flutter',
];

export const CHALLENGE = {
  eyebrow: 'The challenge',
  headline: "Your Business Shouldn't Have to Work {Around} Your Technology.",
  body: 'Disconnected systems, repetitive manual work, and clunky digital experiences can slow teams down. We help bring your applications, data, and business processes together through practical engineering and thoughtful solution design.',
  cards: [
    { title: 'Disconnected Systems', description: 'Bring CRM platforms, enterprise applications, and operational data into a more connected ecosystem.' },
    { title: 'Complex Business Workflows', description: 'Simplify processes with solutions designed around how your people actually work.' },
    { title: 'Digital Experiences That Fall Short', description: 'Create useful, responsive applications that help customers and teams get things done.' },
  ],
};

export type ServiceId = 'salesforce' | 'mulesoft' | 'mobile';
export interface Service {
  id: ServiceId; number: string; name: string; headline: string; description: string;
  capabilities: string[]; value: string; visualLabel: string; cta: string; topic: string;
}

export const SERVICES_INTRO = {
  eyebrow: 'What we do',
  headline: 'Three Capabilities. {One} Connected Technology Partner.',
  body: 'Whether you need a stronger CRM, connected enterprise systems, or a mobile application, we bring the right engineering expertise to your business challenge.',
};

export const SERVICES: Service[] = [
  {
    id: 'salesforce', number: '01', name: 'Salesforce Solutions',
    headline: 'Make Your CRM Work the Way Your Business Works.',
    description: 'We help organizations design, customize, and improve Salesforce solutions that support customer relationships, streamline operations, and give teams better ways to work.',
    capabilities: ['Salesforce solutioning and architecture', 'Sales Cloud and Service Cloud', 'Custom Apex development', 'Lightning Web Components', 'OmniStudio and guided workflows', 'CRM customization and enhancements', 'Platform optimization and ongoing support'],
    value: 'Create a more useful CRM experience, reduce workflow friction, and align Salesforce with your business processes.',
    visualLabel: 'The Customer Command Center', cta: 'Explore Salesforce Solutions', topic: 'Salesforce Solutions',
  },
  {
    id: 'mulesoft', number: '02', name: 'MuleSoft Integration',
    headline: 'Connect Your Systems. Unlock Your Data.',
    description: 'We design and build MuleSoft integration solutions that help applications and enterprise systems exchange information through well-structured APIs and reliable data flows.',
    capabilities: ['MuleSoft Anypoint Platform', 'API-led connectivity', 'REST and SOAP API integration', 'DataWeave transformations', 'Cloud and legacy system connectivity', 'Integration architecture and implementation', 'Integration monitoring and support'],
    value: 'Reduce information silos, improve data consistency, and create connected workflows across your technology ecosystem.',
    visualLabel: 'The Connected Systems Network', cta: 'Explore MuleSoft Integration', topic: 'MuleSoft Integration',
  },
  {
    id: 'mobile', number: '03', name: 'Mobile App Development',
    headline: 'Powerful Digital Experiences, Wherever Work Happens.',
    description: 'We build thoughtful, high-performance mobile applications that help businesses serve customers, empower field teams, and extend digital workflows beyond the desktop.',
    capabilities: ['Mobile product discovery and planning', 'iOS and Android application development', 'Cross-platform development with React Native or Flutter', 'Mobile UI and UX design', 'Backend and API integration', 'Business workflow and field-force applications', 'Testing, release, and ongoing enhancements'],
    value: 'Make business processes accessible on the move with mobile experiences designed around users and real operational needs.',
    visualLabel: 'Business in Your Pocket', cta: 'Explore Mobile Development', topic: 'Mobile App Development',
  },
];

export type NodeId = 'salesforce' | 'mulesoft' | 'mobile' | 'business';
export const ECOSYSTEM = {
  eyebrow: 'The bigger picture',
  headline: 'Your Systems Should Work as {One.}',
  body: 'Salesforce helps manage customer relationships. MuleSoft connects applications and data. Mobile apps bring your digital workflows directly to the people who need them. Together, these capabilities can create a more connected business experience.',
  nodes: [
    { id: 'salesforce' as NodeId, name: 'Salesforce', role: 'Customer relationships and CRM workflows', glyph: 'CRM', shade: 'ivory' },
    { id: 'mulesoft' as NodeId, name: 'MuleSoft', role: 'API connectivity and data exchange', glyph: 'API', shade: 'terracotta' },
    { id: 'mobile' as NodeId, name: 'Mobile Apps', role: 'Customer and employee experiences', glyph: 'APP', shade: 'sand' },
    { id: 'business' as NodeId, name: 'Business Systems', role: 'Operational platforms and enterprise data', glyph: 'ERP', shade: 'graphite' },
  ],
  connections: [
    { from: 'salesforce' as NodeId, to: 'mulesoft' as NodeId, tag: 'Customer data', text: 'Customer, account and opportunity data flows from Salesforce into reusable APIs.' },
    { from: 'mulesoft' as NodeId, to: 'business' as NodeId, tag: 'Orders & inventory', text: 'MuleSoft exchanges orders, inventory and finance data with operational platforms and databases.' },
    { from: 'mulesoft' as NodeId, to: 'mobile' as NodeId, tag: 'Secure APIs', text: 'Mobile apps read and update business data securely through the same API layer.' },
  ],
};

export const PROCESS = {
  eyebrow: 'How we work',
  headline: 'A Clear Path from {Challenge} to Delivery.',
  steps: [
    { number: '01', title: 'Discover', description: 'Understand your goals, business challenges, existing systems, and the people who use them.', deliverable: 'Shared understanding and a clearly defined problem.' },
    { number: '02', title: 'Design', description: 'Shape the solution architecture, user experience, integration approach, and delivery plan.', deliverable: 'A practical solution blueprint.' },
    { number: '03', title: 'Build', description: 'Develop, integrate, and test the solution through focused engineering and iterative feedback.', deliverable: 'A working solution aligned with the agreed scope.' },
    { number: '04', title: 'Launch and Improve', description: 'Prepare for release, support adoption, and identify opportunities for ongoing improvement.', deliverable: 'A supported solution with a path for continuous improvement.' },
  ],
};

export const WORK = {
  eyebrow: 'Engineered for real-world needs',
  headline: "We Don't Just Deliver Solutions. We Build {Products,} Too.",
  body: 'Our work spans custom enterprise solutions and software products shaped by practical business needs.',
  varavu: {
    name: 'Varavu', headline: 'Billing, Simplified.',
    description: 'Varavu is an iyanLabs billing and invoicing product designed to help small businesses manage invoices, payments, and financial visibility across their everyday operations.',
    features: ['Invoicing and billing', 'Revenue visibility', 'Payment reminders', 'Cross-device access and synchronization', 'Customer records and expense tracking'],
  },
  portfolio: {
    title: 'Engineering Across Business Needs',
    /** As published on https://iyanlabs.com/products.html */
    figures: [
      { value: 20, suffix: '+', label: 'MuleSoft integrations delivered' },
      { value: 20, suffix: '+', label: 'Salesforce applications delivered' },
    ],
    note: 'Illustrative capability concepts. Client case studies are shared on request, subject to client approval.',
    items: [
      { kind: 'flow', category: 'Salesforce Applications', title: 'Guided service workflow', description: 'A concept for case intake, guided resolution steps and a unified customer view for service teams.' },
      { kind: 'sync', category: 'Enterprise Integrations', title: 'CRM-to-ERP order sync', description: 'A concept for API-led order and customer synchronisation between a CRM, an ERP and a commerce platform.' },
      { kind: 'phone', category: 'Mobile Applications', title: 'Field-force companion app', description: 'A concept for visit logging, task lists and order capture for teams working away from the desk.' },
    ],
  },
};

export const ABOUT = {
  eyebrow: 'The people behind the engineering',
  headline: 'A Technology Partner That Thinks {Beyond} the Code.',
  body: 'At iyanLabs, we believe good engineering starts with understanding the problem. We combine business context, technical expertise, and thoughtful execution to build solutions that are useful today and maintainable tomorrow.',
  values: [
    { title: 'Business First', description: 'Start with the real problem and define what success means before choosing the technology.' },
    { title: 'Engineering with Purpose', description: 'Choose clear architecture, maintainable code, and solutions appropriate to the challenge.' },
    { title: 'Transparent Collaboration', description: 'Communicate progress, surface risks, and keep stakeholders involved throughout delivery.' },
    { title: "Built for What's Next", description: 'Consider future maintenance, growth, and change from the beginning.' },
  ],
  /** As published on https://iyanlabs.com/about.html */
  leaders: [
    { name: 'Thulasimanikandan R', initials: 'TR', role: 'Founder & Head of Mobile Applications' },
    { name: 'Manikandan S', initials: 'MS', role: 'Director & Head of MuleSoft Integration' },
    { name: 'Vedha Viyas R', initials: 'VV', role: 'CTO & Head of Salesforce' },
  ],
};

export const CONTACT = {
  eyebrow: "Let's build something meaningful",
  headline: "Tell Us What You're Trying to {Solve.}",
  body: "Whether you need Salesforce expertise, a connected enterprise architecture, or a mobile application, let's explore the right solution for your business.",
  topics: ['Salesforce Solutions', 'MuleSoft Integration', 'Mobile App Development', 'Multiple Services', 'Other'],
};

export const FOOTER = {
  tagline: 'We Build Different.',
  description: 'Salesforce solutions, MuleSoft integration, and mobile applications for businesses ready to move forward.',
};
