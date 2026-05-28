import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RecordsResponse } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class RecordService {
  private readonly apiUrl = `${environment.apiUrl}/records`;

  constructor(private http: HttpClient) {}

  getRecords(delayMs: number = 0): Observable<RecordsResponse> {
    let params = new HttpParams();
    if (delayMs > 0) {
      params = params.set('delay', delayMs.toString());
    }
    return this.http.get<RecordsResponse>(this.apiUrl, { params });
  }
}
