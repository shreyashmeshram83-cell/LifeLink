import type { Donor, BloodGroup } from '@/types';
import { canDonateTo } from './bloodCompatibility';

export interface MatchedDonor extends Donor {
  matchScore: number;
  matchReasons: string[];
}

export function calculateMatchScore(donor: Donor, recipientGroup: BloodGroup): MatchedDonor {
  const reasons: string[] = [];

  const compatible = canDonateTo(donor.bloodGroup, recipientGroup);
  let score = 0;

  if (compatible) {
    score += 40;
    reasons.push('Blood type compatible');
  } else {
    return { ...donor, matchScore: 0, matchReasons: ['Incompatible blood type'] };
  }

  if (donor.availability === 'Available') {
    score += 25;
    reasons.push('Currently available');
  } else {
    score -= 10;
    reasons.push('Currently unavailable');
  }

  if (donor.distanceKm <= 3) {
    score += 20;
    reasons.push(`Very close (${donor.distanceKm} km)`);
  } else if (donor.distanceKm <= 5) {
    score += 15;
    reasons.push(`Nearby (${donor.distanceKm} km)`);
  } else if (donor.distanceKm <= 8) {
    score += 8;
    reasons.push(`Within range (${donor.distanceKm} km)`);
  } else {
    score += 2;
    reasons.push(`Far (${donor.distanceKm} km)`);
  }

  if (donor.eligible) {
    score += 10;
    reasons.push('Eligible to donate');
  } else {
    score -= 15;
    reasons.push('Recently donated — not eligible');
  }

  score += Math.round(donor.reliabilityScore * 0.05);
  if (donor.reliabilityScore >= 90) reasons.push('High response reliability');

  score = Math.max(0, Math.min(100, score));

  return { ...donor, matchScore: score, matchReasons: reasons };
}

export function matchDonors(allDonors: Donor[], recipientGroup: BloodGroup): MatchedDonor[] {
  return allDonors
    .map((d) => calculateMatchScore(d, recipientGroup))
    .filter((d) => d.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function maskName(name: string): string {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0]} ${parts[1][0]}.`;
  }
  return `${name[0]}.`;
}
