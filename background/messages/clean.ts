import type { PlasmoMessaging } from "@plasmohq/messaging"

export type RequestBody = never

export type ResponseBody = {
  hasNext: boolean
}

const handler: PlasmoMessaging.MessageHandler<
  RequestBody,
  ResponseBody
> = async (_req, res) => {
  const [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  })

  const [{ result: hasNext }] = await chrome.scripting.executeScript({
    target: { tabId: activeTab.id },
    func: () => {
      const [dropdownMenu, next] =
        window.document.querySelectorAll<HTMLButtonElement>(
          'table [data-toggle="dropdown"]'
        )

      dropdownMenu.click()

      const formElement = document.querySelector<HTMLFormElement>(".button_to")

      if (formElement) {
        formElement.submit()
      }

      return next != null
    }
  })

  res.send({ hasNext })
}

export default handler
