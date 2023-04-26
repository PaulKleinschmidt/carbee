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

#### Did you run into any “gotchas” along the way? If so, what were they and how did you address them?

Yes! Here's a few things I ran into:

- Pagination - One of the requirements of this project was to implement pagination for the appointment list view. The provided API didn't return any pagination values to indicate whether there were values on the next page or not. I ended up implementing my own `hasNextPage` flag to ensure good a pagination UX (see `utils/api/getAppointments.ts`)
- React Hydration Error - I ran into a React hydration error that ocurred when trying to parse/format dates on the frontend. The solution for this was to do the date formatting inside of a `useEffect` instead of inside the jsx directly.
- Displaying Appointments - I had to get creative with the UI for the cases where some of the data, like appointment start time or complete time, were undefined.

#### How did you handle forms? In a largely form-driven project, would you do anything differently? If so, what?

I just used basic `<input>` and `<form>` html elements along with controlled components to handle forms. I didn't find the need to pull in one of the many React form libraries. In my past experience with form-driven projects, I have found it effective to store form state in React context and use a reducer to manage state updates. I have utilized schema validation libraries like Zod (which I also used in this project) to ensure that only valid data is submitted.

#### How did you handle authorization? In your ideal FE/BE scenario, what auth strategy would you use?

I used [next-auth](https://next-auth.js.org/) to handle authentication. It was my first time using this library. I was originally going to store the JWT from the server in either browser cookies or session storage, but opted use next-auth because it has good community support and comes with good security benefits. The auth flow looks like this:

1. When a user signs in, submit a call to `/api/auth/callback/credentials`
2. On the server, send a request to the modulith API's `/auth/login` endpoint, which returns an access token if the credentials are valid.
3. Next Auth then creates its own JWT which is where the access token from the previous step gets stored. This value is stored in a httpOnly cookie that is not accessible on the client-side.
4. For subsequent API requests, I'm grabbing the access token from the JWT and passing it to the modulith API in the request headers to authenticate the requests. If there is no JWT, then the user is not signed in and gets redirected to the `/login` page.

I noticed that the JWT from the server expires after an amount of time. If I had more time to spend on this project, I would figure out how to sync that expiration time with next auth, but for now you just need to sign in again if the token expires.

In my ideal authentication scenario, I would adopt a similar approach to what I have implemented in this project, which involves storing the JWT results in an httpOnly cookie. Additionally, I would want to support refresh tokens, single sign on, and two factor auth.

#### Is there anything you’d like to share about your project prior to my evaluating it?

Nope!

### How long did you spend on this exercise? If you had unlimited more time to spend on this, how would you spend it and how would you prioritize each item?

I spend about 5 hours total on this project. Most of the extra time was spent configuring next-auth, since I am new to the library. Here is a list of some enhancements I would add to this project, sorted by priority:

- Add the ability to log out and register new users
- Since performance is important in this app, I would like to implement some caching for the client side requests. In the past I have used [React Query](https://tanstack.com/query/v3/) for this.
- As noted previously, I would add some sort of refresh tokens so users aren't forced to sign in when the JWT expires.
- Support different timezones for the availability section.
