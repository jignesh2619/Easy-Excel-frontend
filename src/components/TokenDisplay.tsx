import React, { useState, useEffect } from "react";
import { Zap, TrendingUp } from "lucide-react";
import { getTokenStats, TokenStats } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

interface TokenDisplayProps {
  tokensUsed?: number; // Tokens used in current operation
  tokensLimit?: number; // User's token limit
  tokensRemaining?: number; // Remaining tokens
  showLabel?: boolean; // Show "Token Usage" label
  compact?: boolean; // Compact display mode
}

export function TokenDisplay({ 
  tokensUsed, 
  tokensLimit, 
  tokensRemaining,
  showLabel = true,
  compact = false 
}: TokenDisplayProps) {
  const [tokenStats, setTokenStats] = useState<TokenStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, session } = useAuth();

  // Fetch token stats if not provided as props
  useEffect(() => {
    if ((!tokensUsed && !tokensLimit && !tokensRemaining) && user && session) {
      fetchTokenStats();
    }
  }, [user, session]);

  const fetchTokenStats = async () => {
    if (!user || !session) return;
    
    setIsLoading(true);
    try {
      const stats = await getTokenStats();
      setTokenStats(stats);
    } catch (error) {
      console.error('Failed to fetch token stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Use props if provided, otherwise use fetched stats
  const displayTokensUsed = tokensUsed ?? tokenStats?.tokens_used ?? 0;
  const displayTokensLimit = tokensLimit ?? tokenStats?.tokens_limit ?? 0;
  const displayTokensRemaining = tokensRemaining ?? tokenStats?.tokens_remaining ?? 0;
  const plan = tokenStats?.plan ?? "Free";

  // Calculate percentage used
  const percentageUsed = displayTokensLimit > 0 
    ? (displayTokensUsed / displayTokensLimit) * 100 
    : 0;

  // Determine color based on usage
  const getColorClass = () => {
    if (percentageUsed >= 90) return "text-red-600";
    if (percentageUsed >= 70) return "text-orange-600";
    return "text-[#00A878]";
  };

  const getProgressColor = () => {
    if (percentageUsed >= 90) return "bg-red-500";
    if (percentageUsed >= 70) return "bg-orange-500";
    return "bg-[#00A878]";
  };

  // Don't show if no user or no token info
  if (!user && !tokensUsed && !tokensLimit) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Zap className="w-4 h-4 text-[#00A878]" />
        <span className="text-gray-600">
          {displayTokensUsed.toLocaleString()} / {displayTokensLimit.toLocaleString()}
        </span>
        <span className="text-gray-400">tokens</span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      {showLabel && (
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-[#00A878]" />
          <h4 className="text-sm font-semibold text-gray-700">Token Usage</h4>
          {plan && plan !== "Free" && (
            <span className="text-xs px-2 py-0.5 bg-[#00A878]/10 text-[#00A878] rounded-full">
              {plan}
            </span>
          )}
        </div>
      )}
      
      {isLoading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {displayTokensUsed.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">/ {displayTokensLimit.toLocaleString()}</span>
            </div>
            <div className={`text-sm font-semibold ${getColorClass()}`}>
              {displayTokensRemaining.toLocaleString()} remaining
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            />
          </div>
          
          {/* Usage Percentage */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{percentageUsed.toFixed(1)}% used</span>
            {tokensUsed && tokensUsed > 0 && (
              <span className="flex items-center gap-1 text-[#00A878]">
                <TrendingUp className="w-3 h-3" />
                {tokensUsed.toLocaleString()} tokens used in this operation
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

