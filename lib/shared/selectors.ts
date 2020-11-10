import { createSelector } from 'reselect'

import { State } from '../state'

export const currentUserIdSel = (state: State) => state.user?.uid ?? null

export const snackbarNotificationSel = (state: State) => state.notification

export const profileSel = (state: State) => {
  const profiles = Object.values(state.profile)
  return profiles.length >= 1 ? profiles[0] : null
}

export const mainCurrencySel = createSelector(
  profileSel,
  (profile) => profile?.settings.mainCurrency,
)

export const defaultCurrencySel = createSelector(
  profileSel,
  (profile) => profile?.settings.defaultCurrency,
)

export const exchangeRatesSel = createSelector(
  profileSel,
  (profile) => profile?.exchangeRates,
)

export const settingsSel = createSelector(
  profileSel,
  (profile) => profile?.settings,
)

export const signInStatusSel = (state: State) => state.signInStatus

export const transactionsSel = (state: State) => state.transactions

// TODO: use this selector to check if firebase is loaded instead of currentUserIdSel
export const firebaseLoadedSel = createSelector(
  currentUserIdSel,
  (userId) => userId !== null,
)
