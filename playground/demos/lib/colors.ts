import niceColors from 'nice-color-palettes'

export const randomColor = () => {
  return niceColors[17][Math.floor(Math.random() * 5)]
}
