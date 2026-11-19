import { useEffect, useState } from "react";

export default function App() {
  const [health, setHealth] = useState({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    fetch("api/health", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("HTTP ${res.status}");
        return res.json();
      })
      .then((data) => setHealth({ status: "ok", data }))
      .catch((err) => {
        if (err.name !== "AbortError") {
          setHealth({ status: "error", message: err.message });
        }
      });
    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50">
      <h1 className="text-4xl font-bold text-slate-900">MneMo</h1>
      <p className="text-slate-600">
        API: {health.status === "ok" && JSON.stringify(health.data)}
        {health.status === "loading" && "verifica in corso…"}
        {health.status === "error" && `non raggiungibile (${health.message})`}
      </p>
    </main>
  );
}
