import { PublicUrlService } from './public-url.service';

describe('PublicUrlService', () => {
  it('keeps the token separate and builds the public QR URL', () => {
    expect(new PublicUrlService().qrUrl('abc123')).toBe('http://localhost:4200/q/abc123');
  });
});
