import { stripSensitiveMetadata } from './strip-sensitive';

describe('stripSensitiveMetadata', () => {
  it('removes credential-like keys at any depth', () => {
    const cleaned = stripSensitiveMetadata({
      rating: 8,
      nested: { refreshToken: 'hidden', label: 'anime' },
    });

    expect(cleaned).toEqual({ rating: 8, nested: { label: 'anime' } });
  });
});
