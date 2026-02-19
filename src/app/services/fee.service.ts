import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Fee {
  id: number;
  name: string;
  amount: number;
  category: string;
  createdAt: string;
}

export interface FeeCategoryGroup {
  category: string;
  fees: Fee[];
}

@Injectable({
  providedIn: 'root',
})
export class FeeService {
  private readonly feesUrl = '/api/fees'; // Should be replaced with actual API endpoint
  
  constructor(private http: HttpClient) {}

  /**
   * Fetch all fee data from the API.
   */
  getFees(): Observable<Fee[]> {
    return this.http.get<Fee[]>(this.feesUrl).pipe(
      catchError(this.handleError<Fee[]>('getFees', []))
    );
  }

  /**
   * Fetch latest fee data by most recent date (mock demo to simulate latest; should filter based on API in real use).
   */
  getLatestFees(limit: number = 5): Observable<Fee[]> {
    return this.getFees().pipe(
      map(fees => fees
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, limit)
      )
    );
  }

  /**
   * Group fees by their category.
   */
  groupFeesByCategory(): Observable<FeeCategoryGroup[]> {
    return this.getFees().pipe(
      map(fees => {
        const groupMap = new Map<string, Fee[]>();
        fees.forEach(fee => {
          if (!groupMap.has(fee.category)) {
            groupMap.set(fee.category, []);
          }
          groupMap.get(fee.category)!.push(fee);
        });
        return Array.from(groupMap.entries()).map(([category, fees]) => ({ category, fees }));
      })
    );
  }

  /**
   * Handle HTTP operation error.
   * Logs and returns a safe result.
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      // In production, send errors to remote logging infrastructure
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}
