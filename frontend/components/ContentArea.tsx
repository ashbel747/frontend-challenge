"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { fetchClusters, fetchNamespaces, fetchPods } from "../hooks/ApiData";

// Types
interface DataItem {
  id: string;
  name: string;
  cpu: number;
  ram: number;
  total: number;
}

interface HistoryItem {
  name: string;
  view: "clusters" | "namespaces" | "pods";
  id: string | null;
}

// Animated Counter Component
const AnimatedNumber = ({ value, prefix = "$" }: { value: number; prefix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const nodeRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();
    const startValue = displayValue;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(startValue + (value - startValue) * easeOutQuart);
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span ref={nodeRef} className="tabular-nums">
      {prefix}{displayValue.toLocaleString()}
    </span>
  );
};

// Particle burst effect for drill-down
const ParticleBurst = ({ x, y, color }: { x: number; y: number; color: string }) => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i * 30) * (Math.PI / 180),
    distance: 50 + Math.random() * 100,
  }));

  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
          animate={{
            x: Math.cos(p.angle) * p.distance,
            y: Math.sin(p.angle) * p.distance,
            scale: 0,
            opacity: 0,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

// 3D Glassmorphic Bar Component
const GlassBar = ({ 
  item, 
  index, 
  maxValue, 
  onClick, 
  isDrilling 
}: { 
  item: DataItem; 
  index: number; 
  maxValue: number; 
  onClick: () => void;
  isDrilling: boolean;
}) => {
  const height = (item.total / maxValue) * 300;
  const [isHovered, setIsHovered] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [particlePos, setParticlePos] = useState({ x: 0, y: 0 });
  
  const barRef = useRef<HTMLDivElement>(null);
  
  const handleClick = (e: React.MouseEvent) => {
    if (barRef.current) {
      const rect = barRef.current.getBoundingClientRect();
      setParticlePos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 1000);
    }
    onClick();
  };

  return (
    <>
      {showParticles && (
        <ParticleBurst 
          x={particlePos.x} 
          y={particlePos.y} 
          color="#a855f7" 
        />
      )}
      <motion.div
        ref={barRef}
        className="relative flex flex-col items-center justify-end cursor-pointer group"
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ 
          opacity: isDrilling ? 0 : 1, 
          y: isDrilling ? -100 : 0, 
          scale: isDrilling ? 0.5 : 1 
        }}
        transition={{ 
          duration: 0.6, 
          delay: index * 0.1,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        style={{ height: height + 60 }}
      >
        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute -top-16 z-20 bg-zinc-900 text-white px-4 py-2 rounded-lg shadow-2xl whitespace-nowrap border border-zinc-700"
            >
              <div className="text-xs text-zinc-400 uppercase tracking-wider">{item.name}</div>
              <div className="text-lg font-bold text-purple-400">${item.total.toLocaleString()}</div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-zinc-900 border-r border-b border-zinc-700"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Bar */}
        <motion.div
          className="relative w-16 sm:w-20 overflow-hidden rounded-t-2xl backdrop-blur-md"
          style={{
            height: height,
            background: "linear-gradient(180deg, rgba(168, 85, 247, 0.3) 0%, rgba(147, 51, 234, 0.6) 100%)",
            boxShadow: "0 8px 32px rgba(168, 85, 247, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            border: "1px solid rgba(168, 85, 234, 0.4)",
            borderBottom: "none",
          }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 20px 60px rgba(168, 85, 247, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Liquid fill effect */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900 via-purple-600 to-purple-400"
            initial={{ height: "0%" }}
            animate={{ height: "100%" }}
            transition={{ 
              duration: 1.2, 
              delay: index * 0.15 + 0.3,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Bubbles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full opacity-30"
                  style={{ left: `${20 + i * 30}%`, bottom: -10 }}
                  animate={{ 
                    y: [-20, -height - 20],
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{ 
                    duration: 2 + i * 0.5, 
                    repeat: Infinity, 
                    delay: i * 0.8,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Glass reflection */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white to-transparent opacity-10 rounded-t-2xl pointer-events-none" />
          
          {/* Side highlights for 3D effect */}
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-white to-transparent opacity-20 rounded-tl-2xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-purple-300 to-transparent opacity-10 rounded-tr-2xl pointer-events-none" />
        </motion.div>

        {/* Label */}
        <motion.div 
          className="mt-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 max-w-[80px] truncate text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.5 }}
        >
          {item.name}
        </motion.div>
      </motion.div>
    </>
  );
};

// Main Chart Component
const AnimatedBarChart = ({ 
  data, 
  onBarClick, 
  isDrilling 
}: { 
  data: DataItem[]; 
  onBarClick: (id: string) => void;
  isDrilling: boolean;
}) => {
  const maxValue = Math.max(...data.map(d => d.total), 1);
  
  return (
    <div className="relative h-[400px] w-full flex items-end justify-center gap-4 sm:gap-8 px-8 pb-8 overflow-hidden">
      {/* Grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        {[0, 25, 50, 75, 100].map((percent) => (
          <div
            key={percent}
            className="absolute w-full border-t border-zinc-200 dark:border-zinc-800"
            style={{ bottom: `${percent}%` }}
          >
            <span className="absolute -top-3 left-2 text-xs text-zinc-400">
              ${Math.round((maxValue * percent) / 100).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Bars */}
      <AnimatePresence mode="wait">
        {!isDrilling && data.map((item, index) => (
          <GlassBar
            key={item.id}
            item={item}
            index={index}
            maxValue={maxValue}
            onClick={() => onBarClick(item.id)}
            isDrilling={isDrilling}
          />
        ))}
      </AnimatePresence>

      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-32 bg-purple-500 opacity-10 blur-3xl pointer-events-none" />
    </div>
  );
};

// Table Row Component with staggered animation
const AnimatedTableRow = ({ 
  row, 
  index, 
  onClick, 
  view 
}: { 
  row: DataItem; 
  index: number; 
  onClick: () => void;
  view: string;
}) => {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -50, skewX: -10 }}
      animate={{ opacity: 1, x: 0, skewX: 0 }}
      exit={{ opacity: 0, x: 50, skewX: 10 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08,
        type: "spring",
        stiffness: 100
      }}
      onClick={onClick}
      className="cursor-pointer group relative overflow-hidden"
      whileHover={{ 
        backgroundColor: "rgba(168, 85, 247, 0.05)",
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
    >
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
      />
      
      <td className="px-6 py-5 font-bold text-zinc-800 dark:text-zinc-100 relative z-10">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-2 h-2 rounded-full bg-purple-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.08 + 0.3, type: "spring" }}
          />
          <span className="group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {row.name}
          </span>
        </div>
      </td>
      <td className="px-4 py-5 text-zinc-500 relative z-10">
        <AnimatedNumber value={row.cpu} />
      </td>
      <td className="px-4 py-5 text-zinc-500 relative z-10">
        <AnimatedNumber value={row.ram} />
      </td>
      <td className="px-6 py-5 text-right font-bold text-zinc-900 dark:text-purple-400 relative z-10">
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.08 + 0.4, type: "spring", stiffness: 200 }}
        >
          <AnimatedNumber value={row.total} />
        </motion.span>
      </td>
    </motion.tr>
  );
};

// Background ambient component
const AmbientBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <motion.div
      className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-500/5 rounded-full blur-3xl"
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 90, 0],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-indigo-500/5 rounded-full blur-3xl"
      animate={{
        scale: [1.2, 1, 1.2],
        rotate: [0, -90, 0],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

export default function ContentArea() {
  const [view, setView] = useState<"clusters" | "namespaces" | "pods">("clusters");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isDrilling, setIsDrilling] = useState(false);
  
  // Async States
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        let result: DataItem[] = [];
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
    if (view === "pods") return; // Can't drill down further
    
    setIsDrilling(true);
    
    // Wait for exit animations
    setTimeout(() => {
      if (view === "clusters") {
        setHistory([{ name: "Clusters", view: "clusters", id: null }]);
        setSelectedId(id);
        setView("namespaces");
      } else if (view === "namespaces") {
        setHistory(prev => [...prev, { name: "Namespaces", view: "namespaces", id: selectedId }]);
        setSelectedId(id);
        setView("pods");
      }
      setIsDrilling(false);
    }, 600);
  };

  const resetView = () => {
    setIsDrilling(true);
    setTimeout(() => {
      setView("clusters");
      setSelectedId(null);
      setHistory([]);
      setIsDrilling(false);
    }, 600);
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === history.length - 1) return;
    setIsDrilling(true);
    setTimeout(() => {
      const newHistory = history.slice(0, index + 1);
      setHistory(newHistory);
      const target = newHistory[newHistory.length - 1];
      setView(target.view);
      setSelectedId(target.id);
      setIsDrilling(false);
    }, 600);
  };

  return (
    <div className="relative min-h-screen bg-zinc-100 dark:bg-zinc-950">
      <AmbientBackground />
      
      <main className="relative z-10 p-6 min-h-screen pt-24">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
              <motion.button 
                onClick={resetView} 
                className="hover:underline text-purple-600 font-medium relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Home
                <motion.span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"
                />
              </motion.button>
              {history.map((h, i) => (
                <React.Fragment key={i}>
                  <span className="text-zinc-400">/</span>
                  <motion.button
                    onClick={() => handleBreadcrumbClick(i)}
                    className="hover:underline hover:text-purple-600 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {h.name}
                  </motion.button>
                </React.Fragment>
              ))}
            </nav>
            <motion.h1 
              className="text-3xl font-bold text-zinc-900 dark:text-white capitalize"
              key={view}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {view} Cost Breakdown
            </motion.h1>
          </div>
        </header>

        <motion.div 
          className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur-xl shadow-2xl dark:border-zinc-800 dark:bg-zinc-900/80 min-h-[400px] flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Gradient header bar */}
          <motion.div 
            className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {loading ? (
            <div className="flex-1 flex items-center justify-center p-20">
              <motion.div 
                className="relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full" />
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-400"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
          ) : error ? (
            <motion.div 
              className="flex-1 flex flex-col items-center justify-center p-20 text-red-500 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-4xl mb-4"
              >
                ⚠️
              </motion.div>
              <p className="text-lg mb-4">{error}</p>
              <motion.button 
                onClick={() => window.location.reload()} 
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Retry
              </motion.button>
            </motion.div>
          ) : (
            <>
              <AnimatedBarChart 
                data={data} 
                onBarClick={(id: string) => {
                  const item = data.find(d => d.id === id);
                  if (item) handleDrillDown(id, item.name);
                }}
                isDrilling={isDrilling}
              />

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-sm">
                      <th className="px-6 py-5 text-sm font-bold text-zinc-400 uppercase tracking-wider">
                        {view.slice(0, -1)} Name
                      </th>
                      <th className="px-4 py-5 text-sm font-bold text-zinc-600 dark:text-zinc-300">CPU</th>
                      <th className="px-4 py-5 text-sm font-bold text-zinc-600 dark:text-zinc-300">RAM</th>
                      <th className="px-4 py-5 text-sm font-bold text-zinc-600 dark:text-zinc-300 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    <AnimatePresence mode="wait">
                      {!isDrilling && data.map((row, index) => (
                        <AnimatedTableRow
                          key={row.id}
                          row={row}
                          index={index}
                          view={view}
                          onClick={() => handleDrillDown(row.id, row.name)}
                        />
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}