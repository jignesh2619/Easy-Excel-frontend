import React, { useState } from "react";
import { Button } from "./ui/button";
import { Check, Loader2 } from "lucide-react";
import { createPayPalSubscription } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { AuthModal } from "./AuthModal";

export function PricingSection() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const { user, session, backendUser } = useAuth();

  const handleSubscribe = async (planName: string) => {
    if (planName === "Free") {
      // Free plan doesn't need payment - just scroll to tool
      window.location.href = "#prompt-tool";
      return;
    }

    // Check if user is authenticated
    if (!user || !session || !backendUser) {
      // Show auth modal
      setPendingPlan(planName);
      setShowAuthModal(true);
      return;
    }

    setLoading(planName);
    setError(null);

    try {
      // Use authenticated user's email and ID
      const userEmail = user.email || backendUser.email;
      const userId = backendUser.user_id;

      if (!userEmail || !userId) {
        throw new Error("User information not available. Please sign in again.");
      }

      // Create PayPal subscription with authentication
      const result = await createPayPalSubscription(planName, userEmail, userId, session.access_token);

      if (result.approval_url) {
        // Redirect to PayPal for payment approval
        window.location.href = result.approval_url;
      } else {
        throw new Error("No approval URL received");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create subscription. Please try again.");
      setLoading(null);
    }
  };

  // Handle auth success - retry subscription creation
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (pendingPlan) {
      // Small delay to ensure backend user is synced
      setTimeout(() => {
        handleSubscribe(pendingPlan);
      }, 500);
    }
  };
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      subtitle: "No daily limit",
      features: [
        "200,000 tokens total (one-time or monthly)",
        "Unlimited prompts (no per-day limitation)",
        "Upload Excel",
        "Basic cleaning tools",
        "Basic visualization",
        "Try dashboards once or twice (optional)"
      ],
      cta: "Get Started",
      highlighted: false
    },
    {
      name: "Starter",
      price: "$4.99",
      period: "per month",
      subtitle: "Perfect for individuals",
      features: [
        "2 Million tokens per month",
        "Unlimited prompts",
        "All cleaning tools",
        "All formula tools",
        "Smart charts & visualizations",
        "Summaries",
        "Dashboard builder",
        "Save/download cleaned files",
        "Green-brand premium UI"
      ],
      cta: "Upgrade to Starter",
      highlighted: true
    },
    {
      name: "Pro",
      price: "$12",
      period: "per month",
      subtitle: "For power users",
      features: [
        "7 Million tokens per month",
        "Unlimited prompts",
        "Faster processing",
        "Advanced dashboards",
        "KPI visualizations",
        "Data templates",
        "Priority speed",
        "Multi-file operations"
      ],
      cta: "Upgrade to Pro",
      highlighted: false
    }
  ];

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#00A878]/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-[#00c98c]/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-[#00A878]/5 to-transparent rounded-full blur-2xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-[#00A878] to-gray-900 bg-clip-text text-transparent">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 border-2 transition-all duration-300 hover:scale-105 relative overflow-hidden ${
                plan.highlighted
                  ? "border-[#00A878] shadow-2xl scale-105 bg-gradient-to-br from-white via-[#00A878]/5 to-[#00c98c]/5"
                  : "border-gray-200 hover:border-[#00A878]/50 hover:shadow-xl bg-gradient-to-br from-white to-gray-50"
              }`}
            >
              {/* Gradient orb inside card */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00A878]/10 to-transparent rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                {plan.highlighted && (
                  <div className="bg-gradient-to-r from-[#00A878] to-[#00c98c] text-white rounded-full px-4 py-1 inline-block mb-4 shadow-md text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="text-gray-900 mb-1 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent text-2xl font-bold">{plan.name}</h3>
                {plan.subtitle && (
                  <p className="text-gray-500 text-sm mb-4">{plan.subtitle}</p>
                )}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600"> / {plan.period}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#00A878] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {error && loading === plan.name && (
                  <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
                )}
                <Button
                  onClick={() => handleSubscribe(plan.name)}
                  disabled={loading === plan.name}
                  className={`w-full rounded-full transition-all duration-300 hover:scale-105 ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-[#00A878] to-[#00c98c] hover:from-[#008c67] hover:to-[#00A878] text-white shadow-lg hover:shadow-xl"
                      : "bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-900 hover:shadow-md"
                  }`}
                >
                  {loading === plan.name ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    plan.cta
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        onSuccess={handleAuthSuccess}
      />
    </section>
  );
}
