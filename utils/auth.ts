export const login = async (
  username: string,
  password: string
): Promise<{ accessToken: string }> => {
  return fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  }).then((res) => res.json());
};
