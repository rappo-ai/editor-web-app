export default function apiBuilder(
  apiEndpoint,
  {
    headers = { 'Content-Type': 'application/json' },
    method = 'GET',
    body = false,
    token = '',
  } = {},
) {
  const domain = 'http://localhost:3000';
  const apiPrefix = '/api';
  const url = `${domain}${apiPrefix}${apiEndpoint}`;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
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
