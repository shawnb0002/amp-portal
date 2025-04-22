import * as React from "react"
import { useCallbackRef } from "@radix-ui/react-use-callback-ref"
import { useEffectEvent } from "./useEffectEvent"

export function useControllableState<T>(params: {
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
}) {
  const { value: controlledValue, defaultValue, onChange } = params
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue
  const handleChange = useEffectEvent(onChange || (() => {}))

  const setValue = useCallbackRef((nextValue: T) => {
    if (!isControlled) {
      setUncontrolledValue(nextValue)
    }
    handleChange(nextValue)
  })

  return [value, setValue] as const
}
