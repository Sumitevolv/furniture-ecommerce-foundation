"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal">Settings</h1>
      <p className="mt-1 text-sm text-text-secondary">Your account and store configuration.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Signed in as</CardTitle>
            <CardDescription>Your admin account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-text-primary">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-text-secondary">{user?.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Store configuration</CardTitle>
            <CardDescription>Shipping rules, tax rates, and payment/storage provider settings.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-text-secondary">
            Not built in this foundation phase — these currently live in the backend&apos;s environment
            configuration (see <code className="text-xs">backend/.env.example</code>). A future iteration
            can surface them here as editable settings.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
