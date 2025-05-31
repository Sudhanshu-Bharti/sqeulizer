# Admin Routes Security

## Important Security Notice

The `/admin` routes are currently **UNSECURED** and should only be used during development.

## For Production Deployment

**CRITICAL:** Before deploying to production, you must secure these admin routes:

### Option 1: Remove Admin Routes (Recommended for SaaS)

```bash
# Remove the entire admin directory before building for production
rm -rf app/admin/
```

### Option 2: Add Authentication Middleware

Add authentication checks to the admin layout or create middleware:

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Block admin routes in production
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Add your admin authentication logic here
    // Check for admin role, special tokens, etc.
  }
}

export const config = {
  matcher: "/admin/:path*",
};
```

### Option 3: Environment-Based Access Control

```typescript
// app/admin/layout.tsx
export default function AdminLayout({ children }: { children: ReactNode }) {
  // Prevent access in production
  if (process.env.NODE_ENV === "production") {
    redirect("/dashboard");
  }

  // Your existing layout code...
}
```

## Current Usage (Development Only)

- **Environment Management**: `/admin/environment`
- **Main Admin Panel**: `/admin`

These routes provide:

- Razorpay test/live mode switching
- Environment configuration validation
- Development debugging tools

## Best Practices

1. **Never expose admin routes to regular SaaS users**
2. **Remove or secure admin routes before production deployment**
3. **Use environment variables to control admin access**
4. **Implement proper role-based access control if needed**
5. **Consider using separate admin subdomains for production**
