import Router from 'next/router'

export const delay = (ms: number) => new Promise((res) => setTimeout(res, 1000))

export const redirectTo = (target: string) => {
  Router.push(target)
}
