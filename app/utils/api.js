export default function apiBuilder(
  apiEndpoint,
  {
    headers = { 'Content-Type': 'application/json' },
    method = 'GET',
    body = false,
    accessToken = '',
  } = {},
) {
  const domain = window.location.origin;
  const apiPrefix = '/api/v1';
  const url = `${domain}${apiPrefix}${apiEndpoint}`;
  const options = {
    credentials: 'same-origin', // for sending cookies
    headers: {
      ...headers,
    },
    method,
  };
  if (accessToken) {
    options.headers.Authorization = `Bearer ${accessToken}`;
  }
  if (body) {
    Object.assign(options, {
      body: JSON.stringify(body),
    });
  }
  return {
    url,
    options,
  };
}
