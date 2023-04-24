import Image from 'next/image';
import { Inter } from 'next/font/google';
import { useState } from 'react';
import { login } from '@/utils';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<boolean>(false);

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    login(username, password)
      .then((s) => {
        console.log('TODO: Redirect to /dashboard');
      })
      .catch((e) => setError(true));
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24 text-font-color-primary bg-background-color-body">
      <h1 className="text-xl my-8">Login</h1>
      <form className="flex flex-col" onSubmit={onLogin} method="post">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
