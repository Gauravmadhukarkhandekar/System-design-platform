export type NavItem = {
  title: string;
  href: string;
  items?: NavItem[];
};

function flattenPaths(items: NavItem[]): { section: string; slug: string }[] {
  const paths: { section: string; slug: string }[] = [];
  for (const item of items) {
    if (item.items?.length) {
      paths.push(...flattenPaths(item.items));
    } else if (item.href) {
      const match = item.href.match(/^\/learn\/([^/]+)\/(.+)$/);
      if (match) paths.push({ section: match[1], slug: match[2] });
    }
  }
  return paths;
}

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
      {
        title: 'Core Concepts',
        href: '',
        items: [
          { title: 'What is System Design?', href: '/learn/hld/what-is-system-design' },
          { title: 'System Design Glossary', href: '/learn/hld/system-design-glossary' },
          { title: 'Functional vs Non-functional', href: '/learn/hld/functional-vs-non-functional' },
          { title: 'Core Performance Metrics', href: '/learn/hld/core-performance-metrics' },
          { title: 'Request Lifecycle', href: '/learn/hld/request-lifecycle' },
          { title: 'The Scaling Mindset', href: '/learn/hld/scaling-mindset' },
          { title: 'Sync vs Async Systems', href: '/learn/hld/sync-vs-async-systems' },
          { title: 'Back-of-Envelope Estimation', href: '/learn/hld/back-of-envelope-estimation' },
          { title: 'Capacity Planning', href: '/learn/hld/capacity-planning' },
          { title: 'SLAs, SLOs & SLIs', href: '/learn/hld/slas-slos-slis' },
        ],
      },
      {
        title: 'Data Storage',
        href: '',
        items: [
          { title: 'Database Fundamentals', href: '/learn/hld/database-fundamentals' },
          { title: 'SQL vs NoSQL Deep Dive', href: '/learn/hld/sql-vs-nosql-deep-dive' },
          { title: 'OLTP vs OLAP', href: '/learn/hld/oltp-vs-olap' },
          { title: 'ACID vs BASE Properties', href: '/learn/hld/acid-vs-base-properties' },
          { title: 'Database Indexing', href: '/learn/hld/database-indexing' },
          { title: 'LSM Trees vs B-Trees', href: '/learn/hld/lsm-trees-vs-b-trees' },
          { title: 'Read vs Write Patterns', href: '/learn/hld/read-vs-write-patterns' },
          { title: 'Denormalization', href: '/learn/hld/denormalization' },
          { title: 'Query Optimization', href: '/learn/hld/query-optimization' },
          { title: 'Connection Pooling', href: '/learn/hld/connection-pooling' },
          { title: 'Caching Strategies', href: '/learn/hld/caching-strategies' },
          { title: 'Cache Eviction', href: '/learn/hld/cache-eviction' },
          { title: 'Cache Invalidation', href: '/learn/hld/cache-invalidation' },
          { title: 'Redis Deep Dive', href: '/learn/hld/redis-deep-dive' },
          { title: 'Redis vs Memcached', href: '/learn/hld/redis-vs-memcached' },
          { title: 'Object Storage & CDN', href: '/learn/hld/object-storage-cdn' },
          { title: 'Edge Computing', href: '/learn/hld/edge-computing' },
          { title: 'Database Isolation Levels', href: '/learn/hld/database-isolation-levels' },
          { title: 'Choosing the Right Database', href: '/learn/hld/choosing-the-right-database' },
        ],
      },
      {
        title: 'Traffic & Load',
        href: '',
        items: [
          { title: 'Load Balancers', href: '/learn/hld/load-balancers' },
          { title: 'LB Algorithms', href: '/learn/hld/lb-algorithms' },
          { title: 'Consistent Hashing', href: '/learn/hld/consistent-hashing' },
          { title: 'Health Checks & Failover', href: '/learn/hld/health-checks-failover' },
          { title: 'Rate Limiting', href: '/learn/hld/rate-limiting' },
          { title: 'Throttling & Load Shedding', href: '/learn/hld/throttling-load-shedding' },
          { title: 'Forward vs Reverse Proxy', href: '/learn/hld/forward-vs-reverse-proxy' },
        ],
      },
      {
        title: 'Async Processing',
        href: '',
        items: [
          { title: 'Message Queues', href: '/learn/hld/message-queues' },
          { title: 'Pub/Sub Pattern', href: '/learn/hld/pub-sub-pattern' },
          { title: 'Producer-Consumer Pattern', href: '/learn/hld/producer-consumer-pattern' },
          { title: 'Consumer Groups', href: '/learn/hld/consumer-groups' },
          { title: 'Delivery Guarantees', href: '/learn/hld/delivery-guarantees' },
          { title: 'Retry Strategies', href: '/learn/hld/retry-strategies' },
          { title: 'Event-Driven Architecture', href: '/learn/hld/event-driven-architecture' },
          { title: 'Stream Processing', href: '/learn/hld/stream-processing' },
          { title: 'Batch vs Stream Processing', href: '/learn/hld/batch-vs-stream-processing' },
          { title: 'Apache Kafka Deep Dive', href: '/learn/hld/apache-kafka-deep-dive' },
          { title: 'Kafka vs RabbitMQ vs SQS', href: '/learn/hld/kafka-vs-rabbitmq-vs-sqs' },
        ],
      },
      {
        title: 'Scaling',
        href: '',
        items: [
          { title: 'Vertical vs Horizontal', href: '/learn/hld/vertical-vs-horizontal' },
          { title: 'Database Replication', href: '/learn/hld/database-replication' },
          { title: 'Sharding & Partitioning', href: '/learn/hld/sharding-partitioning' },
          { title: 'Stateless Services', href: '/learn/hld/stateless-services' },
          { title: 'Session Management', href: '/learn/hld/session-management' },
          { title: 'Auto-scaling', href: '/learn/hld/auto-scaling' },
          { title: 'High Availability', href: '/learn/hld/high-availability' },
        ],
      },
      {
        title: 'Architecture Patterns',
        href: '',
        items: [
          { title: 'Monolith vs Microservices', href: '/learn/hld/monolith-vs-microservices' },
          { title: 'API Gateway', href: '/learn/hld/api-gateway' },
          { title: 'Service Discovery', href: '/learn/hld/service-discovery' },
          { title: 'Circuit Breaker', href: '/learn/hld/circuit-breaker' },
          { title: 'Bulkhead Pattern', href: '/learn/hld/bulkhead-pattern' },
          { title: 'CQRS Pattern', href: '/learn/hld/cqrs-pattern' },
          { title: 'Event Sourcing', href: '/learn/hld/event-sourcing' },
          { title: 'Saga Pattern', href: '/learn/hld/saga-pattern' },
        ],
      },
      {
        title: 'Distributed Systems',
        href: '',
        items: [
          { title: 'CAP Theorem', href: '/learn/hld/cap-theorem' },
          { title: 'PACELC Theorem', href: '/learn/hld/pacelc-theorem' },
          { title: 'Consistency Models', href: '/learn/hld/consistency-models' },
          { title: 'Idempotency', href: '/learn/hld/idempotency' },
          { title: 'Distributed Transactions', href: '/learn/hld/distributed-transactions' },
          { title: 'Distributed Locks', href: '/learn/hld/distributed-locks' },
          { title: 'Leader Election', href: '/learn/hld/leader-election' },
          { title: 'Consensus Algorithms', href: '/learn/hld/consensus-algorithms' },
          { title: 'Vector Clocks', href: '/learn/hld/vector-clocks' },
        ],
      },
      {
        title: 'Observability',
        href: '',
        items: [
          { title: 'Logging Best Practices', href: '/learn/hld/logging-best-practices' },
          { title: 'Metrics & Monitoring', href: '/learn/hld/metrics-monitoring' },
          { title: 'Distributed Tracing', href: '/learn/hld/distributed-tracing' },
          { title: 'Alerting Strategies', href: '/learn/hld/alerting-strategies' },
          { title: 'Health Checks Deep Dive', href: '/learn/hld/health-checks-deep-dive' },
        ],
      },
      {
        title: 'Networking & APIs',
        href: '',
        items: [
          { title: 'Networking Basics', href: '/learn/hld/networking-basics' },
          { title: 'DNS Deep Dive', href: '/learn/hld/dns-deep-dive' },
          { title: 'REST, GraphQL, gRPC', href: '/learn/hld/rest-graphql-grpc' },
          { title: 'Protocol Buffers & Serialization', href: '/learn/hld/protocol-buffers-serialization' },
          { title: 'WebSockets & SSE', href: '/learn/hld/websockets-sse' },
          { title: 'API Versioning', href: '/learn/hld/api-versioning' },
          { title: 'Pagination Strategies', href: '/learn/hld/pagination-strategies' },
          { title: 'Retries & Timeouts', href: '/learn/hld/retries-timeouts' },
          { title: 'Compression Techniques', href: '/learn/hld/compression-techniques' },
        ],
      },
      {
        title: 'Security',
        href: '',
        items: [
          { title: 'Auth vs Authorization', href: '/learn/hld/auth-vs-authorization' },
          { title: 'OAuth 2.0 & OIDC', href: '/learn/hld/oauth-2-oidc' },
          { title: 'JWT & Tokens', href: '/learn/hld/jwt-tokens' },
          { title: 'TLS/SSL & HTTPS', href: '/learn/hld/tls-ssl-https' },
          { title: 'Encryption', href: '/learn/hld/encryption' },
          { title: 'API Security', href: '/learn/hld/api-security' },
          { title: 'Secrets Management', href: '/learn/hld/secrets-management' },
          { title: 'DDoS Protection', href: '/learn/hld/ddos-protection' },
        ],
      },
      {
        title: 'Specialized Databases',
        href: '',
        items: [
          { title: 'Time-Series Databases', href: '/learn/hld/time-series-databases' },
          { title: 'Graph Databases', href: '/learn/hld/graph-databases' },
          { title: 'Elasticsearch', href: '/learn/hld/elasticsearch' },
          { title: 'Bloom Filters', href: '/learn/hld/bloom-filters' },
        ],
      },
      {
        title: 'Interview Prep',
        href: '',
        items: [
          { title: 'Interview Framework', href: '/learn/hld/interview-framework' },
          { title: 'Requirement Clarification', href: '/learn/hld/requirement-clarification' },
          { title: 'Estimation Techniques', href: '/learn/hld/estimation-techniques' },
          { title: 'High-Level Design', href: '/learn/hld/high-level-design' },
          { title: 'Deep Dive Strategies', href: '/learn/hld/deep-dive-strategies' },
          { title: 'Bottleneck Analysis', href: '/learn/hld/bottleneck-analysis' },
          { title: 'Trade-off Analysis', href: '/learn/hld/trade-off-analysis' },
          { title: 'Practice Problems', href: '/learn/hld/practice-problems' },
        ],
      },
      {
        title: 'HLD Problems',
        href: '/learn/case-studies/design-url-shortener',
        items: [],
      },
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
    if (section.items?.length) {
      paths.push(...flattenPaths(section.items));
    }
  }
  return paths;
}
