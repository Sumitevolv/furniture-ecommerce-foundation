import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sign in",
  description: "Sign in to your Fauteuil & Co. account.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl text-charcoal">Welcome back</h1>
          <p className="mt-2 text-sm text-text-secondary">Sign in to continue to your account.</p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-text-secondary">
          New here?{" "}
          <Link href="/register" className="font-medium text-accent hover:text-accent-hover">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
