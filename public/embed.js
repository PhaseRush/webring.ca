(function () {
  var el = document.querySelector('div[data-webring="ca"]')
  if (!el) return
  if (el.shadowRoot) return

  var slug = el.getAttribute('data-member')
  var valid = slug && /^[a-z0-9-]+$/.test(slug)

  var BASE = 'https://webring.ca'

  var LEAF_SVG =
    '<svg viewBox="2840 300 3920 4230" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="width:1.1em;height:1.1em;vertical-align:-0.15em;fill:currentColor">' +
    '<path d="M4890 4430L4845 3567A95 95 0 0 1 4956 3469L5815 3620 5699 3300A65 65 0 0 1 5719 3227L6660 2465 6448 2366A65 65 0 0 1 6414 2287L6600 1715 6058 1830A65 65 0 0 1 5985 1792L5880 1545 5457 1999A65 65 0 0 1 5346 1942L5550 890 5223 1079A65 65 0 0 1 5132 1052L4800 400 4468 1052A65 65 0 0 1 4377 1079L4050 890 4254 1942A65 65 0 0 1 4143 1999L3720 1545 3615 1792A65 65 0 0 1 3542 1830L3000 1715 3186 2287A65 65 0 0 1 3152 2366L2940 2465 3881 3227A65 65 0 0 1 3901 3300L3785 3620 4644 3469A95 95 0 0 1 4755 3567L4710 4430Z"/>' +
    '</svg>'

  var STYLES =
    ':host{display:block;font-family:var(--webring-font,system-ui,-apple-system,BlinkMacSystemFont,sans-serif);font-size:var(--webring-size,0.8rem);color:var(--webring-color,inherit)}' +
    'nav{display:flex;align-items:center;justify-content:center;gap:0.75em;padding:0.5em 1em;background:var(--webring-bg,rgba(128,128,128,0.06));border:1px solid var(--webring-border,rgba(128,128,128,0.2));border-radius:var(--webring-radius,6px)}' +
    'a{color:var(--webring-color,inherit);text-decoration:none;transition:color 0.2s ease;white-space:nowrap}' +
    'a:hover{color:var(--webring-accent,#AF272F)}' +
    '.center{display:inline-flex;align-items:center;gap:0.3em}'

  function render(root) {
    var style = document.createElement('style')
    style.textContent = STYLES
    root.appendChild(style)

    var nav = document.createElement('nav')
    nav.setAttribute('aria-label', 'webring.ca navigation')

    if (valid) {
      var prev = document.createElement('a')
      prev.href = BASE + '/prev/' + slug
      prev.target = '_top'
      prev.rel = 'noopener'
      prev.textContent = '\u2190 Prev'
      nav.appendChild(prev)
    }

    var center = document.createElement('a')
    center.href = BASE
    center.target = '_top'
    center.rel = 'noopener'
    center.className = 'center'
    center.innerHTML = LEAF_SVG + ' webring.ca'
    nav.appendChild(center)

    if (valid) {
      var next = document.createElement('a')
      next.href = BASE + '/next/' + slug
      next.target = '_top'
      next.rel = 'noopener'
      next.textContent = 'Next \u2192'
      nav.appendChild(next)
    }

    root.appendChild(nav)
  }

  if (!valid) {
    console.warn('webring.ca embed: missing or invalid data-member attribute')
  }

  if (el.attachShadow) {
    var shadow = el.attachShadow({ mode: 'open' })
    render(shadow)
  } else {
    render(el)
  }
})()
