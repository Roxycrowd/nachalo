const SENSITIVE_KEYS = new Set([
  'accesstoken',
  'refreshtoken',
  'password',
  'passwordhash',
  'token',
  'authorization',
]);

export function stripSensitiveMetadata(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => stripSensitiveMetadata(item));
  }

  if (value && typeof value === 'object') {
    const output: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) {
        continue;
      }
      output[key] = stripSensitiveMetadata(nested);
    }
    return output;
  }

  return value;
}
