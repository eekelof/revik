const svgs = new Set(['svg', 'circle', 'ellipse', 'line', 'path', 'polygon', 'polyline', 'rect', 'g', 'defs', 'linearGradient', 'radialGradient', 'stop', 'use', 'symbol', 'text', 'tspan', 'tref', 'textPath', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'glyph', 'glyphRef', 'marker', 'metadata', 'missing-glyph', 'pattern', 'switch', 'foreignObject', 'desc', 'title'])
function render(type, props, ...children) {
    if (typeof type === 'function') return type(props, children)
    let e = svgs.has(type) ? document.createElementNS('http://www.w3.org/2000/svg', type) : document.createElement(type)
    for (let [k, v] of Object.entries((props ?? {}))) {
        if (v._rves)
            v = v.value
        // TODO: check recursive nested
        k.startsWith('on') && typeof v === 'function' ? e.addEventListener(k.toLowerCase().substring(2), v)
            : k == 'style' && typeof v === 'object' ? Object.assign(e.style, v)
                : e.setAttribute(k, v)
    }
    e.append(...children.flat(Infinity).map(c => {
        if (c._rves)
            c = c.value
        return c ?? []
    }))
    return e
}
export default function jsx(type, props, ...children) {
    const e = render(type, props, children)
    const rvars = children.flat(Infinity).filter(c => c._rves)
    // TODO: also monitor props, recursive nested
    if (rvars.length > 0) {
        const rve = { e, render: () => render(type, props, children) }
        for (const rvar of rvars) {
            rvar._rves.add(rve)
        }
    }
    return e
}

export function rvar(value) {
    return {
        value,
        _rves: new Set(),
        set: function (value) {
            this.value = value
            for (const rve of this._rves) {
                const n = rve.render()
                rve.e.replaceWith(n)
                rve.e = n
            }
        }
    }
}