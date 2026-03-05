export type NavItem = {
  title: string;
  href: string;
  items?: NavItem[];
};

export const navigation: NavItem[] = [
  {
    title: 'Fundamentals',
    href: '/learn/fundamentals',
    items: [
      { title: 'What is System Design', href: '/learn/fundamentals/what-is-system-design' },
      { title: 'Functional vs Non Functional Requirements', href: '/learn/fundamentals/functional-vs-non-functional-requirements' },
      { title: 'System Design Process', href: '/learn/fundamentals/system-design-process' },
      { title: 'Scalability Basics', href: '/learn/fundamentals/scalability-basics' },
      { title: 'Latency vs Throughput', href: '/learn/fundamentals/latency-vs-throughput' },
    ],
  },
  {
    title: 'HLD (High Level Design)',
    href: '/learn/hld',
    items: [
      { title: 'Load Balancers', href: '/learn/hld/load-balancers' },
      { title: 'Caching', href: '/learn/hld/caching' },
      { title: 'Database Scaling', href: '/learn/hld/database-scaling' },
      { title: 'CAP Theorem', href: '/learn/hld/cap-theorem' },
      { title: 'Message Queues', href: '/learn/hld/message-queues' },
      { title: 'API Gateway', href: '/learn/hld/api-gateway' },
      { title: 'Rate Limiting', href: '/learn/hld/rate-limiting' },
    ],
  },
  {
    title: 'LLD (Low Level Design)',
    href: '/learn/lld',
    items: [
      { title: 'SOLID Principles', href: '/learn/lld/solid-principles' },
      { title: 'Design Patterns Overview', href: '/learn/lld/design-patterns-overview' },
      { title: 'Parking Lot System', href: '/learn/lld/parking-lot-system' },
      { title: 'Elevator System', href: '/learn/lld/elevator-system' },
      { title: 'Vending Machine Design', href: '/learn/lld/vending-machine-design' },
      { title: 'Library Management System', href: '/learn/lld/library-management-system' },
    ],
  },
  {
    title: 'Case Studies',
    href: '/learn/case-studies',
    items: [
      { title: 'Design URL Shortener', href: '/learn/case-studies/design-url-shortener' },
      { title: 'Design Twitter', href: '/learn/case-studies/design-twitter' },
      { title: 'Design WhatsApp', href: '/learn/case-studies/design-whatsapp' },
      { title: 'Design Uber', href: '/learn/case-studies/design-uber' },
      { title: 'Design YouTube', href: '/learn/case-studies/design-youtube' },
    ],
  },
];

export function getAllPaths(): { section: string; slug: string }[] {
  const paths: { section: string; slug: string }[] = [];
  for (const section of navigation) {
    if (section.items) {
      for (const item of section.items) {
        const match = item.href.match(/^\/learn\/([^/]+)\/(.+)$/);
        if (match) paths.push({ section: match[1], slug: match[2] });
      }
    }
  }
  return paths;
}
