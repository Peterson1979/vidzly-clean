
import React, { useState, useEffect } from 'react';
import { getGeminiSummary } from './services/geminiProxyClient';
import { GeminiInsight } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { LightBulbIcon } from './Icons';
import { useBadges } from '../contexts/BadgesContext'; // Import useBadges

interface GeminiInsightsProps {
  videoId: string;
  videoTitle: string;
  videoDescription: string;
}

export const GeminiInsights: React.FC<GeminiInsightsProps> = ({ videoId, videoTitle, videoDescription }) => {
  const [insight, setInsight] = useState<GeminiInsight | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const badgesContext = useBadges(); // Get badges context

  useEffect(() => {
    if (isVisible && !insight && !isLoading) {
      setIsLoading(true);
      badgesContext.recordAiInsightUsage(); // Record AI insight usage for badge
      getVideoSummary(videoTitle, videoDescription)
        .then(summary => {
          setInsight({ videoId, summary });
        })
        .catch(error => {
          console.error("Error fetching Gemini summary:", error);
          setInsight({ videoId, error: "Could not load AI insights." });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [videoId, videoTitle, videoDescription, insight, isLoading, isVisible, badgesContext]);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    // Note: The actual recording of usage is now in the useEffect above, tied to when loading starts
  };

  return (
    <div className="w-full"> {/* Ensure it takes available width for alignment */}
       <button
        onClick={toggleVisibility}
        className="flex items-center text-sm text-brand-orange hover:text-orange-400 dark:hover:text-orange-300 focus:outline-none w-full text-left"
        aria-expanded={isVisible}
        aria-controls={`gemini-insights-${videoId}`}
      >
        <LightBulbIcon className="w-5 h-5 mr-2 flex-shrink-0" />
        <span className="font-semibold">AI Insights</span>
        <svg className={`w-4 h-4 ml-auto transform transition-transform duration-200 ${isVisible ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      
      {isVisible && (
        <div id={`gemini-insights-${videoId}`} className="mt-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-3 rounded-md shadow">
          {isLoading && (
            <div className="flex items-center">
              <LoadingSpinner /> <span className="ml-2">Generating insights...</span>
            </div>
          )}
          {insight?.summary && <p>{insight.summary}</p>}
          {insight?.error && <p className="text-red-500 dark:text-red-400">{insight.error}</p>}
          {!isLoading && !insight && <p>Click to load AI-powered summary.</p>}
        </div>
      )}
    </div>
  );
};