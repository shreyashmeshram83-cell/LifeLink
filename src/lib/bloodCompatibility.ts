import type { BloodGroup } from '@/types';

const compatibility: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'],
};

export function canDonateTo(donorGroup: BloodGroup, recipientGroup: BloodGroup): boolean {
  return compatibility[donorGroup]?.includes(recipientGroup) ?? false;
}

export function compatibleDonorGroups(recipientGroup: BloodGroup): BloodGroup[] {
  const all: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  return all.filter((g) => canDonateTo(g, recipientGroup));
}
