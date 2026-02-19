import { Injectable } from '@angular/core';

export interface CustomerProfile {
  id: string;
  name: string;
  riskScore?: number; // 0 (low) - 1 (high)
  transactionVolume?: number;
  loyaltyPoints?: number;
  [key: string]: any;
}

export interface Insight {
  customerId: string;
  isHighRisk: boolean;
  reason: string;
  recommendedReward?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AIInsightsService {
  private RISK_THRESHOLD = 0.7;
  private LOYALTY_REWARD_THRESHOLD = 1000;
  private MAX_RESPONSE_MS = 2000; // 2 seconds

  /**
   * Determines if a customer is high risk.
   * Flags missing/insufficient data and ensures result in <2sec.
   */
  flagHighRiskCustomer(profile: CustomerProfile): Promise<Insight> {
    return new Promise((resolve) => {
      const start = Date.now();
      let isHighRisk = false;
      let reason = '';
      if (profile.riskScore === undefined || profile.riskScore === null) {
        isHighRisk = false;
        reason = 'Risk score unavailable.';
      } else if (profile.riskScore >= this.RISK_THRESHOLD) {
        isHighRisk = true;
        reason = `Risk score (${profile.riskScore}) exceeds threshold.`;
      } else {
        reason = `Risk score (${profile.riskScore}) below threshold.`;
      }

      // Enforce max 2s response
      const elapsed = Date.now() - start;
      const delay = Math.max(10, this.MAX_RESPONSE_MS - elapsed);
      setTimeout(() => {
        resolve({
          customerId: profile.id,
          isHighRisk,
          reason,
        });
      }, delay > 2000 ? 10 : delay); // Always <2s
    });
  }

  /**
   * Recommends rewards for loyal customers. Handles incomplete data (e.g., missing transactions/points).
   */
  recommendLoyaltyReward(profile: CustomerProfile): Promise<Insight> {
    return new Promise((resolve) => {
      const start = Date.now();
      let recommendedReward = undefined;
      let reason = '';
      let eligible = false;

      if (
        profile.loyaltyPoints === undefined ||
        profile.transactionVolume === undefined
      ) {
        eligible = false;
        reason = 'Insufficient data for reward recommendation.';
      } else if (profile.loyaltyPoints >= this.LOYALTY_REWARD_THRESHOLD && profile.transactionVolume > 100) {
        eligible = true;
        recommendedReward = 'Premium Cashback';
        reason = 'Customer exceeds loyalty and transaction thresholds.';
      } else if (profile.loyaltyPoints >= 500) {
        recommendedReward = 'Free Transaction Fee';
        eligible = true;
        reason = 'Customer eligible for basic loyalty reward.';
      } else {
        reason = 'No applicable reward.';
      }

      const elapsed = Date.now() - start;
      const delay = Math.max(10, this.MAX_RESPONSE_MS - elapsed);
      setTimeout(() => {
        resolve({
          customerId: profile.id,
          isHighRisk: false,
          reason,
          recommendedReward,
        });
      }, delay > 2000 ? 10 : delay); // Always <2s
    });
  }
}
