/**
 * Environment Dashboard Component
 * FOR ADMIN/DEVELOPMENT USE ONLY - NOT FOR REGULAR SAAS USERS
 * Provides visual status and controls for environment switching
 */

"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Settings,
  CreditCard,
  Globe,
  Database,
  Key,
  RefreshCw,
} from "lucide-react";

interface EnvironmentStatus {
  environment: string;
  razorpayMode: string;
  razorpayKeyType: string;
  safeToTest: boolean;
  validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
  config: {
    baseUrl: string;
    hasWebhookSecret: boolean;
    razorpayKeyId: string;
  };
}

export function EnvironmentDashboard() {
  const [status, setStatus] = useState<EnvironmentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/admin/env-status");
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error("Failed to fetch environment status:", error);
    } finally {
      setLoading(false);
    }
  };
  const switchEnvironment = async (environment: "test" | "live") => {
    setSwitching(true);
    try {
      const response = await fetch("/api/admin/switch-env", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ environment }),
      });
      if (response.ok) {
        // Refresh status after switching
        await fetchStatus();
        // Show success message
        alert(
          `Successfully switched to ${environment.toUpperCase()} mode! Please restart your development server.`
        );
      } else {
        alert("Failed to switch environment");
      }
    } catch (error) {
      console.error("Failed to switch environment:", error);
      alert("Failed to switch environment");
    } finally {
      setSwitching(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading environment status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load environment status
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Environment Status</span>
          </CardTitle>
          <CardDescription>
            Current environment configuration and Razorpay mode
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Environment Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Environment:</span>
              <Badge
                variant={
                  status.environment === "Production"
                    ? "destructive"
                    : "secondary"
                }
              >
                {status.environment}
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Razorpay:</span>
              <Badge variant={status.safeToTest ? "secondary" : "destructive"}>
                {status.razorpayMode}
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Key className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Keys:</span>
              <Badge variant="outline">{status.razorpayKeyType}</Badge>
            </div>
          </div>

          {/* Safety Status */}
          <Alert
            className={
              status.safeToTest ? "border-green-500" : "border-red-500"
            }
          >
            {status.safeToTest ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
            <AlertDescription>
              {status.safeToTest
                ? "✅ Safe for development - using test credentials"
                : "⚠️ LIVE MODE - Real transactions will be processed!"}
            </AlertDescription>
          </Alert>

          {/* Validation Errors */}
          {!status.validation.isValid && (
            <Alert className="border-red-500">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription>
                <div className="space-y-1">
                  <div className="font-medium">Configuration Issues:</div>
                  {status.validation.errors.map((error, index) => (
                    <div key={index} className="text-sm">
                      • {error}
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Environment Switching */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Environment Switch</CardTitle>
          <CardDescription>
            Switch between test and live Razorpay configurations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant={status.safeToTest ? "default" : "outline"}
              onClick={() => switchEnvironment("test")}
              disabled={switching}
              className="flex items-center space-x-2"
            >
              <Shield className="h-4 w-4" />
              <span>Switch to Test Mode</span>
            </Button>

            <Button
              variant={!status.safeToTest ? "destructive" : "outline"}
              onClick={() => switchEnvironment("live")}
              disabled={switching}
              className="flex items-center space-x-2"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Switch to Live Mode</span>
            </Button>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              After switching modes, you must restart your development server
              for changes to take effect.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Configuration Details */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Details</CardTitle>
          <CardDescription>Current environment configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Base URL:</span>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {status.config.baseUrl}
              </code>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Razorpay Key ID:</span>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {status.config.razorpayKeyId}
              </code>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Webhook Secret:</span>
              <Badge
                variant={
                  status.config.hasWebhookSecret ? "secondary" : "outline"
                }
              >
                {status.config.hasWebhookSecret ? "Configured" : "Not Set"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
