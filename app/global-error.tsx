"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="vi">
      <body className="bg-[#06090F] text-slate-200">
        <main className="flex min-h-screen items-center justify-center px-6 text-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-rose-400">SenseCore unavailable</p>
            <h1 className="mt-3 text-2xl font-bold">Ứng dụng gặp lỗi nghiêm trọng</h1>
            <button onClick={() => reset()} className="mt-5 rounded-lg border border-cyan-500/40 px-4 py-2 text-sm text-cyan-300">Tải lại</button>
          </div>
        </main>
      </body>
    </html>
  );
}
