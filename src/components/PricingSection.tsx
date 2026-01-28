import React, { useState } from "react";
import { Button } from "./ui/button";
import { Check, Loader2 } from "lucide-react";
import { createPayPalSubscription } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { AuthModal } from "./AuthModal";
import { WelcomePopup } from "./WelcomePopup";
import { trackInitiateCheckout, trackSubscribe, trackStartTrial } from "../utils/metaPixel";

export function PricingSection() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const { user, session, backendUser, refreshBackendUser } = useAuth();

  const handleSubscribe = async (planName: string, retryCount = 0) => {
    if (planName === "Free") {
      // Check if user is logged in
      if (user && backendUser) {
        // Show welcome popup for logged-in users
        setShowWelcomePopup(true);
      } else {
        // If not logged in, show auth modal first
        setPendingPlan("Free");
        setShowAuthModal(true);
      }
      return;
    }

    // Check if user is authenticated
    // Allow if user and session exist, even if backendUser is still loading
    if (!user || !session) {
      // Show auth modal
      setPendingPlan(planName);
      setShowAuthModal(true);
      return;
    }

    // If backendUser is not loaded yet, try to refresh it first
    let currentBackendUser = backendUser;
    if (!currentBackendUser && refreshBackendUser) {
      setLoading(planName);
      setError("Loading your account information...");
      try {
        // Try to refresh backend user and get the result directly
        const refreshedUser = await refreshBackendUser();
        if (refreshedUser) {
          currentBackendUser = refreshedUser;
        } else if (retryCount < 2) {
          // Wait a bit and retry once more
          await new Promise(resolve => setTimeout(resolve, 1000));
          return handleSubscribe(planName, retryCount + 1);
        } else {
          setError("Unable to load account information. Please refresh the page and try again.");
          setLoading(null);
          return;
        }
      } catch (err) {
        setError("Unable to load account information. Please refresh the page and try again.");
        setLoading(null);
        return;
      }
    }

    // If still no backendUser, show error
    if (!currentBackendUser) {
      setError("Unable to load account information. Please refresh the page and try again.");
      setLoading(null);
      return;
    }

    setLoading(planName);
    setError(null);

    try {
      // Track initiate checkout event
      trackInitiateCheckout({
        content_name: planName,
        value: planName === 'Pro' ? 29 : planName === 'Enterprise' ? 99 : 0,
        currency: 'USD'
      });

      // Use authenticated user's email and ID
      const userEmail = user.email || currentBackendUser.email;
      const userId = currentBackendUser.user_id;

      if (!userEmail || !userId) {
        throw new Error("User information not available. Please sign in again.");
      }

      // Create PayPal subscription with authentication
      const result = await createPayPalSubscription(planName, userEmail, userId, session.access_token);

      if (result.approval_url) {
        // Track subscription event before redirect
        if (planName === 'Free') {
          trackStartTrial({ content_name: planName });
        } else {
          trackSubscribe({
            content_name: planName,
            value: planName === 'Pro' ? 29 : 99,
            currency: 'USD'
          });
        }
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

  // Handle auth success - retry subscription creation or show welcome popup
  const handleAuthSuccess = async () => {
    setShowAuthModal(false);
    if (pendingPlan === "Free") {
      // Show welcome popup after sign-up
      setTimeout(() => {
        setShowWelcomePopup(true);
      }, 500);
    } else if (pendingPlan) {
      // Wait for backend user to sync before proceeding
      if (refreshBackendUser) {
        await refreshBackendUser();
      }
      // Small delay to ensure backend user is synced
      setTimeout(() => {
        handleSubscribe(pendingPlan);
      }, 1500);
    }
  };

  // Handle going to dashboard
  const handleGoToDashboard = () => {
    setShowWelcomePopup(false);
    // Scroll to dashboard section
    const dashboardElement = document.getElementById('token-dashboard');
    if (dashboardElement) {
      dashboardElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Fallback: scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00A878]/10 border border-[#00A878]/20 rounded-full mb-4">
            <span className="text-sm font-medium text-[#00A878]">💰 No Credit Card Required • Cancel Anytime</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-[#00A878] to-gray-900 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
            Choose the plan that fits your needs. Upgrade or downgrade at any time.
          </p>
          <p className="text-sm text-gray-500">
            All plans include a free trial. Start with Free and upgrade when you need more.
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
                  <div className="bg-gradient-to-r from-[#00A878] to-[#00c98c] text-white rounded-full px-4 py-1 inline-block mb-4 shadow-md text-sm font-medium animate-pulse">
                    ⭐ Most Popular
                  </div>
                )}
                {plan.name === "Free" && (
                  <div className="bg-blue-100 text-blue-700 rounded-full px-4 py-1 inline-block mb-4 shadow-sm text-sm font-medium border border-blue-200">
                    🎁 Start Here
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
                  className={`w-full rounded-full transition-smooth hover:scale-105 active:scale-95 !bg-[#00A878] !text-white hover:!bg-[#008c67] shadow-md hover:shadow-lg ${
                    plan.highlighted
                      ? "!bg-gradient-to-r !from-[#00A878] !to-[#00c98c] hover:!from-[#008c67] hover:!to-[#00A878] !text-white shadow-lg hover:shadow-xl hover-glow"
                      : ""
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

      {/* Welcome Popup */}
      <WelcomePopup
        open={showWelcomePopup}
        onClose={() => setShowWelcomePopup(false)}
        onGoToDashboard={handleGoToDashboard}
      />
    </section>
  );
}
