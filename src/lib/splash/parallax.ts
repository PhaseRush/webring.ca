export interface Offset {
  x: number
  y: number
}

export function calcOffset(
  mouseX: number,
  mouseY: number,
  viewW: number,
  viewH: number,
  depth: number
): Offset {
  const cx = viewW / 2
  const cy = viewH / 2
  return {
    x: (mouseX - cx) * depth,
    y: (mouseY - cy) * depth,
  }
}

export function initParallax(container: HTMLElement): () => void {
  const layers = container.querySelectorAll<HTMLElement>('[data-depth]')
  let targetX = 0
  let targetY = 0
  let currentX = 0
  let currentY = 0
  let rafId = 0
  const lerp = 0.08

  function onMouseMove(e: MouseEvent) {
    targetX = e.clientX
    targetY = e.clientY
  }

  function update() {
    currentX += (targetX - currentX) * lerp
    currentY += (targetY - currentY) * lerp

    const w = container.clientWidth
    const h = container.clientHeight

    layers.forEach((layer) => {
      const depth = parseFloat(layer.dataset.depth ?? '0')
      const offset = calcOffset(currentX, currentY, w, h, depth)
      layer.style.transform = `translate(${offset.x}px, ${offset.y}px)`
    })

    rafId = requestAnimationFrame(update)
  }

  targetX = container.clientWidth / 2
  targetY = container.clientHeight / 2
  currentX = targetX
  currentY = targetY

  window.addEventListener('mousemove', onMouseMove)
  rafId = requestAnimationFrame(update)

  return function destroy() {
    window.removeEventListener('mousemove', onMouseMove)
    cancelAnimationFrame(rafId)
  }
}
