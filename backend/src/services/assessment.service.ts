interface AssessmentInput {
    carbonFootprint: number; // kg CO2
    waterUsage: number; // liters
    wasteGenerated: number; // kg
    renewableEnergy: boolean;
    jobsCreated: number;
    communityImpact: number; // 1-10 scale
  }
  
  export class AssessmentService {
    calculateCarbonScore(carbonFootprint: number): number {
      // Lower is better, normalized to 0-100
      if (carbonFootprint < 100) return 100;
      if (carbonFootprint > 10000) return 0;
      return Math.max(0, 100 - (carbonFootprint / 100));
    }
  
    calculateResourceScore(input: AssessmentInput): number {
      let score = 50; // Base score
  
      // Water efficiency
      if (input.waterUsage < 1000) score += 20;
      else if (input.waterUsage < 5000) score += 10;
  
      // Waste management
      if (input.wasteGenerated < 50) score += 20;
      else if (input.wasteGenerated < 200) score += 10;
  
      // Renewable energy bonus
      if (input.renewableEnergy) score += 10;
  
      return Math.min(100, score);
    }
  
    calculateSocialScore(input: AssessmentInput): number {
      let score = 0;
  
      // Job creation
      score += Math.min(40, input.jobsCreated * 5);
  
      // Community impact
      score += input.communityImpact * 6;
  
      return Math.min(100, score);
    }
  
    generateRecommendations(
      carbonScore: number,
      resourceScore: number,
      socialScore: number
    ): string[] {
      const recommendations: string[] = [];
  
      if (carbonScore < 50) {
        recommendations.push('Consider switching to renewable energy sources');
        recommendations.push('Optimize logistics to reduce transportation emissions');
      }
  
      if (resourceScore < 50) {
        recommendations.push('Implement water recycling systems');
        recommendations.push('Develop a waste reduction and recycling program');
      }
  
      if (socialScore < 50) {
        recommendations.push('Create more local employment opportunities');
        recommendations.push('Engage with community stakeholders');
      }
  
      if (recommendations.length === 0) {
        recommendations.push('Maintain current excellent sustainability practices');
        recommendations.push('Consider B-Corp certification');
      }
  
      return recommendations;
    }
  
    async assessBusinessIdea(ideaId: string, input: AssessmentInput) {
      const carbonScore = this.calculateCarbonScore(input.carbonFootprint);
      const resourceScore = this.calculateResourceScore(input);
      const socialScore = this.calculateSocialScore(input);
      const totalScore = (carbonScore + resourceScore + socialScore) / 3;
  
      const recommendations = this.generateRecommendations(
        carbonScore,
        resourceScore,
        socialScore
      );
  
      return {
        carbonScore,
        resourceScore,
        socialScore,
        totalScore,
        recommendations,
      };
    }
  }