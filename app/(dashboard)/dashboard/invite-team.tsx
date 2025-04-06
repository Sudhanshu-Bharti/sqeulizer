"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Loader2, PlusCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { use, useActionState } from "react";
import { inviteTeamMember } from "@/app/(login)/actions";
import { useUser } from "@/lib/auth";

type ActionState = {
  error?: string;
  success?: string;
};

export function InviteTeamMember() {
  const { userPromise } = useUser();
  const user = use(userPromise);
  const isOwner = user?.role === "owner";
  const [inviteState, inviteAction, isInvitePending] = useActionState<
    ActionState,
    FormData
  >(inviteTeamMember, { error: "", success: "" });

  return (
    <Card className="border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm mt-8">
      <CardHeader className="border-b border-neutral-800">
        <CardTitle className="text-xl font-semibold text-neutral-200">
          Invite Team Member
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form action={inviteAction} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-neutral-200"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter team member's email"
              required
              disabled={!isOwner}
              className="bg-neutral-800/50 border-neutral-700 text-neutral-200 placeholder:text-neutral-500 focus:border-orange-500/50 focus:ring-orange-500/50"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium text-neutral-200">Role</Label>
            <RadioGroup
              defaultValue="member"
              name="role"
              className="flex flex-col space-y-2 sm:flex-row sm:space-x-6 sm:space-y-0"
              disabled={!isOwner}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="member"
                  id="member"
                  className="border-neutral-600 text-orange-500"
                />
                <Label htmlFor="member" className="text-sm text-neutral-300">
                  Member
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="owner"
                  id="owner"
                  className="border-neutral-600 text-orange-500"
                />
                <Label htmlFor="owner" className="text-sm text-neutral-300">
                  Owner
                </Label>
              </div>
            </RadioGroup>
          </div>
          {inviteState?.error && (
            <p className="text-sm text-red-400">{inviteState.error}</p>
          )}
          {inviteState?.success && (
            <p className="text-sm text-emerald-400">{inviteState.success}</p>
          )}
          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-colors"
            disabled={isInvitePending || !isOwner}
          >
            {isInvitePending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inviting...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Invite Member
              </>
            )}
          </Button>
        </form>
      </CardContent>
      {!isOwner && (
        <CardFooter className="border-t border-neutral-800 bg-neutral-900/30">
          <p className="text-sm text-neutral-400">
            You must be a team owner to invite new members.
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
