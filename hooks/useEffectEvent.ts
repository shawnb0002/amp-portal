import { useCallback, useRef } from 'react'

// Polyfill for React's experimental useEffectEvent
export function useEffectEvent<TCallback extends (...args: never[]) => unknown>(
  callback: TCallback
): TCallback {
  const ref = useRef<TCallback>(callback)
  
  ref.current = callback
  
  return useCallback((...args: Parameters<TCallback>) => {
    return ref.current.apply(null, args)
  }, []) as TCallback
}
