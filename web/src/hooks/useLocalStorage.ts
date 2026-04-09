import { useCallback, useEffect, useState } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  onQuotaExceeded?: () => void,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item) as T)
      }
    } catch {
      // JSON.parse error or access error — ignore, use initialValue
    }
    setIsHydrated(true)
  }, [key])

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window === 'undefined') return
      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (err) {
        // QuotaExceededError — notify caller so it can show a toast
        const isQuota =
          err instanceof DOMException &&
          (err.name === 'QuotaExceededError' ||
            err.name === 'NS_ERROR_DOM_QUOTA_REACHED')
        if (isQuota) {
          onQuotaExceeded?.()
        }
      }
    },
    [key, storedValue, onQuotaExceeded],
  )

  // Cross-tab storage sync: when another tab writes the same key, update state
  useEffect(() => {
    function handleStorageEvent(e: StorageEvent) {
      if (e.key !== key || e.storageArea !== window.localStorage) return
      if (e.newValue === null) {
        setStoredValue(initialValue)
        return
      }
      try {
        setStoredValue(JSON.parse(e.newValue) as T)
      } catch {
        // Ignore malformed values from other tabs
      }
    }
    window.addEventListener('storage', handleStorageEvent)
    return () => window.removeEventListener('storage', handleStorageEvent)
  }, [key, initialValue])

  return [isHydrated ? storedValue : initialValue, setValue]
}
