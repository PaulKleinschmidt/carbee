import Router from 'next/router';

export async function apiGet<T>(url: string): Promise<T> {
  return fetch(url).then((res) => {
    if (res.ok) {
      return res.json();
    } else if (res.status === 501) {
      Router.push('/login');
    }

    return Promise.reject(res);
  });
}
