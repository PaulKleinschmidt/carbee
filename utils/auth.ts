export const login = async (
  username: string,
  password: string
): Promise<{
  current_user: any;
  access_token: any;
  accessToken: string;
}> => {
  return fetch('/api/auth/signin', {
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
