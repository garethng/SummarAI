import Browser from 'webextension-polyfill'
import { Theme, BASE_URL } from '@/config'

export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export const isFirefox = navigator.userAgent.indexOf('Firefox') != -1

export const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

export const AppName = 'SummarAI (ChatGPT)'

export function detectSystemColorScheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return Theme.Dark
  }
  return Theme.Light
}

export function getExtensionVersion() {
  return Browser.runtime.getManifest().version
}

// https://platform.openai.com/docs/models/overview
export const availableModels = [
  {
    name: "gpt-3.5-turbo",
    maxTokens: 4096
  },
  {
    name: "gpt-3.5-turbo-16k",
    maxTokens: 16384
  },
  {
    name: "gpt-4",
    maxTokens: 8192
  },
  {
    name: "gpt-4-32k",
    maxTokens: 32768
  },
  {
    name: "text-davinci-003",
    maxTokens: 4097
  }
]

export const changeToast: { type: 'success'; text: string } = {
  text: 'Changes saved',
  type: 'success',
}

export function tabSendMsg(tab) {
  const { id, url } = tab
  if (url.includes(`${BASE_URL}/chat`)) {
    Browser.tabs
      .sendMessage(id, { type: 'CHATGPT_TAB_CURRENT', data: { isLogin: true } })
      .catch(() => {})
  } else {
    Browser.tabs
      .sendMessage(id, { type: 'CHATGPT_TAB_CURRENT', data: { isLogin: false } })
      .catch(() => {})
  }
}

export async function* streamAsyncIterable(stream: ReadableStream) {
  const reader = stream.getReader()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        return
      }
      yield value
    }
  } finally {
    reader.releaseLock()
  }
}