'use client';

import { useState } from 'react';
/*
import BusinessIdeaForm from '@/components/forms/BusinessIdeaForm';
import AssessmentResults from '@/components/dashboard/AssessmentResults';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
*/

export default function Home() {
  const [userId, setUserId] = useState<string>('');
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFormSubmit = async (formData: any) => {
    setLoading(true);
    setError('');
    
    try {
      // Create user if not exists (demo mode)
      let currentUserId = userId;
      if (!currentUserId) {
        const user = await api.createUser('demo@example.com', 'Demo User');
        currentUserId = user.id;
        setUserId(user.id);
      }

      // Create business idea
      const idea = await api.createBusinessIdea({
        userId: currentUserId,
        name: formData.name,
        description: formData.description,
        sector: formData.sector,
      });

      // Assess the idea
      const assessmentResult = await api.assessIdea(idea.id, {
        carbonFootprint: formData.carbonFootprint,
        waterUsage: formData.waterUsage,
        wasteGenerated: formData.wasteGenerated,
        renewableEnergy: formData.renewableEnergy,
        jobsCreated: formData.jobsCreated,
        communityImpact: formData.communityImpact,
      });

      setAssessment(assessmentResult);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to submit assessment. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAssessment(null);
    setError('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
            <span className="text-2xl">🌍</span>
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              Sustainability Assessment Platform
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Design Sustainability
            <br />
            Into Your Business
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Evaluate and improve the environmental and social impact of your entrepreneurship idea
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200 text-center">
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Analyzing Your Business Idea...
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Calculating sustainability scores and generating recommendations
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {!loading && !assessment && (
          <div className="max-w-2xl mx-auto">
            <BusinessIdeaForm onSubmit={handleFormSubmit} />
          </div>
        )}

        {/* Results */}
        {!loading && assessment && (
          <div className="space-y-8">
            <AssessmentResults assessment={assessment} />
            
            <div className="text-center">
              <Button 
                onClick={resetForm}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                Assess Another Idea
              </Button>
            </div>
          </div>
        )}

        {/* Features Section (shown when no assessment) */}
        {!loading && !assessment && (
          <div className="max-w-4xl mx-auto mt-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                  1. Describe Your Idea
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Share your business concept and key metrics in our simple 3-step form
                </p>
              </div>

              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                  2. Get Instant Scores
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Receive detailed ratings on carbon impact, resource efficiency, and social value
                </p>
              </div>

              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <div className="text-4xl mb-4">💡</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                  3. Improve & Iterate
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Follow actionable recommendations to make your business more sustainable
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Built for 2026 Hackathon • Institute for Applied Material Flow Management
          </p>
        </footer>
      </div>
    </main>
  );
}