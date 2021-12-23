# Expense manager

[![Continuous Build](https://github.com/Siegrift/expense-manager/actions/workflows/main.yml/badge.svg)](https://github.com/Siegrift/expense-manager/actions/workflows/main.yml)

A hobby project for tracking expenses and much more. Built mainly for my personal usage, but its open for everyone. The
transaction data lives on my firebase project and is **not** encrypted. If you have problems with this, consider
deploying your own fork with a custom firebase instance.

## Run

1. Follow the [initial setup](#initial-setup) (needed only once)
2. Run `yarn dev`
3. (Optional) Run tests - `yarn test:unit:watch` and `yarn test:e2e:open`

## Initial setup

1. [Create a firebase project](#create-a-new-firebase-instance) for development and staging (e2e tests) - You can name
   it `expense manager - dev` and `expense manager - staging`.
2. Create credentials files - A credentials file is needed to connect the application to the firebase instance created
   in previous step. You need to create two files, `.env-dev` and `.env-staging`. Fill the credentials file according to
   `.env-template`.
3. [Configure cloud storage CORS](#configure-cloud-storage-cors) - This is needed for firebase storage to work.
4. Create a `serviceAccount.json` - This file is needed for e2e tests. Follow
   [cypress-firebase setup](https://github.com/prescottprue/cypress-firebase#setup) for information how to obtain it.
   Use the staging project.
5. Install `node` and `yarn` - Use node version >=16.
6. Run `yarn` - Which downloads all the dependencies.

### Create a new firebase instance

We use firebase for user authentication, database and file storage. Follow the
[firebase web codelab](https://codelabs.developers.google.com/codelabs/firebase-web/#2) and adapt the naming of the
project accordingly.

### Configure cloud storage CORS

In order to download files from cloud storage from web you need to configure CORS. See the documentation here
https://firebase.google.com/docs/storage/web/download-files?authuser=0#cors_configuration.

We are using committed `cors.json` file for this matter. Make sure you are logged in. You can use `gcloud auth login` to
log in.

## Conventions and reminders

1. **Lower case filenames** - NextJs uses predefined routing _(pages directory is automatically routed)_ and the url
   name must match the page filename. I want URL parts _(e.g. /login)_ to be lowercased, and for consistency all files
   should start with lowercase.
2. **Desktop first, but mobile friendly** - The app is intended to work as a web app, but also as a PWA and should be
   mobile friendly. It also works in offline mode thanks to service worker and
   [firestore offline capabilities](https://firebase.google.com/docs/firestore/manage-data/enable-offline).

## Deployment

1. Download [vercel](https://vercel.com/cli) and create an account
2. Create new Firebase project according to Firebase integration section
3. Create `.env-prod` file with the same constants names as in `.env-template` and set Firebase constants to specific
   values from your Firebase project
4. Run `yarn deploy`

## Contribution

The project is open for contributions and feedback. Feel free to create an issue or a PR.

### Issue tracking and prioritization

Trello board for issue tracking can be found [here](https://trello.com/b/0WCaG9Go/expense-manager). Tough, you need to
have access to this page to open it.
