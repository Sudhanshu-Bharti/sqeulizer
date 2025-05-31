import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Payment Failed
          </CardTitle>
        </CardHeader>{" "}
        <CardContent className="text-center space-y-4">
          {params.message && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700 font-medium">Error Details:</p>
              <p className="text-xs text-red-600 mt-1">{params.message}</p>
              {params.type && (
                <p className="text-xs text-red-500 mt-1">Type: {params.type}</p>
              )}
            </div>
          )}
          <p className="text-gray-600">
            There was an issue processing your payment. This could be due to:
          </p>
          <ul className="text-sm text-gray-500 text-left space-y-1">
            <li>• Invalid payment credentials</li>
            <li>• Network connectivity issues</li>
            <li>• Payment method declined</li>
            <li>• Subscription service temporarily unavailable</li>
          </ul>
          <div className="flex gap-3 pt-4">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/pricing">Try Again</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
          <p className="text-xs text-gray-400">
            If this issue persists, please contact our support team.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
