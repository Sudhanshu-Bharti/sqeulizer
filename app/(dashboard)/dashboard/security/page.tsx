"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, Trash2, Loader2 } from "lucide-react";
import { startTransition, useActionState } from "react";
import { updatePassword, deleteAccount } from "@/app/(login)/actions";

type ActionState = {
  error?: string;
  success?: string;
};

export default function SecurityPage() {
  const [passwordState, passwordAction, isPasswordPending] = useActionState<
    ActionState,
    FormData
  >(updatePassword, { error: "", success: "" });

  const [deleteState, deleteAction, isDeletePending] = useActionState<
    ActionState,
    FormData
  >(deleteAccount, { error: "", success: "" });

  const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      passwordAction(new FormData(event.currentTarget));
    });
  };

  const handleDeleteSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      deleteAction(new FormData(event.currentTarget));
    });
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-2xl font-semibold text-gray-50 mb-6">
        Security Settings
      </h1>
      <Card className="mb-8 border-slate-800/50 bg-slate-950/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-gray-200">Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handlePasswordSubmit}>
            <div>
              <Label htmlFor="current-password" className="text-gray-200">
                Current Password
              </Label>
              <Input
                id="current-password"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
                maxLength={100}
                className="bg-slate-900/50 border-slate-800 text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="new-password" className="text-gray-200">
                New Password
              </Label>
              <Input
                id="new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={100}
                className="bg-slate-900/50 border-slate-800 text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password" className="text-gray-200">
                Confirm New Password
              </Label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                maxLength={100}
                className="bg-slate-900/50 border-slate-800 text-gray-100"
              />
            </div>
            {passwordState.error && (
              <p className="text-red-400 text-sm">{passwordState.error}</p>
            )}
            {passwordState.success && (
              <p className="text-emerald-400 text-sm">
                {passwordState.success}
              </p>
            )}
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isPasswordPending}
            >
              {isPasswordPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Update Password
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-slate-800/50 bg-slate-950/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-gray-200">Delete Account</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm mb-4">
            Account deletion is non-reversable. Please proceed with caution.
          </p>
          <form onSubmit={handleDeleteSubmit} className="space-y-4">
            <div>
              <Label htmlFor="delete-password" className="text-gray-200">
                Confirm Password
              </Label>
              <Input
                id="delete-password"
                name="password"
                type="password"
                required
                minLength={8}
                maxLength={100}
                className="bg-slate-900/50 border-slate-800 text-gray-100"
              />
            </div>
            {deleteState.error && (
              <p className="text-red-400 text-sm">{deleteState.error}</p>
            )}
            <Button
              type="submit"
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeletePending}
            >
              {isDeletePending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
