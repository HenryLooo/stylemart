// Screenshot a running page at desktop + mobile widths, scrolling first so
// whileInView / scroll-linked animations have fired.
// Usage: node scripts/shot.mjs <url> <outPrefix> [--y=<px> ...]
//   no --y: full-page shots. With --y: viewport shots at each scroll offset.
import { chromium } from 'playwright'

const [url, prefix = 'shots/page'] = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const ys = process.argv.filter((a) => a.startsWith('--y=')).map((a) => Number(a.slice(4)))
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

const browser = await chromium.launch()
for (const vp of viewports) {
  const page = await browser.newPage({ viewport: vp, deviceScaleFactor: 1 })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)

  if (ys.length) {
    for (const y of ys) {
      await page.evaluate((y) => window.scrollTo(0, y), y)
      await page.waitForTimeout(1200)
      await page.screenshot({ path: `${prefix}-${vp.name}-y${y}.jpg`, quality: 70 })
    }
  } else {
    const h = await page.evaluate(() => document.body.scrollHeight)
    for (let y = 0; y < h; y += vp.height / 2) {
      await page.evaluate((y) => window.scrollTo(0, y), y)
      await page.waitForTimeout(120)
    }
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(800)
    await page.screenshot({ path: `${prefix}-${vp.name}.jpg`, fullPage: true, quality: 70 })
  }
  console.log(`${vp.name}: ${errors.length ? errors.join('\n  ') : 'no console errors'}`)
  await page.close()
}
await browser.close()
