# DJ Vitamin Zee's "DJ Mix Database"

tl;dr The most interesting part of this repo is probably the [Cursor
prompt history](prompt_history.md) which contains all of the prompts
and responses, with screenshots of the iterative progress.

20+ years ago when I took up DJing, I had this idea to write a Mac app
to store information about various mixes/blends/mash-ups that I
liked. Not only would it be useful as a DJ, but it would be a way for
me to learn Objective-C and Xcode. I think I spent a weekend on it at
one point and then it fell by the wayside. As my first foray into
using an AI coding assistant to create a meaningful project,
ressurecting this idea seemed perfect!

This project was built with Cursor and Next.js. It interacts with two
mysql tables -- a Song table and a Mix table. The Song table was
populated by having cursor write a python script to parse an Apple
Music XML playlist export and insert songs into the Song table. See
the the [Cursor prompt history](prompt_history.md) for details.

I created this project with `npx create-next-app@latest`, copy/pasted
[this](https://cursor.directory/optimized-nextjs-typescript-best-practices-modern-ui-ux)
to create the `.cursorrules` file, pointed Cursor to the [official
Next.js documentation](https://nextjs.org/docs) for context, and
Cursor did all the rest. Everything worked and I made no manual edits
to the output.

--------

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
