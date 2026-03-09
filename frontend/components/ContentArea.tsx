"use client";
import React, { useState, useMemo } from "react";
import BarChart from "./BarChart";

// Hierarchical Data
const MOCK_DATA = {
  clusters: [
    { id: "c1", name: "Cluster A", cpu: 2463, ram: 1368, storage: 246, network: 307, gpu: 821, efficiency: "10%", total: 6867 },
    { id: "c2", name: "Cluster B", cpu: 2127, ram: 1181, storage: 212, network: 265, gpu: 0, efficiency: "28%", total: 5574 },
  ],
  namespaces: {
    c1: [
      { id: "n1", name: "Namespace A1", cpu: 1200, ram: 600, storage: 100, network: 150, gpu: 400, efficiency: "15%", total: 2450 },
      { id: "n2", name: "Namespace A2", cpu: 1263, ram: 768, storage: 146, network: 157, gpu: 421, efficiency: "12%", total: 4417 },
    ],
  },
  pods: {
    n1: [
      { id: "p1", name: "Pod A", cpu: 862, ram: 479, storage: 86, network: 107, gpu: 410, efficiency: "8%", total: 2403 },
      { id: "p2", name: "Pod B", cpu: 246, ram: 136, storage: 24, network: 30, gpu: 246, efficiency: "40%", total: 686 },
      { id: "p3", name: "Pod C", cpu: 86, ram: 47, storage: 8, network: 10, gpu: 123, efficiency: "35%", total: 240 },
    ]
  }
};

export default function ContentArea() {
  const [view, setView] = useState<"clusters" | "namespaces" | "pods">("clusters");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  // Calculate current data based on view
  const currentData = useMemo(() => {
    if (view === "clusters") return MOCK_DATA.clusters;
    if (view === "namespaces" && selectedId) return MOCK_DATA.namespaces[selectedId as keyof typeof MOCK_DATA.namespaces] || [];
    if (view === "pods" && selectedId) return MOCK_DATA.pods[selectedId as keyof typeof MOCK_DATA.pods] || [];
    return [];
  }, [view, selectedId]);

  const handleDrillDown = (id: string) => {
    if (view === "clusters") {
      setSelectedId(id);
      setView("namespaces");
      setHistory(["Clusters"]);
    } else if (view === "namespaces") {
      setSelectedId(id);
      setView("pods");
      setHistory(["Clusters", "Namespaces"]);
    }
  };

  const resetView = () => {
    setView("clusters");
    setSelectedId(null);
    setHistory([]);
  };

  return (
    <main className="p-6 bg-zinc-100 dark:bg-zinc-950 min-h-screen pt-24">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
             <button onClick={resetView} className="hover:underline">Home</button>
             {history.map(h => <span key={h}>/ {h}</span>)}
          </nav>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white capitalize">
            {view} Cost Breakdown
          </h1>
        </div>
        <div className="flex gap-2">
            <div className="bg-emerald-500 text-white px-3 py-1 rounded text-sm font-bold">
                Aggregated by: {view.slice(0, -1)}
            </div>
        </div>
      </header>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="h-1.5 w-full bg-linear-to-r from-purple-500 to-indigo-600" />

        {/* Bar Chart gets the drill function */}
        <BarChart data={currentData} onBarClick={handleDrillDown} />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                <th className="px-6 py-5 text-sm font-bold text-zinc-400 uppercase tracking-wider">{view.slice(0,-1)} Name</th>
                <th className="px-4 py-5 text-sm font-bold text-zinc-600 dark:text-zinc-300">CPU</th>
                <th className="px-4 py-5 text-sm font-bold text-zinc-600 dark:text-zinc-300">RAM</th>
                <th className="px-4 py-5 text-sm font-bold text-zinc-600 dark:text-zinc-300">Storage</th>
                <th className="px-4 py-5 text-sm font-bold text-zinc-600 dark:text-zinc-300 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {currentData.map((row) => (
                <tr key={row.id} onClick={() => handleDrillDown(row.id)} className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="px-6 py-5 font-bold text-zinc-800 dark:text-zinc-100">{row.name}</td>
                  <td className="px-4 py-5 text-zinc-500">${row.cpu.toLocaleString()}</td>
                  <td className="px-4 py-5 text-zinc-500">${row.ram.toLocaleString()}</td>
                  <td className="px-4 py-5 text-zinc-500">${row.storage.toLocaleString()}</td>
                  <td className="px-6 py-5 text-right font-bold text-zinc-900 dark:text-purple-400">
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