import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Create an account",
  description: "Create a Fauteuil & Co. account to check out and track your orders.",
  path: "/register",
  noIndex: true,
});

export default function RegisterPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl text-charcoal">Create your account</h1>
          <p className="mt-2 text-sm text-text-secondary">Save addresses and track orders in one place.</p>
        </div>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-accent hover:text-accent-hover">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
