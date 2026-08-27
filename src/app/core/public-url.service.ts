import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PublicUrlService {
  qrUrl(token: string): string {
    return `${environment.publicAppUrl.replace(/\/$/, '')}/q/${token}`;
  }
}
