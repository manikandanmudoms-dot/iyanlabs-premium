/**
 * Central content model (prompt v3).
 * External URLs, contact details, leadership and delivery figures were verified against
 * https://iyanlabs.com/ and the official iyanLabs LinkedIn page.
 * Headline accents are marked with {braces} and rendered as animated gradient text.
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
  { label: 'AI Solutions', href: '#ai' },
  { label: 'Our Work', href: '#work' },
  { label: 'About', href: '#about' },
] as const;

export type ServiceId = 'salesforce' | 'mulesoft' | 'mobile' | 'web' | 'agents' | 'chatbots';

/** Service colour coding (always paired with an icon and label). */
export const TONES: Record<ServiceId, { color: string; text: string; name: string }> = {
  salesforce: { color: '#3B82F6', text: '#7DB3FF', name: 'electric blue' },
  mulesoft: { color: '#22D3EE', text: '#5EE3F5', name: 'cyan' },
  mobile: { color: '#FF6B3D', text: '#FF9472', name: 'ember' },
  web: { color: '#8B5CF6', text: '#B79CFF', name: 'violet' },
  agents: { color: '#EC4899', text: '#F57DB8', name: 'magenta' },
  chatbots: { color: '#34D399', text: '#5FE3B0', name: 'mint' },
};

export const HERO = {
  eyebrow: "Engineering what's next",
  support: 'Intelligent technology that moves your business forward.',
  body: 'From Salesforce solutions and MuleSoft integrations to mobile apps, websites, AI agents, and chatbots, iyanLabs turns complex business challenges into connected, intelligent digital experiences.',
  trust: 'Business-first thinking. Engineering-led delivery. Built for what comes next.',
  prompts: [
    'Connect Salesforce to our ERP…',
    'Build an AI agent for customer support…',
    'Launch our new company website…',
    'Create a mobile app for field teams…',
    'Add a chatbot to our website and WhatsApp…',
  ],
};

export const MARQUEE = {
  top: ['Salesforce', 'Apex', 'Lightning Web Components', 'OmniStudio', 'MuleSoft Anypoint', 'DataWeave', 'React', 'Next.js', 'iOS'],
  bottom: ['Android', 'React Native', 'Flutter', 'LLMs', 'AI agents', 'RAG', 'Chatbots', 'WhatsApp', 'Web chat'],
};

export const CHALLENGE = {
  eyebrow: 'The challenge',
  headline: "Your Business Shouldn't Have to Work {Around} Your Technology.",
  body: 'Disconnected systems, repetitive manual work, and outdated digital experiences slow teams down. We bring your applications, data, and processes together, and add intelligence where it creates real value.',
  cards: [
    { title: 'Disconnected Systems', description: 'Bring CRM platforms, enterprise applications, and operational data into a connected ecosystem.' },
    { title: 'Repetitive Manual Work', description: 'Automate routine tasks and enquiries with AI agents and chatbots designed around your processes.' },
    { title: 'Digital Experiences That Fall Short', description: 'Create fast websites and useful mobile apps that help customers and teams get things done.' },
  ],
};

export interface Service {
  id: ServiceId; number: string; group: 'Connect' | 'Build' | 'Intelligence'; name: string; headline: string;
  description: string; capabilities: string[]; value: string; visualLabel: string; cta: string; topic: string;
}

export const SERVICES_INTRO = {
  eyebrow: 'What we do',
  headline: 'Six Capabilities. One {Intelligent} Technology Partner.',
  body: 'Whether you need a stronger CRM, connected systems, a mobile app, a modern website, or AI that works alongside your team, we bring the right engineering expertise to your business challenge.',
};

export const SERVICES: Service[] = [
  {
    id: 'salesforce', number: '01', group: 'Connect', name: 'Salesforce Solutions',
    headline: 'Make Your CRM Work the Way Your Business Works.',
    description: 'We help organizations design, customize, and improve Salesforce solutions that support customer relationships, streamline operations, and give teams better ways to work.',
    capabilities: ['Salesforce solutioning and architecture', 'Sales Cloud and Service Cloud', 'Custom Apex development', 'Lightning Web Components', 'OmniStudio and guided workflows', 'CRM customization and enhancements', 'Platform optimization and ongoing support'],
    value: 'Create a more useful CRM experience, reduce workflow friction, and align Salesforce with your business processes.',
    visualLabel: 'Customer Command Center', cta: 'Explore Salesforce Solutions', topic: 'Salesforce Solutions',
  },
  {
    id: 'mulesoft', number: '02', group: 'Connect', name: 'MuleSoft Integration',
    headline: 'Connect Your Systems. Unlock Your Data.',
    description: 'We design and build MuleSoft integration solutions that help applications and enterprise systems exchange information through well-structured APIs and reliable data flows.',
    capabilities: ['MuleSoft Anypoint Platform', 'API-led connectivity', 'REST and SOAP API integration', 'DataWeave transformations', 'Cloud and legacy system connectivity', 'Integration architecture and implementation', 'Integration monitoring and support'],
    value: 'Reduce information silos, improve data consistency, and create connected workflows across your technology ecosystem.',
    visualLabel: 'Connected Systems Network', cta: 'Explore MuleSoft Integration', topic: 'MuleSoft Integration',
  },
  {
    id: 'mobile', number: '03', group: 'Build', name: 'Mobile App Development',
    headline: 'Powerful Digital Experiences, Wherever Work Happens.',
    description: 'We build thoughtful, high-performance mobile applications that help businesses serve customers, empower field teams, and extend digital workflows beyond the desktop.',
    capabilities: ['Mobile product discovery and planning', 'iOS and Android application development', 'Cross-platform development with React Native or Flutter', 'Mobile UI and UX design', 'Backend and API integration', 'Business workflow and field-force applications', 'Testing, release, and ongoing enhancements'],
    value: 'Make business processes accessible on the move with mobile experiences designed around users and real operational needs.',
    visualLabel: 'Business in Your Pocket', cta: 'Explore Mobile Development', topic: 'Mobile App Development',
  },
  {
    id: 'web', number: '04', group: 'Build', name: 'Website Development',
    headline: 'Websites That Look Sharp and Work Hard.',
    description: 'We design and build fast, responsive, and search-friendly websites and web applications that represent your brand and turn visitors into customers.',
    capabilities: ['Corporate and marketing websites', 'Web application development', 'Responsive UI and UX design', 'Modern frameworks such as React and Next.js', 'Performance, accessibility, and SEO foundations', 'CMS and integration with business systems', 'Hosting setup, maintenance, and enhancements'],
    value: 'Give your business a modern online presence that loads fast, works on every device, and supports your sales and service goals.',
    visualLabel: 'The Self-Building Browser', cta: 'Explore Website Development', topic: 'Website Development',
  },
  {
    id: 'agents', number: '05', group: 'Intelligence', name: 'AI Agents',
    headline: "AI That Doesn't Just Answer. It Gets Work Done.",
    description: 'We design and build AI agents that understand goals, use your business tools and data, and complete multi-step tasks, with human oversight where it matters.',
    capabilities: ['AI use-case discovery and planning', 'Custom AI agent design and development', 'Integration with CRM, ERP, email, and internal systems', 'Knowledge retrieval from your business documents', 'Workflow automation with human-in-the-loop approvals', 'Guardrails, monitoring, and evaluation', 'Ongoing tuning and improvement'],
    value: 'Reduce repetitive work, speed up processes, and let your team focus on higher-value tasks.',
    visualLabel: 'The Agent Workflow Graph', cta: 'Explore AI Agents', topic: 'AI Agents',
  },
  {
    id: 'chatbots', number: '06', group: 'Intelligence', name: 'Chatbot Solutions',
    headline: 'Conversations That Help Customers, Day and Night.',
    description: 'We build intelligent chatbots for websites, apps, and messaging channels that answer questions, capture leads, and hand over to your team when needed.',
    capabilities: ['Website and in-app chatbots', 'Messaging channel chatbots such as WhatsApp', 'AI-powered answers from your knowledge base', 'Lead capture and appointment booking flows', 'CRM and helpdesk integration', 'Human handover and conversation analytics', 'Multilingual conversation design'],
    value: 'Respond faster, support customers around the clock, and capture more opportunities without adding workload.',
    visualLabel: 'The Streaming Conversation', cta: 'Explore Chatbot Solutions', topic: 'Chatbot Solutions',
  },
];

export const GROUPS = [
  { name: 'Connect', blurb: 'Enterprise systems that share one version of the truth.' },
  { name: 'Build', blurb: 'Digital experiences your customers and teams actually use.' },
  { name: 'Intelligence', blurb: 'AI that understands requests and gets work done.' },
] as const;

export const AI_SHOWCASE = {
  eyebrow: 'Intelligence, connected',
  headline: 'AI That {Works} for Your Business.',
  body: "AI agents and chatbots are most useful when they're connected to the systems you already use. Because we also build your CRM, integrations, apps, and websites, your AI can see the right data and take the right actions.",
  demoLabel: 'Demo conversation (illustrative)',
  /** Answers are written only from the service content above. */
  qa: [
    {
      q: 'What can an AI agent do for my support team?',
      a: 'An AI agent can take on repetitive support work. It understands the request, finds answers in your knowledge base, works with your CRM or helpdesk, and completes multi-step tasks, with human approval where it matters. Your team gets more time for the conversations that need them. Want to explore a support agent? Let’s talk.',
    },
    {
      q: 'Can a chatbot work with our Salesforce data?',
      a: 'Yes. We build chatbots that connect to your CRM and helpdesk through secure integrations, so they can answer questions, capture leads, and hand over to your team when needed. Because we also deliver Salesforce and MuleSoft work, the pieces fit together. Tell us about your setup.',
    },
    {
      q: 'How do we start an AI project?',
      a: 'We start with discovery: your goals, systems, data, and where AI can genuinely help. Then we design the solution with guardrails, build and test it iteratively, and launch with monitoring so it keeps improving. A short conversation with us is the best first step.',
    },
  ],
  agent: {
    goal: 'Resolve a delayed-order enquiry',
    steps: [
      { tool: 'CRM', label: 'Find the customer and order' },
      { tool: 'Database', label: 'Check the shipment status' },
      { tool: 'Email', label: 'Draft a personalised update' },
      { tool: 'Approval', label: 'Team member reviews and approves' },
      { tool: 'Calendar', label: 'Schedule a follow-up check' },
    ],
  },
  highlights: [
    { title: 'Connected to Your Systems', description: 'Agents and chatbots that work with your CRM, ERP, and business data through secure integrations.' },
    { title: 'Human in the Loop', description: 'Approvals, handovers, and guardrails keep people in control of important decisions.' },
    { title: 'Built to Improve', description: 'Monitoring and evaluation help your AI get more useful over time.' },
  ],
};

export type NodeId = 'core' | 'salesforce' | 'mulesoft' | 'web' | 'mobile' | 'chatbots' | 'business';
export const ECOSYSTEM = {
  eyebrow: 'The bigger picture',
  headline: 'Your Systems Should {Think} and Work as One.',
  body: 'Salesforce manages customer relationships. MuleSoft connects applications and data. Websites and mobile apps put experiences in front of people. AI agents and chatbots add intelligence across all of them.',
  nodes: [
    { id: 'core' as NodeId, name: 'AI Core', role: 'Agents and chatbots that understand requests and take action', glyph: 'AI', color: '#EC4899' },
    { id: 'salesforce' as NodeId, name: 'Salesforce', role: 'Customer relationships and CRM workflows', glyph: 'CRM', color: '#3B82F6' },
    { id: 'mulesoft' as NodeId, name: 'MuleSoft', role: 'API connectivity and data exchange', glyph: 'API', color: '#22D3EE' },
    { id: 'web' as NodeId, name: 'Websites', role: 'Brand presence and online customer journeys', glyph: 'WEB', color: '#8B5CF6' },
    { id: 'mobile' as NodeId, name: 'Mobile Apps', role: 'Customer and employee experiences on the move', glyph: 'APP', color: '#FF6B3D' },
    { id: 'chatbots' as NodeId, name: 'Chatbots', role: 'Conversations across web, app, and messaging channels', glyph: 'BOT', color: '#34D399' },
    { id: 'business' as NodeId, name: 'Business Systems', role: 'Operational platforms and enterprise data', glyph: 'ERP', color: '#94A3B8' },
  ],
  connections: [
    { from: 'salesforce' as NodeId, to: 'core' as NodeId, text: 'AI reads customer context and updates CRM records as it works.' },
    { from: 'mulesoft' as NodeId, to: 'core' as NodeId, text: 'Secure APIs give AI agents governed access to enterprise data and actions.' },
    { from: 'web' as NodeId, to: 'core' as NodeId, text: 'Websites host assistants that answer questions and capture leads.' },
    { from: 'mobile' as NodeId, to: 'core' as NodeId, text: 'Mobile apps bring AI assistance to teams in the field.' },
    { from: 'chatbots' as NodeId, to: 'core' as NodeId, text: 'Chatbots are the conversational front door to your AI.' },
    { from: 'business' as NodeId, to: 'core' as NodeId, text: 'Operational data grounds AI answers in real business facts.' },
    { from: 'salesforce' as NodeId, to: 'mulesoft' as NodeId, text: 'Customer and opportunity data flows into reusable APIs.' },
    { from: 'mulesoft' as NodeId, to: 'business' as NodeId, text: 'Orders, inventory and finance data move between platforms.' },
  ],
};

export const PROCESS = {
  eyebrow: 'How we work',
  headline: 'A Clear Path from {Challenge} to Delivery.',
  steps: [
    { number: '01', title: 'Discover', description: 'Understand your goals, challenges, systems, data, and the people who use them, including where AI can genuinely help.', deliverable: 'Shared understanding and a clearly defined problem.' },
    { number: '02', title: 'Design', description: 'Shape the architecture, user experience, integration approach, AI guardrails, and delivery plan.', deliverable: 'A practical solution blueprint.' },
    { number: '03', title: 'Build', description: 'Develop, integrate, and test through focused engineering and iterative feedback.', deliverable: 'A working solution aligned with the agreed scope.' },
    { number: '04', title: 'Launch and Improve', description: 'Release, support adoption, monitor performance, and keep improving.', deliverable: 'A supported solution with a path for continuous improvement.' },
  ],
};

export const WORK = {
  eyebrow: 'Engineered for real-world needs',
  headline: "We Don't Just Deliver Solutions. We Build {Products,} Too.",
  body: 'Our work spans custom enterprise solutions, digital experiences, and software products shaped by practical business needs.',
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
      { id: 'salesforce' as ServiceId, title: 'Guided service workflow', description: 'Case intake, guided resolution steps and a unified customer view for service teams.' },
      { id: 'mulesoft' as ServiceId, title: 'CRM-to-ERP order sync', description: 'API-led order and customer synchronisation between a CRM, an ERP and a commerce platform.' },
      { id: 'mobile' as ServiceId, title: 'Field-force companion app', description: 'Visit logging, task lists and order capture for teams working away from the desk.' },
      { id: 'web' as ServiceId, title: 'Product launch website', description: 'A fast, responsive launch site with clear journeys from first visit to enquiry.' },
      { id: 'agents' as ServiceId, title: 'Support triage agent', description: 'An agent that classifies requests, gathers context and drafts responses for approval.' },
      { id: 'chatbots' as ServiceId, title: 'Lead capture assistant', description: 'A website and messaging assistant that answers questions and books follow-ups.' },
    ],
  },
};

export const ABOUT = {
  eyebrow: 'The people behind the engineering',
  headline: 'A Technology Partner That Thinks {Beyond} the Code.',
  body: 'At iyanLabs, we believe good engineering starts with understanding the problem. We combine business context, technical expertise, and thoughtful use of AI to build solutions that are useful today and maintainable tomorrow.',
  values: [
    { title: 'Business First', description: 'Start with the real problem and define what success means before choosing the technology.' },
    { title: 'Engineering with Purpose', description: 'Choose clear architecture, maintainable code, and solutions appropriate to the challenge.' },
    { title: 'Responsible AI', description: 'Use AI where it adds value, with guardrails, transparency, and human oversight.' },
    { title: "Built for What's Next", description: 'Consider future maintenance, growth, and change from the beginning.' },
  ],
  /** As published on https://iyanlabs.com/about.html */
  leaders: [
    { name: 'Thulasimanikandan R', initials: 'TR', role: 'Founder & Head of Mobile Applications', tone: '#FF6B3D' },
    { name: 'Manikandan S', initials: 'MS', role: 'Director & Head of MuleSoft Integration', tone: '#22D3EE' },
    { name: 'Vedha Viyas R', initials: 'VV', role: 'CTO & Head of Salesforce', tone: '#3B82F6' },
  ],
};

export const CONTACT = {
  eyebrow: "Let's build something intelligent",
  headline: "Tell Us What You're Trying to {Solve.}",
  body: 'Whether you need Salesforce expertise, connected systems, a mobile app, a new website, or an AI agent or chatbot, let’s explore the right solution for your business.',
  topics: ['Salesforce Solutions', 'MuleSoft Integration', 'Mobile App Development', 'Website Development', 'AI Agents', 'Chatbot Solutions', 'Multiple Services', 'Other'],
};

export const FOOTER = {
  tagline: 'We Build Different.',
  description: 'Salesforce, MuleSoft, mobile apps, websites, AI agents, and chatbots for businesses ready to move forward.',
};
