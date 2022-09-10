type Listener = (args: unknown) => void
type Events = ''

const events = new Map<string, Listener[]>()

/**
 * Registers an event listener.
 *
 * @param event The event name.
 * @param listener A callback that fires when the event is triggered.
 */
export const on = (event: Events, listener: Listener) => {
  events.get(event)!.push(listener)
}

export const off = (event: Events, listener: Listener) => {
  const channel = events.get(event)!
  channel.splice(channel.indexOf(listener), 1)
}

export const once = (event: Events, listener: Listener) => {
  const fn = (data: unknown) => {
    listener(data)
    off(event, fn)
  }

  events.get(event)!.push(fn)
}

export const emit = (event: Events, data?: unknown) => {
  const channel = events.get(event)!

  for (let i = 0, l = channel.length; i < l; i += 1) {
    channel[i](data)
  }
}
