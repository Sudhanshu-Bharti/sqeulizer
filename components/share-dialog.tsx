"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  schema: string;
  dialect: string;
}

export function ShareDialog({ isOpen, onClose, schema, dialect }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  
  // Generate shareable URL
  const shareUrl = `${window.location.origin}/share?schema=${encodeURIComponent(schema)}&dialect=${encodeURIComponent(dialect)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Share URL has been copied to your clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Your Schema</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              value={shareUrl}
              readOnly
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Share this URL with others to let them view your database schema visualization.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 