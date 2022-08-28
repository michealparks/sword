type Listener = (args: unknown) => void
type Events = 'bodiesLoaded'

const events = new Map<string, Set<Listener>>()
events.set('bodiesLoaded', new Set())

/**
 * Registers an event listener.
 *
 * @param event The event name.
 * @param listener A callback that fires when the event is triggered.
 */
export const on = (event: Events, listener: Listener) => {
  events.get(event)!.add(listener)
}

export const off = (event: Events, listener: Listener) => {
  events.get(event)!.delete(listener)
}

export const once = (event: Events, listener: Listener) => {
  const fn = (data: unknown) => {
    listener(data)
    off(event, fn)
  }
  events.get(event)!.add(fn)
}

export const emit = (event: Events, data?: unknown) => {
  const listeners = events.get(event)!

  for (const listener of listeners) {
    listener(data)
  }
}
