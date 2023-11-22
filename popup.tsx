import { useState } from "react"

import type { RequestBody, ResponseBody } from "~background/messages/clean"
import { sendToBackground } from "~node_modules/@plasmohq/messaging"
import { sleep } from "~utils/sleep"

function IndexPopup() {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)

    let hasNext = true

    while (hasNext) {
      try {
        const response = await sendToBackground<RequestBody, ResponseBody>({
          name: "clean"
        })

        hasNext = response.hasNext
      } catch (error) {
        hasNext = false
      }

      if (hasNext) {
        await sleep(1000)
      }
    }

    setIsLoading(false)
  }

  return (
    <div
      style={{
        padding: 16,
        width: 100
      }}>
      <button
        disabled={isLoading}
        onClick={handleClick}
        style={{ width: "100%" }}>
        {isLoading ? "loading" : "clean"}
      </button>
    </div>
  )
}

export default IndexPopup
