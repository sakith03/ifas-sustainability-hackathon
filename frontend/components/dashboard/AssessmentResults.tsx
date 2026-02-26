'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface Assessment {
  id?: string;  // Add id field
  carbonScore: number;
  resourceScore: number;
  socialScore: number;
  totalScore: number;
  recommendations: string[];
}

interface AssessmentResultsProps {
  assessment: Assessment;
}

export default function AssessmentResults({ assessment }: AssessmentResultsProps) {
  const getScoreColor = (score: number) => {
    // Handle NaN or invalid scores
    if (isNaN(score) || score === null || score === undefined) {
      return 'text-gray-600';
    }
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    // Handle NaN or invalid scores
    if (isNaN(score) || score === null || score === undefined) {
      return 'Calculating...';
    }
    if (score >= 70) return 'Excellent';
    if (score >= 40) return 'Good';
    return 'Needs Improvement';
  };

  // Safe score display function
  const displayScore = (score: number) => {
    if (isNaN(score) || score === null || score === undefined) {
      return '—';
    }
    return Math.round(score);
  };

  const downloadReport = async () => {
    try {
      // Check if assessment has an ID
      if (!assessment.id) {
        alert('Assessment ID not found. Cannot download report.');
        console.error('Assessment object:', assessment);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(
        `${apiUrl}/business/assessments/${assessment.id}/download`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Download failed:', errorText);
        throw new Error(`Failed to download report: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sustainability-report-${assessment.id}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download report:', error);
      alert(`Could not download report. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Debug: Log assessment data
  console.log('Assessment data:', assessment);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
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
              {displayScore(assessment.totalScore)}
            </div>
            <p className="text-xl mt-2">
              {getScoreLabel(assessment.totalScore)}
            </p>
          </div>

          {/* INDIVIDUAL SCORES */}
          <div className="space-y-6">
            {/* Carbon Impact Score */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Carbon Impact Score</span>
                <span className={getScoreColor(assessment.carbonScore)}>
                  {displayScore(assessment.carbonScore)}/100
                </span>
              </div>
              <Progress value={assessment.carbonScore || 0} />
            </div>

            {/* Resource Efficiency Score */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Resource Efficiency Score</span>
                <span className={getScoreColor(assessment.resourceScore)}>
                  {displayScore(assessment.resourceScore)}/100
                </span>
              </div>
              <Progress value={assessment.resourceScore || 0} />
            </div>

            {/* Social Impact Score */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Social Impact Score</span>
                <span className={getScoreColor(assessment.socialScore)}>
                  {displayScore(assessment.socialScore)}/100
                </span>
              </div>
              <Progress value={assessment.socialScore || 0} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RECOMMENDATIONS */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold">Recommendations</h3>
        </CardHeader>
        <CardContent>
          {assessment.recommendations && assessment.recommendations.length > 0 ? (
            <ul className="space-y-3">
              {assessment.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-green-600 mr-2 flex-shrink-0">✓</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recommendations available.</p>
          )}
        </CardContent>
      </Card>

      {/* DOWNLOAD BUTTON */}
      <div className="flex justify-center">
        <Button
          onClick={downloadReport}
          variant="outline"
          disabled={!assessment.id}
        >
          {assessment.id ? 'Download Excel Report' : 'Report Not Available'}
        </Button>
      </div>
    </div>
  );
}