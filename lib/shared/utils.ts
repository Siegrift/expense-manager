import Router from 'next/router'

export const delay = (ms: number) => new Promise((res) => setTimeout(res, 1000))

export const redirectTo = (target: string) => {
  Router.push(target)
}

export function downloadFile(filename: string, text: string) {
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
  )
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export function isValidDate(date: unknown) {
  return date instanceof Date && !isNaN(date as any)
}