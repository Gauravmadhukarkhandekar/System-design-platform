type Props = {
  headers: [string, string, string];
  rows: [string, string, string][];
};

export function ComparisonTable({ headers, rows }: Props) {
  return (
    <div className="not-prose my-8 overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full min-w-[32rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-sky-100/80 dark:bg-sky-900/35">
            {headers.map((h) => (
              <th
                key={h}
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground first:rounded-tl-xl last:rounded-tr-xl"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-border/60 last:border-b-0 odd:bg-background even:bg-muted/40"
            >
              <th
                scope="row"
                className="px-4 py-3 text-left font-semibold text-foreground align-top"
              >
                {row[0]}
              </th>
              <td className="px-4 py-3 text-muted-foreground align-top">{row[1]}</td>
              <td className="px-4 py-3 text-muted-foreground align-top">{row[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
