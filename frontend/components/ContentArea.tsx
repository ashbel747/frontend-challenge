import React from "react";

export default function ContentArea() {

    const CLUSTER_DATA = [
        { name: "Cluster A", cpu: 2463, ram: 1368, storage: 246, network: 307, gpu: 821, efficiency: "10%", total: 6867 },
        { name: "Cluster B", cpu: 2127, ram: 1181, storage: 212, network: 265, gpu: 0, efficiency: "28%", total: 5574 },
        { name: "Cluster C", cpu: 1702, ram: 945, storage: 170, network: 212, gpu: 567, efficiency: "15%", total: 4580 },
        { name: "Cluster D", cpu: 1057, ram: 587, storage: 105, network: 132, gpu: 0, efficiency: "43%", total: 2209 },
    ];

  return (
    <main className="p-6 bg-zinc-100 dark:bg-zinc-950 min-h-screen pt-24">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Cloud Infrastructure Costs
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          Monthly breakdown of resource allocation per cluster.
        </p>
      </header>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {/* Brand Accent Bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-purple-500 to-indigo-600" />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-6 py-5 text-sm font-bold text-zinc-400 uppercase tracking-wider"></th>
                <th className="px-4 py-5 text-sm font-bold text-zinc-600 dark:text-zinc-300">CPU</th>
                <th className="px-4 py-5 text-sm font-bold text-zinc-600 dark:text-zinc-300">RAM</th>
                <th className="px-4 py-5 text-sm font-bold text-zinc-600 dark:text-zinc-300">Storage</th>
                <th className="px-4 py-5 text-sm font-bold text-zinc-600 dark:text-zinc-300">Network</th>
                <th className="px-4 py-5 text-sm font-bold text-zinc-600 dark:text-zinc-300">GPU</th>
                <th className="px-4 py-5 text-sm font-bold text-zinc-600 dark:text-zinc-300">Efficiency</th>
                <th className="px-6 py-5 text-sm font-bold text-zinc-900 dark:text-white text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {CLUSTER_DATA.map((row, index) => (
                <tr key={index} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="px-6 py-5 text-lg font-bold text-zinc-800 dark:text-zinc-100">
                    {row.name}
                  </td>
                  <td className="px-4 py-5 text-zinc-500 dark:text-zinc-400">
                    ${row.cpu.toLocaleString()}
                  </td>
                  <td className="px-4 py-5 text-zinc-500 dark:text-zinc-400">
                    ${row.ram.toLocaleString()}
                  </td>
                  <td className="px-4 py-5 text-zinc-500 dark:text-zinc-400">
                    ${row.storage.toLocaleString()}
                  </td>
                  <td className="px-4 py-5 text-zinc-500 dark:text-zinc-400">
                    ${row.network.toLocaleString()}
                  </td>
                  <td className="px-4 py-5 text-zinc-500 dark:text-zinc-400">
                    ${row.gpu.toLocaleString()}
                  </td>
                  <td className="px-4 py-5 text-zinc-500 dark:text-zinc-400">
                    {row.efficiency}
                  </td>
                  <td className="px-6 py-5 text-right font-bold text-zinc-900 dark:text-purple-400 text-lg">
                    ${row.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}