import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';

interface RiskRewardInsight {
  summary: string;
  riskScore: number;
  rewardScore: number;
  recommendation: string;
}

interface RepaymentStatus {
  month: string;
  amount: number;
  status: 'OnTime' | 'Delayed' | 'Missed';
}

interface LoanClosure {
  month: string;
  status: 'Closed' | 'Early' | 'Late';
}

interface ReferralHistory {
  month: string;
  count: number;
}

interface CustomerProfile {
  id: number;
  name: string;
  email: string;
  mobile: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  branch: string;
  status: string;
  loyaltyScore: number;
  referralCount: number;
  referralImpact: number;
  referralHistory: ReferralHistory[];
  repaymentHistory: RepaymentStatus[];
  loanClosures: LoanClosure[];
}

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, NgClass],
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit {
  customers: CustomerProfile[] = [];
  selectedCustomerIdx: number = 0;
  aiInsights: string[] = [];
  highRiskCustomers: any[] = [];
  rewardSuggestions: string[] = [];
  errorMessage: string = '';
  loading: boolean = false;
  insights: RiskRewardInsight | null = null;

  profileFields = [
    { label: 'Name', key: 'name' },
    { label: 'ID', key: 'id' },
    { label: 'Email', key: 'email' },
    { label: 'Mobile', key: 'mobile' },
    { label: 'Branch', key: 'branch' },
    { label: 'Status', key: 'status' },
    { label: 'Risk Level', key: 'riskLevel' }
  ];

  ngOnInit() {
    // Demo customers, client would fetch from API/service
    this.customers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '9876543210',
        riskLevel: 'Low',
        branch: 'Downtown',
        status: 'Active',
        loyaltyScore: 86,
        referralCount: 9,
        referralImpact: 18,
        referralHistory: [
          { month: 'Jan', count: 2 },
          { month: 'Feb', count: 1 },
          { month: 'Mar', count: 3 },
        ],
        repaymentHistory: [
          { month: 'Jan', amount: 1000, status: 'OnTime' },
          { month: 'Feb', amount: 950, status: 'Delayed' },
          { month: 'Mar', amount: 1100, status: 'OnTime' },
        ],
        loanClosures: [
          { month: 'Jan', status: 'Closed' },
          { month: 'Feb', status: 'Late' },
        ]
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@branch.com',
        mobile: '9123456780',
        riskLevel: 'Moderate',
        branch: 'East Side',
        status: 'Active',
        loyaltyScore: 74,
        referralCount: 2,
        referralImpact: 6,
        referralHistory: [
          { month: 'Jan', count: 1 },
          { month: 'Feb', count: 0 },
          { month: 'Mar', count: 1 },
        ],
        repaymentHistory: [
          { month: 'Jan', amount: 890, status: 'OnTime' },
          { month: 'Feb', amount: 910, status: 'Missed' },
          { month: 'Mar', amount: 950, status: 'Delayed' },
        ],
        loanClosures: [
          { month: 'Jan', status: 'Closed' },
          { month: 'Feb', status: 'Early' },
        ]
      },
      {
        id: 3,
        name: 'Luke Brown',
        email: 'luke@branch.com',
        mobile: '9052511230',
        riskLevel: 'High',
        branch: 'South Market',
        status: 'At Risk',
        loyaltyScore: 52,
        referralCount: 0,
        referralImpact: 0,
        referralHistory: [],
        repaymentHistory: [
          { month: 'Jan', amount: 1200, status: 'Missed' },
          { month: 'Feb', amount: 900, status: 'Missed' },
          { month: 'Mar', amount: 920, status: 'Delayed' },
        ],
        loanClosures: [
          { month: 'Jan', status: 'Late' },
        ]
      }
    ];
    this.highRiskCustomers = this.customers.filter(c => c.riskLevel === 'High');
    this.rewardSuggestions = ['Offer loyalty bonus', 'Upgrade membership tier'];
    this.aiInsights = [
      'John Doe displays a loyal repayment pattern, and strong referral engagement.',
      'Jane Smith has occasional delays but closes loans early, boosting loyalty.',
      'Luke Brown is at risk, repayment history shows significant delays and misses.'
    ];
    this.generateInsights();
  }

  get customer(): CustomerProfile {
    return this.customers[this.selectedCustomerIdx];
  }

  // Demo: Select another customer
  selectCustomer(idx: number): void {
    if (idx >= 0 && idx < this.customers.length) {
      this.selectedCustomerIdx = idx;
      this.generateInsights();
    }
  }

  generateInsights(): void {
    this.loading = true;
    this.getInsightsFromAIBot()
      .pipe(
        tap((result) => {
          this.insights = result;
          this.errorMessage = '';
        }),
        catchError((err) => {
          this.errorMessage = 'Unable to generate insights at this time. Please try again later.';
          this.insights = null;
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe();
  }

  getInsightsFromAIBot(): Observable<RiskRewardInsight> {
    return of({
      summary: this.customer.name + ' loyalty score: ' + this.customer.loyaltyScore + ' - Risk: ' + this.customer.riskLevel,
      riskScore: Math.floor(Math.random() * 100),
      rewardScore: Math.floor(Math.random() * 100),
      recommendation: 'Monitor repayment trends for risk, reward referrals for loyalty.'
    });
  }

  refreshInsights(): void {
    this.generateInsights();
  }
}
