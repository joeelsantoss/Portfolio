import './style.css'

type SampleImage = {
  id: string
  title: string
  path: string
  description: string
}

type HeadMetrics = {
  contentType: string
  contentLength: number | null
}

type ImageMetrics = {
  width: number
  height: number
  orientation: 'Landscape' | 'Portrait' | 'Square'
  loadTimeMs: number
  transferSize: number | null
  encodedBodySize: number | null
}

const samples: SampleImage[] = [
  {
    id: 'svg-original',
    title: 'Original SVG 1600x1066',
    path: '/images/poster-original.svg',
    description: 'Versio vectorial base, util per comprovar com afecta la mida i el format.',
  },
  {
    id: 'jpg-large',
    title: 'JPEG gran 1600x1066',
    path: '/images/poster-landscape-1600.jpg',
    description: 'Variant de maxima resolucio per a pantalles amples.',
  },
  {
    id: 'jpg-medium',
    title: 'JPEG mitjana 800x533',
    path: '/images/poster-landscape-800.jpg',
    description: 'Mateixa composicio amb menys pes per a carregues mes eficients.',
  },
  {
    id: 'png-small',
    title: 'PNG petita 480x320',
    path: '/images/poster-landscape-480.png',
    description: 'Exemple raster amb resolucio petita i compressio sense perdua.',
  },
  {
    id: 'jpg-portrait',
    title: 'JPEG portrait 900x1200',
    path: '/images/poster-portrait-900.jpg',
    description: 'Versio vertical pensada per comparar orientacio i mida.',
  },
  {
    id: 'png-portrait',
    title: 'PNG portrait 450x600',
    path: '/images/poster-portrait-450.png',
    description: 'Equivalent vertical en PNG amb dimensions reduides.',
  },
]

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('No s\'ha trobat el contenidor principal de l\'aplicacio.')
}

app.innerHTML = `
  <main class="page-shell">
    <section class="hero-panel">
      <div class="hero-copy">
        <p class="eyebrow">HTML + TypeScript + Vite</p>
        <h1>Visor d'imatges amb metadades i impacte en el rendiment</h1>
        <p class="hero-text">
          Cada targeta carrega una variant preparada a <code>public/images</code> i mostra
          dimensions, orientacio, capcaleres HTTP i dades obtingudes amb la Performance API.
        </p>
      </div>

      <div class="summary-grid">
        <article class="summary-card">
          <span class="summary-label">Mostres</span>
          <strong id="summary-count">${samples.length}</strong>
          <p>Variants generades en diferents formats i resolucions.</p>
        </article>
        <article class="summary-card">
          <span class="summary-label">Temps mig</span>
          <strong id="summary-average">Calculant...</strong>
          <p>Mesurat amb <code>performance.now()</code>.</p>
        </article>
        <article class="summary-card">
          <span class="summary-label">Mes lleugera</span>
          <strong id="summary-lightest">Calculant...</strong>
          <p>Segons <code>Content-Length</code> del metode <code>HEAD</code>.</p>
        </article>
      </div>
    </section>

    <section class="gallery" id="gallery">
      ${samples.map(createCardMarkup).join('')}
    </section>
  </main>
`

const summaryAverage = document.querySelector<HTMLElement>('#summary-average')
const summaryLightest = document.querySelector<HTMLElement>('#summary-lightest')

void analyzeSamples()

function createCardMarkup(sample: SampleImage): string {
  return `
    <article class="image-card" id="${sample.id}">
      <div class="image-frame">
        <img class="preview" data-image-id="${sample.id}" alt="${sample.title}" />
        <span class="badge">${sample.path.split('.').pop()?.toUpperCase() ?? 'IMG'}</span>
      </div>

      <div class="card-copy">
        <div class="card-heading">
          <div>
            <p class="card-kicker">Mostra</p>
            <h2>${sample.title}</h2>
          </div>
          <p class="status" data-role="status">Pendents de carrega</p>
        </div>

        <p class="card-description">${sample.description}</p>

        <dl class="stats-list">
          <div>
            <dt>Dimensions</dt>
            <dd data-field="dimensions">Carregant...</dd>
          </div>
          <div>
            <dt>Orientacio</dt>
            <dd data-field="orientation">Carregant...</dd>
          </div>
          <div>
            <dt>Tipus MIME</dt>
            <dd data-field="contentType">Consultant...</dd>
          </div>
          <div>
            <dt>Mida amb HEAD</dt>
            <dd data-field="contentLength">Consultant...</dd>
          </div>
          <div>
            <dt>Temps de carrega</dt>
            <dd data-field="loadTime">Mesurant...</dd>
          </div>
          <div>
            <dt>Mida amb performance</dt>
            <dd data-field="performanceSize">Mesurant...</dd>
          </div>
        </dl>
      </div>
    </article>
  `
}

async function analyzeSamples(): Promise<void> {
  const results = await Promise.all(samples.map((sample) => analyzeSample(sample)))
  updateSummary(results)
}

async function analyzeSample(sample: SampleImage) {
  const card = document.querySelector<HTMLElement>(`#${sample.id}`)

  if (!card) {
    throw new Error(`No s'ha trobat la targeta ${sample.id}.`)
  }

  const status = card.querySelector<HTMLElement>('[data-role="status"]')

  if (status) {
    status.textContent = 'Analitzant...'
  }

  const [headResult, imageResult] = await Promise.allSettled([
    fetchHeadMetrics(sample.path),
    measureImage(sample.id, sample.path),
  ])

  const headMetrics: HeadMetrics =
    headResult.status === 'fulfilled'
      ? headResult.value
      : { contentType: 'No disponible', contentLength: null }

  const imageMetrics =
    imageResult.status === 'fulfilled'
      ? imageResult.value
      : {
          width: 0,
          height: 0,
          orientation: 'Landscape' as const,
          loadTimeMs: 0,
          transferSize: null,
          encodedBodySize: null,
        }

  setField(card, 'dimensions', imageMetrics.width && imageMetrics.height
    ? `${imageMetrics.width} x ${imageMetrics.height} px`
    : 'No disponible')
  setField(card, 'orientation', imageMetrics.width && imageMetrics.height
    ? imageMetrics.orientation
    : 'No disponible')
  setField(card, 'contentType', headMetrics.contentType)
  setField(card, 'contentLength', formatBytes(headMetrics.contentLength))
  setField(card, 'loadTime', imageResult.status === 'fulfilled'
    ? `${formatMilliseconds(imageMetrics.loadTimeMs)}`
    : 'Error de carrega')
  setField(
    card,
    'performanceSize',
    formatBytes(imageMetrics.transferSize ?? imageMetrics.encodedBodySize),
  )

  if (status) {
    status.textContent =
      headResult.status === 'fulfilled' && imageResult.status === 'fulfilled'
        ? 'Analisi completada'
        : 'Analisi parcial'
  }

  return {
    sample,
    headMetrics,
    imageMetrics: imageResult.status === 'fulfilled' ? imageMetrics : null,
  }
}

function setField(card: HTMLElement, field: string, value: string): void {
  const target = card.querySelector<HTMLElement>(`[data-field="${field}"]`)

  if (target) {
    target.textContent = value
  }
}

async function fetchHeadMetrics(path: string): Promise<HeadMetrics> {
  const response = await fetch(path, { method: 'HEAD' })

  if (!response.ok) {
    throw new Error(`HEAD ha fallat per a ${path}`)
  }

  return {
    contentType: response.headers.get('content-type') ?? 'No disponible',
    contentLength: parseHeaderNumber(response.headers.get('content-length')),
  }
}

function measureImage(imageId: string, path: string): Promise<ImageMetrics> {
  return new Promise((resolve, reject) => {
    const img = document.querySelector<HTMLImageElement>(`img[data-image-id="${imageId}"]`)

    if (!img) {
      reject(new Error(`No s'ha trobat la imatge ${imageId}.`))
      return
    }

    const absoluteUrl = new URL(path, window.location.href).href
    const start = performance.now()

    img.onload = () => {
      const end = performance.now()
      const entry = performance
        .getEntriesByName(absoluteUrl)
        .filter(
          (item): item is PerformanceResourceTiming =>
            item instanceof PerformanceResourceTiming && item.initiatorType === 'img',
        )
        .at(-1)

      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        orientation: getOrientation(img.naturalWidth, img.naturalHeight),
        loadTimeMs: end - start,
        transferSize: entry?.transferSize ?? null,
        encodedBodySize: entry?.encodedBodySize ?? null,
      })
    }

    img.onerror = () => {
      reject(new Error(`No s'ha pogut carregar ${path}`))
    }

    img.src = absoluteUrl
  })
}

function getOrientation(width: number, height: number): 'Landscape' | 'Portrait' | 'Square' {
  if (width > height) {
    return 'Landscape'
  }

  if (height > width) {
    return 'Portrait'
  }

  return 'Square'
}

function updateSummary(
  results: Array<{
    sample: SampleImage
    headMetrics: HeadMetrics
    imageMetrics: ImageMetrics | null
  }>,
): void {
  if (summaryAverage) {
    const loadTimes = results
      .map((result) => result.imageMetrics?.loadTimeMs)
      .filter((value): value is number => typeof value === 'number' && value > 0)

    summaryAverage.textContent = loadTimes.length
      ? formatMilliseconds(loadTimes.reduce((total, value) => total + value, 0) / loadTimes.length)
      : 'No disponible'
  }

  if (summaryLightest) {
    const lightest = results
      .filter((result) => typeof result.headMetrics.contentLength === 'number')
      .sort(
        (left, right) =>
          (left.headMetrics.contentLength ?? Number.POSITIVE_INFINITY) -
          (right.headMetrics.contentLength ?? Number.POSITIVE_INFINITY),
      )[0]

    summaryLightest.textContent = lightest
      ? `${lightest.sample.title} · ${formatBytes(lightest.headMetrics.contentLength)}`
      : 'No disponible'
  }
}

function parseHeaderNumber(value: string | null): number | null {
  if (!value) {
    return null
  }

  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : null
}

function formatBytes(value: number | null): string {
  if (!value || value <= 0) {
    return 'No disponible'
  }

  const units = ['B', 'KB', 'MB']
  let size = value
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`
}

function formatMilliseconds(value: number): string {
  return `${value.toFixed(2)} ms`
}
