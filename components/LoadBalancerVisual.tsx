import { clsx } from 'clsx';

const deploymentRows = [
  {
    type: 'Hardware',
    examples: 'F5 BIG-IP, Citrix ADC',
    pros: 'Ultra-high performance, dedicated',
    cons: 'Expensive, inflexible, vendor lock-in',
    bar: 'border-l-orange-500 bg-orange-500/[0.06]',
  },
  {
    type: 'Software',
    examples: 'Nginx, HAProxy, Envoy',
    pros: 'Flexible, programmable, open-source',
    cons: 'Requires server management',
    bar: 'border-l-sky-500 bg-sky-500/[0.06]',
  },
  {
    type: 'Cloud (LBaaS)',
    examples: 'AWS ELB, GCP LB, Azure LB',
    pros: 'Fully managed, auto-scaling, global',
    cons: 'Vendor lock-in, ongoing costs',
    bar: 'border-l-violet-500 bg-violet-500/[0.06]',
  },
];

export function LoadBalancerDeploymentTable() {
  return (
    <figure className="not-prose my-10 overflow-hidden rounded-2xl border border-orange-200/50 bg-gradient-to-b from-orange-50/30 to-background shadow-lg dark:border-orange-900/30 dark:from-orange-950/20">
      <figcaption className="border-b border-orange-200/50 bg-gradient-to-r from-orange-500/12 to-amber-500/8 px-5 py-4 dark:border-orange-900/40">
        <h4 className="text-base font-bold text-foreground">Hardware vs Software vs Cloud</h4>
      </figcaption>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-orange-100/80 to-amber-100/60 dark:from-orange-950/45 dark:to-amber-950/35">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Type</th>
              <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-widest">Examples</th>
              <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-widest">Pros</th>
              <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-widest">Cons</th>
            </tr>
          </thead>
          <tbody>
            {deploymentRows.map((r) => (
              <tr key={r.type} className={clsx('border-b border-border/40 last:border-0', 'border-l-4', r.bar)}>
                <th scope="row" className="px-4 py-3.5 font-bold text-foreground">
                  {r.type}
                </th>
                <td className="px-3 py-3.5 text-muted-foreground">{r.examples}</td>
                <td className="px-3 py-3.5 text-muted-foreground">{r.pros}</td>
                <td className="px-3 py-3.5 text-muted-foreground">{r.cons}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

const algoRows = [
  {
    algo: 'Round Robin',
    how: 'A → B → C → A...',
    best: 'Equal servers, uniform requests',
    color: 'border-l-cyan-500',
  },
  {
    algo: 'Weighted RR',
    how: 'A(3)→A→A→B(2)→B→C(1)',
    best: 'Different server capacities',
    color: 'border-l-blue-500',
  },
  {
    algo: 'Least Connections',
    how: 'Route to fewest active',
    best: 'Long-lived connections',
    color: 'border-l-emerald-500',
  },
  {
    algo: 'IP Hash',
    how: 'hash(client_ip) % servers',
    best: 'Session persistence',
    color: 'border-l-fuchsia-500',
  },
];

export function LoadBalancerAlgorithmTable() {
  return (
    <figure className="not-prose my-10 overflow-hidden rounded-2xl border border-cyan-200/60 bg-gradient-to-b from-cyan-50/35 to-background shadow-lg dark:border-cyan-900/40 dark:from-cyan-950/25">
      <figcaption className="border-b border-cyan-200/50 bg-gradient-to-r from-cyan-500/12 to-teal-500/8 px-5 py-4 dark:border-cyan-800/50">
        <h4 className="text-base font-bold text-foreground">Load balancing algorithms (overview)</h4>
        <p className="mt-1 text-sm text-muted-foreground">
          Quick overview — see the detailed algorithms page for a deep dive.
        </p>
      </figcaption>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-cyan-100/85 to-teal-100/65 dark:from-cyan-950/50 dark:to-teal-950/40">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Algorithm</th>
              <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-widest">How it works</th>
              <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-widest">Best for</th>
            </tr>
          </thead>
          <tbody>
            {algoRows.map((r) => (
              <tr key={r.algo} className={clsx('border-b border-border/40 last:border-0', 'border-l-4', r.color)}>
                <th scope="row" className="px-4 py-3.5 font-bold text-foreground">
                  {r.algo}
                </th>
                <td className="px-3 py-3.5 font-mono text-xs text-muted-foreground">{r.how}</td>
                <td className="px-3 py-3.5 text-muted-foreground">{r.best}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
