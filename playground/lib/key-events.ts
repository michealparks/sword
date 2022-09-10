import * as sword from '../../src/main'

export const addKeyEvents = (ids: Uint16Array, magnitude = 5) => {
  // Add event for random impulses
  document.addEventListener('keydown', (event) => {
    switch (event.key.toLowerCase()) {
    case 'i':
      const impulses = new Float32Array(ids.length * 3)

      for (let i = 0, j = 0, l = ids.length; i < l; i += 1, j += 3) {
        impulses[j + 0] = (Math.random() - 0.5) * magnitude
        impulses[j + 1] = (Math.random() - 0.5) * magnitude
        impulses[j + 2] = (Math.random() - 0.5) * magnitude
      }

      sword.applyImpulses(new Uint16Array(ids), impulses)
      break

    case 'd':
      for (let i = 0, l = ids.length; i < l / 2; i += 1) {
        sword.disableBody(ids[i])
      }
      break

    case 'p':
      if (sword.running()) {
        sword.pause()
      } else {
        sword.run()
      }
    }
  })
}
