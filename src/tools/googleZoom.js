export const smoothZoomIn = (map, max, cnt) => {
  if (cnt >= max + 1) {
    return false
  }

  const z = window.google.maps.event.addListener(map, 'zoom_changed', () => {
    window.google.maps.event.removeListener(z)
    smoothZoomIn(map, max, cnt + 1)
  })
  setTimeout(() => {
    map.setZoom(cnt)
  }, 80)

  return true
}

export const smoothZoomOut = (map, min, cnt) => {
  if (cnt < min) {
    return false
  }

  const z = window.google.maps.event.addListener(map, 'zoom_changed', () => {
    window.google.maps.event.removeListener(z)
    smoothZoomOut(map, min, cnt - 1)
  })
  setTimeout(() => {
    map.setZoom(cnt)
  }, 80)

  return true
}
