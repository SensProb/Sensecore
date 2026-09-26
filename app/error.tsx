"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#06090F] px-6 text-slate-200">
      <section className="glass-card w-full max-w-md rounded-2xl p-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-rose-400">Dashboard error</p>
        <h1 className="mt-3 text-xl font-bold">Không thể tải khu vực này</h1>
        <p className="mt-2 text-sm text-slate-400">Kết nối hoặc dữ liệu dashboard gặp sự cố tạm thời.</p>
        <button onClick={() => reset()} className="mt-5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-500/20">Thử lại</button>
      </section>
    </main>
  );
}
