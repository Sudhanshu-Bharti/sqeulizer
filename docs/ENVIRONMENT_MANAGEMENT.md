# Environment Management System

This project includes a comprehensive environment management system for easily switching between Razorpay test and live modes.

## Quick Start

### Using NPM Scripts (Recommended)

```bash
# Switch to test mode (safe for development)
npm run env:test

# Switch to live mode (real transactions)
npm run env:live

# Check current environment status
npm run env:status
```

### Using the Script Directly

```bash
# Switch environments
node scripts/switch-env.js test
node scripts/switch-env.js live

# Check status
node scripts/switch-env.js status
node scripts/switch-env.js
```

## Environment Files

The system uses multiple environment files with a clear hierarchy:

1. **`.env.development`** - Default development configuration (test mode)
2. **`.env.production`** - Production configuration (live mode)
3. **`.env.local`** - Local overrides (takes highest precedence)

### File Hierarchy

```
.env.local          # Highest priority - local overrides
.env.development    # Development defaults (NODE_ENV=development)
.env.production     # Production defaults (NODE_ENV=production)
.env                # Fallback defaults
```

## Configuration Modes

### Test Mode (Safe for Development)

- Uses Razorpay test credentials
- All transactions are simulated
- Safe to experiment with
- Default for development environment

```bash
RAZORPAY_KEY_ID=rzp_test_khmfw0yE1xGb9W
RAZORPAY_KEY_SECRET=7u3KLR4d0SkrycrLStOYoxeK
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_khmfw0yE1xGb9W
RAZORPAY_MODE=test
```

### Live Mode (Real Transactions)

- Uses Razorpay live credentials
- **Real money transactions will be processed**
- Requires proper KYC verification
- Use with caution

```bash
RAZORPAY_KEY_ID=rzp_live_VRGb5Yzt0goFtR
RAZORPAY_KEY_SECRET=D0wtje1tBm4YALqQroyGcN73
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_VRGb5Yzt0goFtR
RAZORPAY_MODE=live
```

## Environment Dashboard

For a visual interface, you can add the Environment Dashboard component to your admin/settings page:

```tsx
import { EnvironmentDashboard } from "@/components/environment-dashboard";

export default function SettingsPage() {
  return (
    <div>
      <h1>Settings</h1>
      <EnvironmentDashboard />
    </div>
  );
}
```

## Automatic Validation

The system includes automatic validation that checks for:

- ✅ Required environment variables are set
- ✅ Razorpay key consistency (test/live matching)
- ⚠️ Production warnings for test credentials
- ❌ Configuration errors

## Safety Features

### Development Mode

- Automatically uses test credentials by default
- Shows environment status in console on startup
- Validates configuration on every start

### Production Mode

- Warns if test credentials are used in production
- Requires explicit configuration
- Validates all required variables

## Best Practices

### For Development

1. Always use test mode during development
2. Check environment status before testing payments
3. Use the switching scripts to change modes safely

### For Production

1. Set up proper environment variables in your hosting platform
2. Never commit live credentials to version control
3. Use `.env.local` for local testing only
4. Verify Razorpay account is properly configured

## Troubleshooting

### Common Issues

**"Payment failed. Please contact site admin"**

- Usually indicates live mode with incomplete KYC
- Switch to test mode for development
- Complete Razorpay account verification for live mode

**Environment variables not updating**

- Restart your development server after switching
- Check `.env.local` for overrides
- Verify the correct keys are being used

### Debug Commands

```bash
# Check current configuration
npm run env:status

# View environment validation
node -e "require('./lib/utils/env-config.ts').logEnvironmentInfo()"
```

## API Endpoints

The system provides API endpoints for programmatic access:

- `GET /api/admin/env-status` - Get current environment status
- `POST /api/admin/switch-env` - Switch environment mode

## Security Notes

- Environment files contain sensitive credentials
- Never commit `.env.local` or live credentials to git
- Use different credentials for test and production
- Regularly rotate API keys for security

## Support

For Razorpay-specific issues:

- Test mode: Use for all development and testing
- Live mode: Contact Razorpay support for account activation
- QR codes: Requires business verification for live mode
