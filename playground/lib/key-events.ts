import * as sword from '../../src/main'

export const addKeyEvents = () => {
  // Add event for random impulses
  document.addEventListener('keydown', (event) => {
    switch (event.key.toLowerCase()) {
    case 'i':
      const count = sword.dynamicCount()
      const magnitude = 20
      const impulses = new Float32Array(count * 4)

      for (let i = 0, j = 0; j < count; i += 4, j += 1) {
        impulses[i + 0] = j
        impulses[i + 1] = (Math.random() - 0.5) * magnitude
        impulses[i + 2] = (Math.random() - 0.5) * magnitude
        impulses[i + 3] = (Math.random() - 0.5) * magnitude
      }

      sword.applyImpulses(impulses)
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
