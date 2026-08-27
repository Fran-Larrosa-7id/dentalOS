import { environment } from './environment.prod';

describe('production environment', () => {
  it('uses the public GitHub Pages base URL for QR codes', () => {
    expect(environment.publicAppUrl).toBe('https://fran-larrosa-7id.github.io/dentalOS');
  });
});
