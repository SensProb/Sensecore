import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-[#182328] px-3 py-2 text-sm text-slate-200 transition hover:border-cyan/60 hover:text-cyan disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />;
}
