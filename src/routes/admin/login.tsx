import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getSupabaseClient } from "@/integrations/supabase/client";
import { BrandMark } from "@/components/manul/BrandMark";
import { Button } from "@/components/ui/button";

const title = "Admin Sign In — ManulCoffee";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: "Sign in to the ManulCoffee admin area." },
      { property: "og:title", content: title },
      { property: "og:description", content: "Sign in to the ManulCoffee admin area." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLoginPage,
});

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function AdminLoginPage() {
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getSupabaseClient().auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (data.session) {
        navigate({ to: "/admin", replace: true });
      } else {
        setCheckingSession(false);
      }
    });
    return () => { cancelled = true; };
  }, [navigate]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;

    const nextErrors: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) nextErrors.email = "Please enter your email.";
    else if (!EMAIL_PATTERN.test(trimmedEmail)) nextErrors.email = "Please enter a valid email address.";
    if (!password) nextErrors.password = "Please enter your password.";
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) return;

    setLoading(true);
    getSupabaseClient().auth.signInWithPassword({ email: trimmedEmail, password })
      .then(({ error }) => {
        if (error) {
          console.error("Admin sign-in failed:", error);
          setErrors({ form: "We couldn't sign you in. Please check your email and password and try again." });
          setLoading(false);
          return;
        }
        navigate({ to: "/admin" });
      })
      .catch((error) => {
        console.error("Admin sign-in failed:", error);
        setErrors({ form: "We couldn't sign you in. Please check your email and password and try again." });
        setLoading(false);
      });
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-coffee px-5 py-16">
      <div className="w-full max-w-md rounded-lg bg-card p-7 shadow-header sm:p-10">
        <a href="/" aria-label="ManulCoffee home" className="inline-block">
          <BrandMark />
        </a>
        <h1 className="mt-8 font-display text-3xl font-semibold leading-tight text-card-foreground sm:text-4xl">Admin sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to manage ManulCoffee reservations.</p>

        {checkingSession ? (
          <p className="mt-10 text-sm text-muted-foreground" aria-live="polite">Checking your session…</p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-card-foreground">Email</label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="you@manulcoffee.lv"
              />
              {errors.email && <p className="mt-1.5 text-sm text-destructive">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-card-foreground">Password</label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-sm text-destructive">{errors.password}</p>}
            </div>

            {errors.form && <p role="alert" className="rounded-md bg-secondary px-3.5 py-2.5 text-sm text-destructive">{errors.form}</p>}

            <Button type="submit" variant="dark" size="lg" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
