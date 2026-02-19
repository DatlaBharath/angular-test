import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';

// Interfaces for customer repayment and loyalty data
export interface RepaymentData {
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

export interface LoyaltyData {
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  lastUpdated: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  // Mock repayment history for illustrative purposes
  private repayments: RepaymentData[] = [
    { date: '2024-05-01', amount: 200, status: 'paid' },
    { date: '2024-06-01', amount: 200, status: 'pending' },
    { date: '2024-04-01', amount: 200, status: 'paid' },
    { date: '2024-03-01', amount: 180, status: 'paid' },
    { date: '2024-02-01', amount: 150, status: 'overdue' }
  ];

  // Mock loyalty data
  private loyalty: LoyaltyData = {
    points: 1150,
    tier: 'Gold',
    lastUpdated: '2024-06-13'
  };

  constructor() {}

  /**
   * Returns repayment history for a customer by ID.
   * Simulates loading with delay. Returns error if not found.
   */
  getRepaymentHistory(customerId: string): Observable<RepaymentData[]> {
    if (!customerId) {
      return throwError(() => new Error('Customer ID is required')).pipe(delay(300));
    }
    // Return mock data
    return of(this.repayments).pipe(
      delay(200),
      catchError(err => throwError(() => new Error('Failed to fetch repayment data: ' + err.message)))
    );
  }

  /**
   * Returns loyalty data for a customer by ID.
   * Simulates loading with delay. Returns error if not found.
   */
  getLoyaltyData(customerId: string): Observable<LoyaltyData> {
    if (!customerId) {
      return throwError(() => new Error('Customer ID is required')).pipe(delay(300));
    }
    // Return mock data
    return of(this.loyalty).pipe(
      delay(150),
      catchError(err => throwError(() => new Error('Failed to fetch loyalty data: ' + err.message)))
    );
  }
}
