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
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...headers,
    },
    method,
  };
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
