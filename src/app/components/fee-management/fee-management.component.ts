import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';

// Fee category demo data
interface Fee {
  name: string;
  amount: number;
  description: string;
}
interface FeeCategoryGroup {
  category: string;
  fees: Fee[];
}

@Component({
  selector: 'app-fee-management',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './fee-management.component.html',
  styleUrls: ['./fee-management.component.scss']
})
export class FeeManagementComponent implements OnInit {
  feeCategories: FeeCategoryGroup[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    // Demo data
    this.feeCategories = [
      {
        category: 'Registration Fees',
        fees: [
          { name: 'Initial Registration', amount: 100, description: 'Fee charged for new customers at onboarding.' },
          { name: 'Annual Renewal', amount: 85, description: 'Fee charged annually for account renewal.' }
        ]
      },
      {
        category: 'Service Charges',
        fees: [
          { name: 'Account Statement', amount: 25, description: 'Fee for account statement requests.' },
          { name: 'Cheque Book', amount: 40, description: 'Fee for ordering additional cheque books.' },
        ]
      },
      {
        category: 'Loan Processing',
        fees: [
          { name: 'Loan Application', amount: 150, description: 'Fee for processing loan applications.' },
          { name: 'Late Payment Penalty', amount: 65, description: 'Penalty for late loan repayments.' },
        ]
      }
    ];
  }

  exportToCSV(): void {
    // Demo message, would export actual CSV in real app
    if (!this.feeCategories || this.feeCategories.length === 0) {
      this.errorMessage = 'No data to export.';
      return;
    }
    this.errorMessage = 'Exported (demo).';
  }
}
