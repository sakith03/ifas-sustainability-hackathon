'use client';

import { useState } from 'react';
import BusinessIdeaForm from '@/components/forms/BusinessIdeaForm';
import AssessmentResults from '@/components/dashboard/AssessmentResults';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [userId, setUserId] = useState<string>('');
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (formData: any) => {
    setLoading(true);
    setError(null);

    try {
      // Create user if not exists
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

      console.log('Created business idea:', idea);

      // Assess the idea
      const assessmentResult = await api.assessIdea(idea.id, {
        carbonFootprint: formData.carbonFootprint,
        waterUsage: formData.waterUsage,
        wasteGenerated: formData.wasteGenerated,
        renewableEnergy: formData.renewableEnergy,
        jobsCreated: formData.jobsCreated,
        communityImpact: formData.communityImpact,
      });

      console.log('Assessment result:', assessmentResult);

      // Ensure all scores are numbers
      const processedAssessment = {
        ...assessmentResult,
        carbonScore: Number(assessmentResult.carbonScore) || 0,
        resourceScore: Number(assessmentResult.resourceScore) || 0,
        socialScore: Number(assessmentResult.socialScore) || 0,
        totalScore: Number(assessmentResult.totalScore) || 0,
      };

      setAssessment(processedAssessment);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit assessment');
      alert('Failed to submit assessment. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Sustainability Assessment Platform
          </h1>
          <p className="text-xl text-gray-600">
            Evaluate and improve the environmental impact of your business idea
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Analyzing your business...</p>
          </div>
        )}

        {/* FORM */}
        {!loading && !assessment && (
          <BusinessIdeaForm onSubmit={handleFormSubmit} />
        )}

        {/* RESULTS */}
        {!loading && assessment && (
          <div>
            <AssessmentResults assessment={assessment} />
            <div className="text-center mt-8">
              <Button onClick={() => setAssessment(null)}>
                Assess Another Idea
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}