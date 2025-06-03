import React from "react";

export default function LegalPage() {
  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <div className="space-y-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Legal Information
          </h1>
          <p className="text-muted-foreground">
            Our legal policies and terms for using PandaView
          </p>
        </div>

        {/* Privacy Policy Section */}
        <section id="privacy" className="space-y-6">
          <h2 className="text-3xl font-semibold text-foreground border-b pb-2">
            Privacy Policy
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              At PandaView, we take your privacy seriously. This policy explains
              how we collect, use, and protect your information.
            </p>

            <h3 className="text-xl font-medium text-foreground">
              Information We Collect
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (email, name) when you sign up</li>
              <li>Database schemas you choose to analyze</li>
              <li>Usage analytics to improve our service</li>
              <li>Technical information like IP address and browser type</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground">
              How We Use Your Information
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                To provide and improve our database visualization services
              </li>
              <li>To communicate with you about your account</li>
              <li>To analyze usage patterns and improve our platform</li>
              <li>To ensure security and prevent fraud</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground">
              Data Protection
            </h3>
            <p>
              We implement industry-standard security measures to protect your
              data. Your database schemas are processed securely and we never
              store sensitive database credentials.
            </p>

            <h3 className="text-xl font-medium text-foreground">Contact Us</h3>
            <p>
              If you have questions about this privacy policy, please contact us
              at privacy@pandaview.com
            </p>
          </div>
        </section>

        {/* Terms of Service Section */}
        <section id="terms" className="space-y-6">
          <h2 className="text-3xl font-semibold text-foreground border-b pb-2">
            Terms of Service
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              By using PandaView, you agree to these terms. Please read them
              carefully.
            </p>

            <h3 className="text-xl font-medium text-foreground">
              Acceptable Use
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Use our service only for legitimate database visualization
                purposes
              </li>
              <li>
                Do not attempt to breach our security or access unauthorized
                data
              </li>
              <li>
                Respect other users and do not engage in harmful activities
              </li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground">
              Service Availability
            </h3>
            <p>
              We strive to provide reliable service but cannot guarantee 100%
              uptime. We may perform maintenance that temporarily affects
              availability.
            </p>

            <h3 className="text-xl font-medium text-foreground">
              Account Responsibilities
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Keep your account credentials secure</li>
              <li>Notify us immediately of any security breaches</li>
              <li>You are responsible for all activity under your account</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground">
              Limitation of Liability
            </h3>
            <p>
              PandaView is provided "as is" without warranties. We are not
              liable for any damages arising from your use of our service.
            </p>

            <h3 className="text-xl font-medium text-foreground">
              Changes to Terms
            </h3>
            <p>
              We may update these terms from time to time. Continued use of our
              service constitutes acceptance of any changes.
            </p>
          </div>
        </section>

        {/* Cookie Policy Section */}
        <section id="cookie-policy" className="space-y-6">
          <h2 className="text-3xl font-semibold text-foreground border-b pb-2">
            Cookie Policy
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              This policy explains how PandaView uses cookies and similar
              technologies.
            </p>

            <h3 className="text-xl font-medium text-foreground">
              What Are Cookies
            </h3>
            <p>
              Cookies are small text files stored on your device that help us
              provide and improve our service.
            </p>

            <h3 className="text-xl font-medium text-foreground">
              Types of Cookies We Use
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Essential Cookies:</strong> Required for basic
                functionality like user authentication
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand how you
                use our service
              </li>
              <li>
                <strong>Preference Cookies:</strong> Remember your settings and
                preferences
              </li>
            </ul>

            <h3 className="text-xl font-medium text-foreground">
              Managing Cookies
            </h3>
            <p>
              You can control cookies through your browser settings. Note that
              disabling essential cookies may affect service functionality.
            </p>

            <h3 className="text-xl font-medium text-foreground">
              Third-Party Cookies
            </h3>
            <p>
              We may use third-party services like analytics providers that set
              their own cookies. Please review their policies for more
              information.
            </p>
          </div>
        </section>

        {/* Last Updated */}
        <div className="text-center pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
