# Expense manager

Original document with listed plans
[here](https://docs.google.com/document/d/1tanCg35KLWazBiI08KAuBaAnJoiRlndMLvfvbD0KvGU/edit#).
Trello tracking progress [here](https://trello.com/b/0WCaG9Go/expense-manager).

## Firebase integration

Using firebase for user authentification and firestone database. These links
cover all the information:
[Firebase web codelab](https://codelabs.developers.google.com/codelabs/firebase-web/#8)
[Firebase setup](https://firebase.google.com/docs/web/setup)

## Deploying

1. Download [now](https://zeit.co/download) and create an account
2. Run `yarn deploy`

_We use canary version of next, because deploying with firebase works only after
version 9.0.4, which is at this time in canary. [Reference
link](https://github.com/zeit/next.js/issues/6073#issuecomment-467589586)_

## Upgrade deps

Run `yarn upgrade --latest`
