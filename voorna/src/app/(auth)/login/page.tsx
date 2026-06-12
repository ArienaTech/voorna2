import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Log in — Voorna" };

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to manage your events."
      footer={
        <>
          New to Voorna?{" "}
          <Link href="/signup" className="font-medium text-ink underline underline-offset-2">
            Create a free account
          </Link>
          {" · "}
          <Link href="/forgot-password" className="text-ink-soft underline underline-offset-2">
            Forgot password
          </Link>
        </>
      }
    >
      <AuthForm mode="login" />
    </AuthShell>
  );
}
