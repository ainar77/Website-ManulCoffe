import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { getSupabaseClient } from "@/integrations/supabase/client";
import { BrandMark } from "@/components/manul/BrandMark";
import { Button } from "@/components/ui/button";

const title = "ManulCoffee Admin";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: "ManulCoffee admin area." },
      { property: "og:title", content: title },
      { property: "og:description", content: "ManulCoffee admin area." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getSupabaseClient().auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (!data.session) {
        navigate({ to: "/admin/login", replace: true });
      } else {
        setReady(true);
      }
    });
    return () => { cancelled = true; };
  }, [navigate]);

  async function handleSignOut() {
    await getSupabaseClient().auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-coffee px-5 py-16">
      <div className="w-full max-w-md rounded-lg bg-card p-7 text-center shadow-header sm:p-10">
        <div className="flex justify-center">
          <BrandMark />
        </div>
        {ready ? (
          <>
            <h1 className="mt-8 font-display text-3xl font-semibold text-card-foreground sm:text-4xl">ManulCoffee Admin</h1>
            <p className="mt-3 text-sm text-muted-foreground">Signed in successfully.</p>
            <Button variant="dark" size="lg" className="mt-8 w-full" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </>
        ) : (
          <p className="mt-10 text-sm text-muted-foreground" aria-live="polite">Checking your session…</p>
        )}
      </div>
    </main>
  );
}
