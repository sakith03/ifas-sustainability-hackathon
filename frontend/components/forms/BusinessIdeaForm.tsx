'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface FormData {
  name: string;
  description: string;
  sector: string;
  carbonFootprint: number;
  waterUsage: number;
  wasteGenerated: number;
  renewableEnergy: boolean;
  jobsCreated: number;
  communityImpact: number;
}

export default function BusinessIdeaForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    sector: '',
    carbonFootprint: 0,
    waterUsage: 0,
    wasteGenerated: 0,
    renewableEnergy: false,
    jobsCreated: 0,
    communityImpact: 5,
  });

  const updateField = (field: keyof FormData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Business Sustainability Assessment</h2>
        <p className="text-sm text-gray-600">Step {step} of 3</p>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Business Name</label>
              <Input
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="E.g., Green Energy Solutions"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                className="w-full border rounded-md p-2"
                rows={4}
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe your business idea..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sector</label>
              <select
                className="w-full border rounded-md p-2"
                value={formData.sector}
                onChange={(e) => updateField('sector', e.target.value)}
              >
                <option value="">Select sector</option>
                <option value="Renewable Energy">Renewable Energy</option>
                <option value="Transportation">Transportation</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Technology">Technology</option>
              </select>
            </div>
            <Button onClick={() => setStep(2)} className="w-full">Next</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Estimated Carbon Footprint (kg CO2/year)
              </label>
              <Input
                type="number"
                value={formData.carbonFootprint}
                onChange={(e) => updateField('carbonFootprint', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Water Usage (liters/year)
              </label>
              <Input
                type="number"
                value={formData.waterUsage}
                onChange={(e) => updateField('waterUsage', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Waste Generated (kg/year)
              </label>
              <Input
                type="number"
                value={formData.wasteGenerated}
                onChange={(e) => updateField('wasteGenerated', Number(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.renewableEnergy}
                onChange={(e) => updateField('renewableEnergy', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium">Using Renewable Energy</label>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setStep(1)} variant="outline">Back</Button>
              <Button onClick={() => setStep(3)} className="flex-1">Next</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Jobs Created
              </label>
              <Input
                type="number"
                value={formData.jobsCreated}
                onChange={(e) => updateField('jobsCreated', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Community Impact (1-10)
              </label>
              <Input
                type="range"
                min="1"
                max="10"
                value={formData.communityImpact}
                onChange={(e) => updateField('communityImpact', Number(e.target.value))}
                className="w-full"
              />
              <p className="text-center text-sm">{formData.communityImpact}</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setStep(2)} variant="outline">Back</Button>
              <Button onClick={handleSubmit} className="flex-1">Submit Assessment</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}