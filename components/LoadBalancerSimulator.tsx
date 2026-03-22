'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { clsx } from 'clsx';

type Algo = 'RR' | 'LC';
type UserId = 'U1' | 'U2' | 'U3';

type Server = {
  id: string;
  healthy: boolean;
  active: number;
  totalReq: number;
  baseCpu: number;
};

/** Slightly hotter Server A so WARN state appears like the reference */
const initialServers: Server[] = [
  { id: 'A', healthy: true, active: 0, totalReq: 0, baseCpu: 72 },
  { id: 'B', healthy: true, active: 0, totalReq: 0, baseCpu: 35 },
  { id: 'C', healthy: true, active: 0, totalReq: 0, baseCpu: 15 },
];

const USERS: UserId[] = ['U1', 'U2', 'U3'];

const ALGO_LABEL: Record<Algo, string> = {
  RR: 'Round Robin',
  LC: 'Least Connections',
};

const lx = 12;
const cx = 50;
const rx = 88;

/** Smooth cubic paths (avoid sharp corners at LB) */
function pathUserToLb(uy: number) {
  return `M ${lx} ${uy} C ${lx + 24} ${uy}, ${cx - 16} ${cx - 14}, ${cx} ${cx}`;
}
function pathLbToServer(sy: number) {
  return `M ${cx} ${cx} C ${cx + 16} ${cx + 14}, ${rx - 24} ${sy}, ${rx} ${sy}`;
}
/** Side-by-side flow: U1/U2/U3 → LB → A/B/C (two-hop packet + labels) */
function ColumnFlowDiagram({
  activeUser,
  activeServer,
  animKey,
}: {
  activeUser: UserId | null;
  activeServer: string | null;
  animKey: number;
}) {
  const uid = useId().replace(/:/g, '');
  const glowFilterId = `lb-glow-${uid}`;
  const arrowEndId = `lb-arrow-${uid}`;
  const uIdx = activeUser ? USERS.indexOf(activeUser) : -1;
  const sIdx = activeServer ? ['A', 'B', 'C'].indexOf(activeServer) : -1;
  const uY = [15, 50, 85];
  const sY = [15, 50, 85];

  const dim = 'stroke-zinc-500/30';
  const hi = 'stroke-sky-400/95';
  const dimW = 1;
  const hiW = 2.4;

  const hop1Id = `lb-hop1-${animKey}-${uid}`;
  const showPacket = uIdx >= 0 && sIdx >= 0 && activeUser && activeServer;

  return (
    <svg
      className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      aria-hidden
    >
      <defs>
        <filter id={glowFilterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker
          id={arrowEndId}
          markerWidth="5"
          markerHeight="5"
          refX="4.2"
          refY="2.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0 0 L5 2.5 L0 5 Z" fill="#38bdf8" fillOpacity={0.95} />
        </marker>
      </defs>

      {/* Row labels: which client / which server (aligned to wires) */}
      {USERS.map((label, i) => (
        <text
          key={`ulab-${label}`}
          x={lx - 1}
          y={uY[i]! + 3.2}
          textAnchor="end"
          fill="#a1a1aa"
          style={{ fontSize: '5.5px', fontWeight: 700 }}
        >
          {label}
        </text>
      ))}
      {(['A', 'B', 'C'] as const).map((label, i) => (
        <text
          key={`slab-${label}`}
          x={rx + 1}
          y={sY[i]! + 3.2}
          textAnchor="start"
          fill="#a1a1aa"
          style={{ fontSize: '5.5px', fontWeight: 700 }}
        >
          {label}
        </text>
      ))}

      {/* Idle: curved user → LB */}
      {uY.map((y, i) => (
        <path
          key={`ul-${i}`}
          d={pathUserToLb(y)}
          strokeWidth={uIdx === i ? hiW : dimW}
          strokeDasharray={uIdx === i ? 'none' : '3.5 5'}
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd={uIdx === i ? `url(#${arrowEndId})` : undefined}
          className={clsx(
            'transition-[stroke,stroke-width,opacity] duration-500 ease-out',
            uIdx === i ? hi : dim
          )}
        />
      ))}
      {/* Idle: curved LB → server */}
      {sY.map((y, i) => (
        <path
          key={`ls-${i}`}
          d={pathLbToServer(y)}
          strokeWidth={sIdx === i ? hiW : dimW}
          strokeDasharray={sIdx === i ? 'none' : '3.5 5'}
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd={sIdx === i ? `url(#${arrowEndId})` : undefined}
          className={clsx(
            'transition-[stroke,stroke-width,opacity] duration-500 ease-out',
            sIdx === i ? hi : dim
          )}
        />
      ))}

      {/* Packet: hop 1 (client → LB), then hop 2 (LB → server) */}
      {showPacket ? (
        <g key={animKey} filter={`url(#${glowFilterId})`}>
          <circle r="3.5" className="fill-amber-300 stroke-amber-500/80" strokeWidth={1}>
            <animateMotion
              id={hop1Id}
              dur="0.52s"
              repeatCount="1"
              fill="freeze"
              rotate="auto"
              calcMode="spline"
              keyTimes="0;1"
              keySplines="0.45 0.05 0.55 0.95"
              path={pathUserToLb(uY[uIdx]!)}
            />
            <animateMotion
              begin={`${hop1Id}.end`}
              dur="0.58s"
              repeatCount="1"
              fill="freeze"
              rotate="auto"
              calcMode="spline"
              keyTimes="0;1"
              keySplines="0.45 0.05 0.55 0.95"
              path={pathLbToServer(sY[sIdx]!)}
            />
          </circle>
        </g>
      ) : null}
    </svg>
  );
}

export function LoadBalancerSimulator() {
  const [algo, setAlgo] = useState<Algo>('RR');
  const rrRef = useRef(0);
  const playUserRef = useRef(0);
  const [servers, setServers] = useState<Server[]>(() => initialServers.map((s) => ({ ...s })));
  const serversRef = useRef(servers);
  serversRef.current = servers;

  const [totalRequests, setTotalRequests] = useState(0);
  const [latencySum, setLatencySum] = useState(0);
  const [lastTarget, setLastTarget] = useState<string | null>(null);
  const [lastUser, setLastUser] = useState<UserId | null>(null);
  const [playing, setPlaying] = useState(false);
  const playRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const healthyCount = servers.filter((s) => s.healthy).length;
  const avgLatency = totalRequests > 0 ? Math.round(latencySum / totalRequests) : 0;

  const sendRequest = useCallback((fromUser: UserId) => {
    const prev = serversRef.current;
    const healthy = prev.filter((s) => s.healthy);
    if (healthy.length === 0) return;

    let targetId: string;
    if (algo === 'RR') {
      const i = rrRef.current % healthy.length;
      targetId = healthy[i]!.id;
      rrRef.current += 1;
    } else {
      const min = Math.min(...healthy.map((s) => s.active));
      targetId = healthy.find((s) => s.active === min)!.id;
    }

    const latency = 12 + Math.floor(Math.random() * 8);
    setTotalRequests((t) => t + 1);
    setLatencySum((s) => s + latency);
    setLastTarget(targetId);
    setLastUser(fromUser);

    setServers((p) =>
      p.map((s) =>
        s.id === targetId ? { ...s, active: s.active + 1, totalReq: s.totalReq + 1 } : s
      )
    );

    window.setTimeout(() => {
      setServers((p) =>
        p.map((s) => (s.id === targetId ? { ...s, active: Math.max(0, s.active - 1) } : s))
      );
    }, 1280);
  }, [algo]);

  const reset = useCallback(() => {
    if (playRef.current) clearInterval(playRef.current);
    playRef.current = null;
    setPlaying(false);
    setServers(initialServers.map((s) => ({ ...s })));
    rrRef.current = 0;
    playUserRef.current = 0;
    setTotalRequests(0);
    setLatencySum(0);
    setLastTarget(null);
    setLastUser(null);
  }, []);

  const killOne = useCallback(() => {
    setServers((prev) => {
      const h = prev.filter((s) => s.healthy);
      if (h.length === 0) return prev;
      const victim = h[Math.floor(Math.random() * h.length)]!;
      return prev.map((s) => (s.id === victim.id ? { ...s, healthy: false, active: 0 } : s));
    });
  }, []);

  const togglePlay = useCallback(() => {
    if (playRef.current) {
      clearInterval(playRef.current);
      playRef.current = null;
      setPlaying(false);
      return;
    }
    setPlaying(true);
    playRef.current = setInterval(() => {
      const u = USERS[playUserRef.current % 3]!;
      playUserRef.current += 1;
      sendRequest(u);
    }, 500);
  }, [sendRequest]);

  useEffect(() => {
    return () => {
      if (playRef.current) clearInterval(playRef.current);
    };
  }, []);

  return (
    <div className="not-prose my-10 overflow-hidden rounded-xl border border-zinc-700/80 bg-[#1a1d23] shadow-2xl ring-1 ring-white/5">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-zinc-700/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-lg font-bold tracking-tight text-white">Load Balancer Simulator</h4>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg bg-zinc-800/90 p-0.5 ring-1 ring-zinc-600/80">
            {(['RR', 'LC'] as const).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => {
                  setAlgo(a);
                  rrRef.current = 0;
                }}
                className={clsx(
                  'rounded-md px-4 py-1.5 text-xs font-bold transition-all',
                  algo === a
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                )}
              >
                {a}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={togglePlay}
            className={clsx(
              'flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-600 bg-zinc-800 text-sm text-zinc-200 hover:bg-zinc-700',
              playing && 'border-amber-500/50 text-amber-300'
            )}
            title={playing ? 'Pause' : 'Play'}
          >
            {playing ? '⏸' : '▶'}
          </button>
          <button
            type="button"
            onClick={killOne}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-600 bg-zinc-800 text-sm hover:bg-zinc-700"
            title="Random server failure"
          >
            💀
          </button>
          <button
            type="button"
            onClick={reset}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-600 bg-zinc-800 text-sm hover:bg-zinc-700"
            title="Reset"
          >
            ↺
          </button>
        </div>
      </div>

      {/* Flow: every client can reach any backend via LB */}
      <div className="border-b border-zinc-700/60 bg-zinc-900/35 px-4 py-3">
        <p className="text-center text-[11px] leading-relaxed text-zinc-400 sm:text-left">
          <span className="font-semibold text-zinc-300">Flow:</span>{' '}
          <span className="text-violet-300">U1</span>, <span className="text-violet-300">U2</span>,{' '}
          <span className="text-violet-300">U3</span>
          <span className="text-zinc-600"> → </span>
          <span className="font-medium text-sky-400">LB</span>
          <span className="text-zinc-600"> → </span>
          <span className="text-emerald-300/90">any server</span>{' '}
          <span className="text-zinc-600">(A, B, or C)</span>
        </p>
        {lastUser && lastTarget ? (
          <p className="mt-2 text-center font-mono text-xs text-amber-200/95 sm:text-left">
            Last: <span className="text-violet-300">{lastUser}</span>
            <span className="text-zinc-500"> → </span>
            <span className="text-sky-400">LB</span>
            <span className="text-zinc-500"> → </span>
            <span className="text-emerald-300">Server {lastTarget}</span>
          </p>
        ) : (
          <p className="mt-2 text-center text-xs text-zinc-600 sm:text-left">
            Click U1–U3 or use Play — the LB picks a server (RR or LC).
          </p>
        )}
      </div>

      {/* 3-column visualization */}
      <div className="relative min-h-[320px] px-3 py-6 sm:min-h-[380px] sm:px-6">
        <ColumnFlowDiagram activeUser={lastUser} activeServer={lastTarget} animKey={totalRequests} />

        <div className="relative z-10 mb-3 hidden grid-cols-[minmax(0,1fr)_140px_minmax(0,1fr)] gap-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 sm:grid">
          <div className="pl-1">Clients</div>
          <div className="text-center">Through LB</div>
          <div className="pr-1 text-right">Backends</div>
        </div>

        <div className="relative z-10 grid min-h-[280px] grid-cols-1 gap-6 sm:min-h-[320px] sm:grid-cols-[minmax(0,1fr)_140px_minmax(0,1fr)] sm:gap-4">
          {/* Users */}
          <div className="flex flex-col justify-between gap-4 sm:py-2">
            {USERS.map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => sendRequest(u)}
                className={clsx(
                  'rounded-lg border px-4 py-3 text-left shadow-sm transition-all duration-300 ease-out active:scale-[0.98]',
                  lastUser === u
                    ? 'border-violet-400 bg-violet-500/20 ring-1 ring-violet-400/40'
                    : 'border-zinc-600 bg-zinc-800/80 hover:border-zinc-500'
                )}
              >
                <div className="text-lg font-bold text-white">{u}</div>
                <div className="text-xs text-zinc-500">→ LB → any server</div>
              </button>
            ))}
          </div>

          {/* LB (center) */}
          <div className="flex items-center justify-center sm:py-4">
            <div
              className={clsx(
                'w-full max-w-[140px] rounded-xl border-2 bg-zinc-800/50 px-4 py-6 text-center shadow-lg',
                lastTarget ? 'border-sky-400 shadow-sky-500/10' : 'border-sky-500/80'
              )}
            >
              <div className="text-xs font-bold uppercase tracking-wider text-sky-400">LB</div>
              <div className="mt-1 text-sm font-semibold leading-tight text-sky-100">Load Balancer</div>
              <div className="mt-2 text-[10px] leading-snug text-zinc-500">Routes U1–U3 to A, B, or C</div>
            </div>
          </div>

          {/* Servers */}
          <div className="flex flex-col justify-between gap-4 sm:py-2">
            {servers.map((s) => {
              const cpu = Math.min(99, s.baseCpu + s.active * 14 + Math.min(20, s.totalReq % 15));
              const warn = s.healthy && cpu >= 85;
              const down = !s.healthy;
              const isHit = lastTarget === s.id;

              return (
                <div
                  key={s.id}
                  className={clsx(
                    'rounded-lg border px-4 py-3 shadow-sm transition-all duration-300 ease-out',
                    down
                      ? 'border-rose-600/80 bg-rose-950/30'
                      : warn
                        ? 'border-amber-500/90 bg-amber-950/20'
                        : isHit
                          ? 'border-sky-500 bg-sky-950/30'
                          : 'border-emerald-600/50 bg-zinc-800/80'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white">Server {s.id}</span>
                    <span
                      className={clsx(
                        'rounded px-2 py-0.5 text-[10px] font-bold uppercase',
                        down && 'bg-rose-500/30 text-rose-200',
                        !down && warn && 'bg-amber-500/30 text-amber-200',
                        !down && !warn && 'bg-emerald-500/20 text-emerald-300'
                      )}
                    >
                      {down ? 'DOWN' : warn ? 'WARN' : 'OK'}
                    </span>
                  </div>
                  <div className="mt-2 space-y-2 text-xs text-zinc-400">
                    <div className="flex justify-between text-[11px]">
                      <span>CPU</span>
                      <span className="font-mono text-zinc-200">{cpu}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-900">
                      <div
                        className={clsx(
                          'h-full rounded-full transition-[width,background-color] duration-500 ease-out',
                          down && 'bg-rose-500',
                          !down && warn && 'bg-gradient-to-r from-amber-500 to-red-500',
                          !down && !warn && 'bg-emerald-500'
                        )}
                        style={{ width: `${cpu}%` }}
                      />
                    </div>
                    <div className="flex justify-between">
                      <span>Req</span>
                      <span className="font-mono text-zinc-200">{s.totalReq}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer metrics */}
      <div className="grid grid-cols-2 border-t border-zinc-700/80 bg-zinc-900/50 sm:grid-cols-4">
        <div className="border-b border-zinc-700/60 px-3 py-4 text-center sm:border-b-0 sm:border-r">
          <div className="text-2xl font-bold text-sky-400">{totalRequests}</div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Total Requests</div>
        </div>
        <div className="border-b border-zinc-700/60 px-3 py-4 text-center sm:border-b-0 sm:border-r">
          <div className="text-2xl font-bold text-white">{avgLatency}ms</div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Avg Latency</div>
        </div>
        <div className="border-r border-zinc-700/60 px-3 py-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">
            {healthyCount}/{servers.length}
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Healthy Servers</div>
        </div>
        <div className="px-3 py-4 text-center">
          <div className="text-2xl font-bold text-sky-400">{algo}</div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">{ALGO_LABEL[algo]}</div>
        </div>
      </div>

      <p className="border-t border-zinc-700/80 px-4 py-2.5 text-center text-[10px] text-zinc-500">
        U1–U3 → LB → any server · RR = Round Robin · LC = Least Connections · WARN when CPU ≥ 85%
      </p>
    </div>
  );
}
