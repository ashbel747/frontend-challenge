"use client";
import React, { useState, useEffect, useMemo } from "react";
import BarChart from "./BarChart";
import { fetchClusters, fetchNamespaces, fetchPods } from "../hooks/ApiData";

export default function ContentArea() {
  const [view, setView] = useState<"clusters" | "namespaces" | "pods">("clusters");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<{ name: string; view: any; id: any }[]>([]);
  
  // Async States
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        let result = [];
        if (view === "clusters") {
          result = await fetchClusters();
        } else if (view === "namespaces" && selectedId) {
          result = await fetchNamespaces(selectedId);
        } else if (view === "pods" && selectedId) {
          result = await fetchPods(selectedId);
        }
        setData(result);
      } catch (err) {
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [view, selectedId]);

  const handleDrillDown = (id: string, name: string) => {
    if (view === "clusters") {
      setHistory([{ name: "Clusters", view: "clusters", id: null }]);
      setSelectedId(id);
      setView("namespaces");
    } else if (view === "namespaces") {
      setHistory(prev => [...prev, { name: "Namespaces", view: "namespaces", id: selectedId }]);
      setSelectedId(id);
      setView("pods");
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
            <button onClick={resetView} className="hover:underline text-purple-600 font-medium">Home</button>
            {history.map((h, i) => (
              <span key={i}>/ {h.name}</span>
            ))}
          </nav>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white capitalize">
            {view} Cost Breakdown
          </h1>
        </div>
      </header>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 min-h-[400px] flex flex-col">
        <div className="h-1.5 w-full bg-linear-to-r from-purple-500 to-indigo-600" />

        {loading ? (
          <div className="flex-1 flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center p-20 text-red-500 text-center">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="ml-4 underline">Retry</button>
          </div>
        ) : (
          <>
            <BarChart data={data} onBarClick={(id: string) => {
              const item = data.find(d => d.id === id);
              handleDrillDown(id, item?.name);
            }} />

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <th className="px-6 py-5 text-sm font-bold text-zinc-400 uppercase tracking-wider">{view.slice(0, -1)} Name</th>
                    <th className="px-4 py-5 text-sm font-bold text-zinc-600 dark:text-zinc-300">CPU</th>
                    <th className="px-4 py-5 text-sm font-bold text-zinc-600 dark:text-zinc-300">RAM</th>
                    <th className="px-4 py-5 text-sm font-bold text-zinc-600 dark:text-zinc-300 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {data.map((row) => (
                    <tr 
                      key={row.id} 
                      onClick={() => handleDrillDown(row.id, row.name)} 
                      className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="px-6 py-5 font-bold text-zinc-800 dark:text-zinc-100">{row.name}</td>
                      <td className="px-4 py-5 text-zinc-500">${row.cpu.toLocaleString()}</td>
                      <td className="px-4 py-5 text-zinc-500">${row.ram.toLocaleString()}</td>
                      <td className="px-6 py-5 text-right font-bold text-zinc-900 dark:text-purple-400">
                        ${row.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}