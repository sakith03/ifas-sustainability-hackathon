'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface Assessment {
  id: string;
  carbonScore: number;
  resourceScore: number;
  socialScore: number;
  totalScore: number;
  recommendations: string[];
}

export default function AssessmentResults({
  assessment,
}: {
  assessment: Assessment;
}) {
  const [loading, setLoading] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Excellent';
    if (score >= 40) return 'Good';
    return 'Needs Improvement';
  };

  const downloadReport = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/business/assessments/${assessment.id}/download`
      );

      if (!response.ok) {
        throw new Error('Failed to download report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'sustainability-report.xlsx';
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error(error);
      alert('Failed to download report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* MAIN RESULTS CARD */}
      <Card>
        <CardHeader>
          <h2 className="text-3xl font-bold text-center">
            Sustainability Assessment Results
          </h2>
        </CardHeader>

        <CardContent>
          {/* TOTAL SCORE */}
          <div className="text-center mb-8">
            <div
              className={`text-6xl font-bold ${getScoreColor(
                assessment.totalScore
              )}`}
            >
              {Math.round(assessment.totalScore)}
            </div>
            <p className="text-xl mt-2">
              {getScoreLabel(assessment.totalScore)}
            </p>

            <Button
              onClick={downloadReport}
              variant="outline"
              className="mt-6"
              disabled={loading}
            >
              {loading ? 'Downloading...' : 'Download Excel Report'}
            </Button>
          </div>

          {/* INDIVIDUAL SCORES */}
          <div className="space-y-6">
            {/* Carbon */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Carbon Impact Score</span>
                <span className={getScoreColor(assessment.carbonScore)}>
                  {Math.round(assessment.carbonScore)}/100
                </span>
              </div>
              <Progress value={assessment.carbonScore} />
            </div>

            {/* Resource */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">
                  Resource Efficiency Score
                </span>
                <span className={getScoreColor(assessment.resourceScore)}>
                  {Math.round(assessment.resourceScore)}/100
                </span>
              </div>
              <Progress value={assessment.resourceScore} />
            </div>

            {/* Social */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Social Impact Score</span>
                <span className={getScoreColor(assessment.socialScore)}>
                  {Math.round(assessment.socialScore)}/100
                </span>
              </div>
              <Progress value={assessment.socialScore} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RECOMMENDATIONS CARD */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold">Recommendations</h3>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {Array.isArray(assessment.recommendations) &&
              assessment.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>{rec}</span>
                </li>
              ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
