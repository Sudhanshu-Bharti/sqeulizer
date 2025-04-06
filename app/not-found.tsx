import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mb-4 flex justify-center">
            <AlertTriangle className="size-12 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            404 - Page Not Found
          </CardTitle>
          <CardDescription>
            Oops! The page you're looking for doesn't seem to exist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            It might have been moved, deleted, or maybe the URL was mistyped.
            Please check the address and try again.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">Go Back Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
