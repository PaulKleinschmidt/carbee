import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import cx from 'classnames';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const disabled = !username || !password || submitting;

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setSubmitting(true);

    const result = await signIn('credentials', {
      redirect: false,
      username: username,
      password: password,
    });

    if (result?.error) {
      setError(true);
      setSubmitting(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <main className="flex min-h-screen flex-col text-font-color-primary p-8 bg-background-color-body mx-auto max-w-full md:max-w-xl md:p-24">
      <h1 className="text-3xl mb-4">Login</h1>
      <form className="flex flex-col" onSubmit={onLogin} method="post">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          className="border-2 border-brand-secondary-400 rounded-sm mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="border-2 border-brand-secondary-400 rounded-sm mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          disabled={disabled}
          className={cx(
            'bg-brand-secondary-400 text-background-color-body rounded-sm shadow-lg p-1 transition-all',
            disabled && 'bg-gray-300'
          )}
          type="submit"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
