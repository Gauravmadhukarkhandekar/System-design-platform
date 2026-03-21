'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Car = { id: number; lane: number; pos: number };

export function LatencyThroughputSimulator() {
  const [lanes, setLanes] = useState(2);
  const [speedPct, setSpeedPct] = useState(50);
  const [trafficPct, setTrafficPct] = useState(30);
  const [running, setRunning] = useState(false);
  const [avgLatency, setAvgLatency] = useState(40);
  const [throughput, setThroughput] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [cars, setCars] = useState<Car[]>([]);

  const nextId = useRef(0);
  const tickRef = useRef(0);
  const latencySumRef = useRef(0);
  const latencyCountRef = useRef(0);
  const completedRef = useRef(0);

  const reset = useCallback(() => {
    setRunning(false);
    setCars([]);
    setCompleted(0);
    setThroughput(0);
    setAvgLatency(40);
    latencySumRef.current = 0;
    latencyCountRef.current = 0;
    tickRef.current = 0;
    completedRef.current = 0;
    nextId.current = 0;
  }, []);

  useEffect(() => {
    if (!running) return;

    const interval = window.setInterval(() => {
      tickRef.current += 1;
      const speedFactor = speedPct / 100;
      const trafficFactor = trafficPct / 100;
      const congestion = 1 + trafficFactor * (12 / Math.max(lanes, 1));
      const movePerTick = 2.5 * speedFactor;
      const spawnChance = 0.12 + trafficFactor * 0.38;

      setCars((prev) => {
        let next = [...prev];

        next = next
          .map((car) => {
            const newPos = car.pos + movePerTick / congestion;
            if (newPos >= 100) {
              const tripTicks = Math.max(1, Math.ceil(100 / (movePerTick / congestion)));
              const simulatedMs = Math.round(20 + tripTicks * 8 * congestion / speedFactor);
              latencySumRef.current += simulatedMs;
              latencyCountRef.current += 1;
              completedRef.current += 1;
              return { ...car, pos: 100 };
            }
            return { ...car, pos: newPos };
          })
          .filter((c) => c.pos < 100);

        if (Math.random() < spawnChance && next.length < lanes * 5) {
          const laneCounts = Array.from({ length: lanes }, (_, i) => next.filter((c) => c.lane === i).length);
          const minLane = laneCounts.indexOf(Math.min(...laneCounts));
          next = [...next, { id: nextId.current++, lane: minLane, pos: 0 }];
        }

        return next;
      });

      if (latencyCountRef.current > 0) {
        setAvgLatency(Math.round(latencySumRef.current / latencyCountRef.current));
      }
      setCompleted(completedRef.current);
      const elapsedSec = tickRef.current * 0.1;
      setThroughput(Math.round((completedRef.current * 60) / Math.max(elapsedSec, 0.1)));
    }, 100);

    return () => window.clearInterval(interval);
  }, [running, lanes, speedPct, trafficPct]);

  return (
    <div className="not-prose my-8 rounded-xl border border-border bg-muted/30 p-4 sm:p-6">
      <h3 className="mb-1 text-lg font-semibold text-foreground">Latency vs Throughput Simulator</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Highway analogy: cars = requests, lanes = servers. Adjust sliders and click Start.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => (running ? setRunning(false) : setRunning(true))}
          className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600"
        >
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Reset
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-foreground">Lanes (servers)</span>
          <input
            type="range"
            min={1}
            max={8}
            value={lanes}
            disabled={running}
            onChange={(e) => setLanes(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-muted-foreground">{lanes}</span>
          <p className="mt-1 text-xs text-muted-foreground">More lanes = higher throughput (horizontal scaling)</p>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-foreground">Car speed (CPU power)</span>
          <input
            type="range"
            min={25}
            max={100}
            value={speedPct}
            disabled={running}
            onChange={(e) => setSpeedPct(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-muted-foreground">{speedPct}%</span>
          <p className="mt-1 text-xs text-muted-foreground">Higher speed = lower latency and more throughput</p>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-foreground">Traffic (load)</span>
          <input
            type="range"
            min={10}
            max={100}
            value={trafficPct}
            disabled={running}
            onChange={(e) => setTrafficPct(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-muted-foreground">{trafficPct}%</span>
          <p className="mt-1 text-xs text-muted-foreground">High traffic can cause congestion and latency spikes</p>
        </label>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 rounded-lg border border-border bg-background/80 p-4 font-mono text-sm">
        <div>
          <span className="text-muted-foreground">Avg latency (sim)</span>
          <div className="text-lg font-semibold text-foreground">{avgLatency}ms</div>
        </div>
        <div>
          <span className="text-muted-foreground">Throughput / min</span>
          <div className="text-lg font-semibold text-foreground">{throughput}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Completed</span>
          <div className="text-lg font-semibold text-foreground">{completed}</div>
        </div>
        <div>
          <span className="text-muted-foreground">In transit</span>
          <div className="text-lg font-semibold text-foreground">{cars.length}</div>
        </div>
      </div>

      <div className="relative h-32 overflow-hidden rounded-lg border border-border bg-sky-100/50 dark:bg-sky-950/40">
        <div className="absolute left-2 top-2 z-10 text-xs text-muted-foreground">START</div>
        <div className="absolute right-2 top-2 z-10 text-xs text-muted-foreground">END</div>
        {Array.from({ length: lanes }).map((_, laneIdx) => (
          <div
            key={laneIdx}
            className="absolute left-0 right-0 flex items-center border-b border-dashed border-border/40"
            style={{ top: `${((laneIdx + 0.5) / lanes) * 100}%`, height: `${100 / lanes}%`, transform: 'translateY(-50%)' }}
          >
            {cars
              .filter((c) => c.lane === laneIdx)
              .map((car) => (
                <span
                  key={car.id}
                  className="absolute text-lg leading-none"
                  style={{ left: `clamp(0%, calc(${car.pos}% - 10px), calc(100% - 20px))` }}
                  aria-hidden
                >
                  🚗
                </span>
              ))}
          </div>
        ))}
      </div>

      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        <li className="flex gap-2"><span className="text-green-600 dark:text-green-400">+</span> More lanes = more throughput (horizontal scaling)</li>
        <li className="flex gap-2"><span className="text-green-600 dark:text-green-400">+</span> Faster cars = lower latency and higher throughput</li>
        <li className="flex gap-2"><span className="text-amber-600 dark:text-amber-400">!</span> Too much traffic = congestion = latency spikes</li>
        <li className="flex gap-2"><span className="text-red-600 dark:text-red-400">×</span> More lanes alone do not always lower latency — speed matters</li>
      </ul>
    </div>
  );
}
