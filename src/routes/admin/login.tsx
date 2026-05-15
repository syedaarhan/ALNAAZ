import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock, User, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Small delay to allow loading state to paint and avoid INP blocking
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (id === "alnaaz" && password === "alnaaz@kgf") {
      localStorage.setItem("alnaaz_auth", "true");
      navigate({ to: "/admin" });
    } else {
      setError("Invalid credentials. Access denied.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="mt-6 font-display text-3xl">Royal Concierge</h1>
          <p className="mt-2 text-sm text-muted-foreground">Admin Access for Al Naaz Management</p>
        </div>

        <form onSubmit={handleLogin} className="mt-10 glass-strong rounded-3xl p-8 luxury-shadow">
          {error && (
            <div className="mb-6 rounded-xl bg-red-500/10 p-3 text-center text-xs text-red-500 border border-red-500/20">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Staff ID
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                <input
                  type="text"
                  required
                  disabled={isLoading}
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full rounded-full bg-background/50 border border-border py-3 pl-12 pr-4 text-sm outline-none focus:border-primary transition-all disabled:opacity-50"
                  placeholder="Enter ID"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Security Key
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                <input
                  type="password"
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-full bg-background/50 border border-border py-3 pl-12 pr-4 text-sm outline-none focus:border-primary transition-all disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "group mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-primary py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:gold-glow disabled:opacity-70 disabled:cursor-not-allowed",
              isLoading && "animate-pulse",
            )}
          >
            {isLoading ? <>Authenticating...</> : <>Authenticate ✦</>}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Authorized personnel only. All access attempts are logged.
        </p>
      </div>
    </div>
  );
}
