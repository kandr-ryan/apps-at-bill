"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Copy, ExternalLink, ChevronRight } from "lucide-react";

const templates = [
  { id: "react-dashboard", name: "React Dashboard", desc: "Admin dashboard with routing, auth, and data fetching" },
  { id: "python-tool", name: "Python Data Tool", desc: "FastAPI backend with a simple UI for data workflows" },
  { id: "slack-bot", name: "Slack Bot", desc: "Node.js Slack bot with event handling" },
  { id: "chrome-ext", name: "Chrome Extension", desc: "Browser extension with internal API patterns" },
  { id: "data-pipeline", name: "Data Pipeline", desc: "Scheduled Python job for ETL workflows" },
  { id: "blank", name: "Blank", desc: "Empty repo with just CI/CD configuration" },
];

const dataScopes = [
  { key: "localization.pages", label: "Page content and translations" },
  { key: "localization.languages", label: "Supported language list" },
  { key: "users.directory", label: "Employee directory and profiles" },
  { key: "users.email", label: "Employee email addresses" },
  { key: "billing.invoices", label: "Customer billing records" },
  { key: "billing.subscriptions", label: "Subscription data" },
  { key: "support.tickets", label: "Customer support tickets" },
  { key: "analytics.events", label: "Product analytics events" },
  { key: "content.templates", label: "Content and widget templates" },
];

const secretPresets = [
  { key: "GEMINI_API_KEY", label: "Google Gemini for AI/ML features" },
  { key: "OPENAI_API_KEY", label: "OpenAI for GPT-based features" },
  { key: "STRIPE_SECRET_KEY", label: "Stripe for payment processing" },
  { key: "SLACK_WEBHOOK_URL", label: "Slack for notifications and integrations" },
  { key: "SENDGRID_API_KEY", label: "SendGrid for transactional email" },
  { key: "TWILIO_AUTH_TOKEN", label: "Twilio for SMS/Voice" },
  { key: "AWS_ACCESS_KEY_ID", label: "AWS services access" },
  { key: "DATABASE_URL", label: "Managed database connection string" },
];

const steps = ["Basic Info", "Infrastructure", "Data Access", "Secrets", "Review & Submit"];

export default function NewAppPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form state
  const [appName, setAppName] = useState("");
  const [description, setDescription] = useState("");
  const [purpose, setPurpose] = useState("");
  const [targetUsers, setTargetUsers] = useState("");
  const [team, setTeam] = useState("Engineering");
  const [category, setCategory] = useState("Dashboard");
  const [template, setTemplate] = useState("react-dashboard");
  const [slug, setSlug] = useState("");
  const [oktaEnabled, setOktaEnabled] = useState(true);
  const [selectedScopes, setSelectedScopes] = useState<Record<string, "Read" | "Read/Write">>({});
  const [selectedSecrets, setSelectedSecrets] = useState<string[]>([]);

  const repoName = slug || appName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const toggleScope = (key: string) => {
    setSelectedScopes((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = "Read";
      return next;
    });
  };

  const toggleSecret = (key: string) => {
    setSelectedSecrets((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`git clone https://github.com/bill-internal/${repoName}.git\ncd ${repoName}\nnpm install\nnpm run dev`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-border p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">App Request Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Your app <strong>{appName}</strong> has been provisioned. Here&apos;s how to get started:
          </p>

          {/* Clone command */}
          <div className="bg-gray-900 rounded-lg p-4 text-left mb-6 relative">
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <code className="text-sm text-green-400 block leading-relaxed">
              <span className="text-gray-500">$</span> git clone https://github.com/bill-internal/{repoName}.git<br />
              <span className="text-gray-500">$</span> cd {repoName}<br />
              <span className="text-gray-500">$</span> npm install<br />
              <span className="text-gray-500">$</span> npm run dev<br />
              <span className="text-gray-500 text-xs"># Secrets are pre-configured in the portal</span><br />
              <span className="text-gray-500 text-xs"># Push to prod branch to trigger security gate</span>
            </code>
          </div>

          <div className="flex items-center gap-3 justify-center mb-8">
            <a
              href={`https://github.com/bill-internal/${repoName}`}
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
            >
              <ExternalLink className="w-4 h-4" /> View Repo
            </a>
            <span className="text-muted-foreground">·</span>
            <button
              onClick={() => router.push("/apps/app-3")}
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
            >
              View App Detail <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* What's next checklist */}
          <div className="bg-muted rounded-lg p-4 text-left">
            <h3 className="font-semibold text-sm text-foreground mb-3">What&apos;s Next</h3>
            <div className="space-y-2">
              {[
                "Clone the repo and install dependencies",
                "Build your app using the starter template",
                "Push to prod branch when ready",
                "Submit for Infosec review",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center text-xs font-medium">
                    {i + 1}
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-2">New App Request</h1>
      <p className="text-muted-foreground mb-8">Request infrastructure for a new internal tool</p>

      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 text-sm font-medium ${
                i === step ? "text-primary" : i < step ? "text-green-600" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  i === step
                    ? "bg-primary text-white"
                    : i < step
                    ? "bg-green-100 text-green-600"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        {/* Step 1: Basic Info */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">App Name *</label>
              <input
                type="text"
                value={appName}
                onChange={(e) => { setAppName(e.target.value); if (!slug) setSlug(""); }}
                placeholder="e.g., AI Localization Tool"
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this app do?"
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">What problem does this solve?</label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Describe the manual process this replaces..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Target Users</label>
              <input
                type="text"
                value={targetUsers}
                onChange={(e) => setTargetUsers(e.target.value)}
                placeholder="e.g., Engineering team, All employees"
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Team</label>
                <select value={team} onChange={(e) => setTeam(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  {["Engineering", "Product", "Finance", "HR", "Support", "Company-Wide"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  {["Dashboard", "Automation", "Bot", "Extension", "Pipeline", "Other"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Infrastructure */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold mb-4">Infrastructure</h2>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">GitHub Repo Name</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">bill-internal/</span>
                <input
                  type="text"
                  value={slug || repoName}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="flex-1 px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Starter Template</label>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`text-left p-3 rounded-lg border-2 transition-colors ${
                      template === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="font-medium text-sm text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Internal URL</label>
              <div className="flex items-center gap-0">
                <span className="px-3 py-2 bg-muted border border-border border-r-0 rounded-l-lg text-sm text-muted-foreground">
                  apps.bill.com/
                </span>
                <input
                  type="text"
                  value={slug || repoName}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="flex-1 px-3 py-2 rounded-r-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <div className="text-sm font-medium text-foreground">Okta Provisioning</div>
                <div className="text-xs text-muted-foreground">Create an Okta tile for end users</div>
              </div>
              <button
                onClick={() => setOktaEnabled(!oktaEnabled)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  oktaEnabled ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  oktaEnabled ? "translate-x-5.5" : "translate-x-0.5"
                }`} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Data Access */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Data Access</h2>
            <p className="text-sm text-muted-foreground mb-4">
              What internal data does your app need access to? Your app will receive scoped API tokens that only allow access to the data you select here.
            </p>
            <div className="space-y-2">
              {dataScopes.map((scope) => (
                <div
                  key={scope.key}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    selectedScopes[scope.key] ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <label className="flex items-center gap-3 flex-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!selectedScopes[scope.key]}
                      onChange={() => toggleScope(scope.key)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <div>
                      <div className="text-sm font-medium text-foreground font-mono">{scope.key}</div>
                      <div className="text-xs text-muted-foreground">{scope.label}</div>
                    </div>
                  </label>
                  {selectedScopes[scope.key] && (
                    <select
                      value={selectedScopes[scope.key]}
                      onChange={(e) =>
                        setSelectedScopes((prev) => ({
                          ...prev,
                          [scope.key]: e.target.value as "Read" | "Read/Write",
                        }))
                      }
                      className="px-2 py-1 text-xs rounded border border-border bg-white"
                    >
                      <option value="Read">Read</option>
                      <option value="Read/Write">Read/Write</option>
                    </select>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 p-3 bg-muted rounded-lg">
              Direct database access is not permitted. Apps interact with data through scoped API tokens that enforce the permissions approved here.
            </p>
          </div>
        )}

        {/* Step 4: Secrets */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Secrets & API Keys</h2>
            <p className="text-sm text-muted-foreground mb-4">
              What API keys or secrets does your app need? Secrets are injected as environment variables at deploy time and never committed to your repo.
            </p>
            <div className="space-y-2">
              {secretPresets.map((secret) => (
                <label
                  key={secret.key}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedSecrets.includes(secret.key) ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSecrets.includes(secret.key)}
                    onChange={() => toggleSecret(secret.key)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <div>
                    <div className="text-sm font-medium text-foreground font-mono">{secret.key}</div>
                    <div className="text-xs text-muted-foreground">{secret.label}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {step === 4 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Review & Submit</h2>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="text-sm font-semibold text-foreground mb-2">App Details</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="text-muted-foreground">Name</dt><dd className="font-medium">{appName || "—"}</dd>
                  <dt className="text-muted-foreground">Team</dt><dd className="font-medium">{team}</dd>
                  <dt className="text-muted-foreground">Category</dt><dd className="font-medium">{category}</dd>
                  <dt className="text-muted-foreground">Target Users</dt><dd className="font-medium">{targetUsers || "—"}</dd>
                </dl>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="text-sm font-semibold text-foreground mb-2">Infrastructure</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="text-muted-foreground">Repo</dt><dd className="font-medium font-mono">bill-internal/{repoName || "—"}</dd>
                  <dt className="text-muted-foreground">Template</dt><dd className="font-medium">{templates.find((t) => t.id === template)?.name}</dd>
                  <dt className="text-muted-foreground">URL</dt><dd className="font-medium font-mono">apps.bill.com/{slug || repoName || "—"}</dd>
                  <dt className="text-muted-foreground">Okta</dt><dd className="font-medium">{oktaEnabled ? "Yes" : "No"}</dd>
                </dl>
              </div>
              {Object.keys(selectedScopes).length > 0 && (
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Data Access ({Object.keys(selectedScopes).length} scopes)</h3>
                  <div className="space-y-1">
                    {Object.entries(selectedScopes).map(([key, level]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="font-mono text-foreground">{key}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-white border border-border">{level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedSecrets.length > 0 && (
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Secrets ({selectedSecrets.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSecrets.map((s) => (
                      <span key={s} className="text-xs font-mono px-2 py-1 bg-white border border-border rounded">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <button
            onClick={() => step > 0 && setStep(step - 1)}
            disabled={step === 0}
            className={`flex items-center gap-1 text-sm font-medium ${
              step === 0 ? "text-muted-foreground/50 cursor-not-allowed" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setSubmitted(true)}
              className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
            >
              <Check className="w-4 h-4" /> Submit Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
