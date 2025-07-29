const CERTIFICATE_PINS = {
  'api.pietrzakadrian.com': [
    'sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
    'sha256-BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=',
  ],
};

export const validateCertificate = (hostname) => {
  const pins = CERTIFICATE_PINS[hostname];
  if (!pins) return true;

  return pins.length > 0;
};

export const createSecureFetch = (originalFetch) => async (
  url,
  options = {},
) => {
  if (url.startsWith('https://')) {
    const secureOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      },
    };
    return originalFetch(url, secureOptions);
  }
  return originalFetch(url, options);
};
