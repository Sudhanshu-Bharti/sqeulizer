"use client";

import { startTransition, use, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useUser } from "@/lib/auth";
import { updateAccount } from "@/app/(login)/actions";

type ActionState = {
  error?: string;
  success?: string;
};

export default function GeneralPage() {
  const { userPromise } = useUser();
  const user = use(userPromise);
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateAccount,
    { error: "", success: "" }
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      formAction(new FormData(event.currentTarget));
    });
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-2xl font-semibold text-gray-50 mb-6">
        General Settings
      </h1>

      <Card className="border-slate-800/50 bg-slate-950/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-gray-200">Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name" className="text-gray-200">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your name"
                defaultValue={user?.name || ""}
                required
                className="bg-slate-900/50 border-slate-800 text-gray-100 placeholder:text-gray-500"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                defaultValue={user?.email || ""}
                required
                className="bg-slate-900/50 border-slate-800 text-gray-100 placeholder:text-gray-500"
              />
            </div>
            {state.error && (
              <p className="text-red-400 text-sm">{state.error}</p>
            )}
            {state.success && (
              <p className="text-emerald-400 text-sm">{state.success}</p>
            )}
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
