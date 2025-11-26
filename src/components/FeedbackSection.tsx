import React, { useState } from 'react';
import { Button } from './ui/button';
import { MessageSquare, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function FeedbackSection() {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create mailto link with feedback
      const subject = encodeURIComponent('EasyExcel Feedback');
      const body = encodeURIComponent(
        `User Feedback:\n\n${feedback}\n\n` +
        (user ? `User Email: ${user.email}\n` : 'User: Anonymous\n') +
        `Submitted from: ${window.location.href}`
      );
      
      // Open email client with pre-filled feedback
      window.location.href = `mailto:jigneshmandana19@gmail.com?subject=${subject}&body=${body}`;
      
      // Show success message
      setIsSubmitted(true);
      setFeedback('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-[#00A878]/5 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#00A878]/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#00c98c]/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-[#00A878] to-[#00c98c] rounded-2xl">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-[#00A878] bg-clip-text text-transparent">
                Share Your Feedback
              </h2>
            </div>
            <p className="text-gray-600 text-lg">
              Your feedback is valuable to us! Help us improve EasyExcel by sharing your thoughts, suggestions, or reporting any issues.
            </p>
          </div>

          {/* Success Message */}
          {isSubmitted && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900">Thank you for your feedback!</p>
                <p className="text-sm text-green-700">Your email client should open shortly.</p>
              </div>
            </div>
          )}

          {/* Feedback Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="feedback" className="block text-sm font-semibold text-gray-700 mb-2">
                Your Feedback
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what you think... What features would you like to see? Any issues you encountered? We'd love to hear from you!"
                className="w-full bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-4 resize-none focus:outline-none focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/20 transition-all duration-300 hover:border-[#00A878]/50 hover:shadow-md text-base min-h-[150px]"
                rows={6}
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-2">
                {feedback.length} characters
              </p>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-gray-500">
                {user ? (
                  <span>Submitting as: <span className="font-medium text-gray-700">{user.email}</span></span>
                ) : (
                  <span>You can submit feedback anonymously</span>
                )}
              </div>
              <Button
                type="submit"
                disabled={!feedback.trim() || isSubmitting}
                className="bg-gradient-to-r from-[#00A878] via-[#00b887] to-[#00c98c] hover:from-[#008c67] hover:via-[#00A878] hover:to-[#00b887] text-white font-bold px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              💡 Your feedback will be sent via email. We typically respond within 24-48 hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

