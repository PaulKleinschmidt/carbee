# Carbee

This repo houses my submission for Curbee's take home assessment. This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Environment Variables

You will need to set some environment variables in `.env.local`. See `.env.sample` for some example values. `JWT_SECRET` is a random string used by next-auth. You can generate a good value for it by running the following command.

```bash
openssl rand -base64 32
```

### Running the app locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app running.

## Technologies Used

| Tech           | Description                                            |
| -------------- | ------------------------------------------------------ |
| Next.js        | Frontend Framework                                     |
| TypeScript     | Static Type Checking                                   |
| Zod            | Schema declaration and validation                      |
| Next Auth      | Authentication library                                 |
| Tailwind       | CSS Framework                                          |
| Classnames     | Utility for conditionally joining class names together |
| React-toastify | Notifications                                          |

## Reflections

1. Did you run into any “gotchas” along the way? If so, what were they and how did you address them?
2. How did you handle forms? In a largely form-driven project, would you do anything differently? If so, what?
3. How did you handle authorization? In your ideal FE/BE scenario, what auth strategy would you use?
4. Is there anything you’d like to share about your project prior to my evaluating it?
5. How long did you spend on this exercise? If you had unlimited more time to spend on this, how would you spend it and how would you prioritize each item?
