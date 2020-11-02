# Expense manager

Original document with listed plans
[here](https://docs.google.com/document/d/1tanCg35KLWazBiI08KAuBaAnJoiRlndMLvfvbD0KvGU/edit#).
Trello tracking progress [here](https://trello.com/b/0WCaG9Go/expense-manager).

## Firebase integration

Using firebase for user authentification and firestone database. These links cover all the
information: [Firebase web codelab](https://codelabs.developers.google.com/codelabs/firebase-web/#8)
[Firebase setup](https://firebase.google.com/docs/web/setup)

## Deploying

Be sure to have node version `>= 8.11`, because of [this
issue](https://github.com/zeit/now/issues/2711).

1. Download [now](https://zeit.co/download) and create an account
2. Run `yarn deploy`

_We use fixed version of next, because deploying with firebase works only after version 9.0.4, but breaks after 9.0.6.
[issue1](https://github.com/zeit/next.js/issues/6073#issuecomment-467589586)
[issue2](https://github.com/zeit/next.js/issues/7894)_

## Conventions and reminders

1. **Lower case filenames** - Nextjs uses predefined routing _(pages directory is automatically
   routed)_ and the url name must match the page filename. I want URL parts _(e.g. /login)_ to be
   lowercased, and for consistency all files should start with lowercase.
2. **CI tests** - Currently, there are none. Tutorial [how to setup cypress for
   CI](https://docs.cypress.io/guides/guides/continuous-integration.html#Boot-your-server) _(also
   covers, how to set it up locally, which we use right now)._

## Upgrade deps

Run `yarn upgrade --latest`

## Cloud storage

In order to download files from cloud storage from web you need to configure CORS. See the
documentation here https://firebase.google.com/docs/storage/web/download-files?authuser=0#cors_configuration.

We are using commited `cors.json` file for this matter.
Make sure you are logged in. You can use `gcloud auth login` to log in.
