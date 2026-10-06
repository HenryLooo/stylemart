// Real catalogue scraped from stylemart.sg on 2026-10-06; the first-run contents of the catalog.
// `price: null` = listed without a price on the live site (bespoke / enquiry).
// Stock counts are SAMPLE figures for the demo.
import type { Product } from './types'

type SeedProduct = Omit<Product, 'sku' | 'stock' | 'status' | 'details' | 'createdAt' | 'updatedAt'>

const img = (n: string) => `/media/${n}.webp`

const base: SeedProduct[] = [
  {
    id: 'p1',
    name: 'The Peach & Mint Brocade High-Low Gown',
    price: null,
    category: 'Indo-Western',
    collection: 'Asian Woman',
    image: img('product-p1'),
    closeup: img('product-p1-close'),
    note: 'Brocade jacket gown with a high-low hem over palazzo pants.',
  },
  {
    id: 'p2',
    name: 'The Metallic Glamour Dhoti Saree',
    price: null,
    category: 'Indo-Western',
    collection: 'Saree',
    image: img('product-p2'),
    closeup: img('product-p2-close'),
    note: 'Liquid-metal drape cut as a dhoti saree with an embellished bustier.',
  },
  {
    id: 'p3',
    name: 'The Ombré Evening Gown with Kashmiri Gara Embroidery',
    price: null,
    category: 'Gown',
    collection: 'Asian Woman',
    image: img('product-p3'),
    closeup: img('product-p3-close'),
    note: 'Teal-to-sapphire ombré silk with hand-worked Kashmiri gara sleeves.',
  },
  {
    id: 'p4',
    name: 'The Indo-Western Rose-Gold Embroidered Sherwani',
    price: null,
    category: 'Menswear',
    collection: 'Asian Woman',
    image: img('product-p4'),
    note: 'Ivory sherwani traced in rose-gold embroidery.',
  },
  {
    id: 'p5',
    name: 'The Pink Fusion Cocktail Dress',
    price: 490,
    category: 'Indo-Western',
    collection: 'Asian Woman',
    image: img('product-p5'),
    closeup: img('product-p5-close'),
    note: 'Sweetheart bodice and threadwork skirt in petal pink.',
    isNew: true,
  },
  {
    id: 'p6',
    name: 'The Midnight Metallic Readymade Saree',
    price: 415,
    category: 'Saree',
    collection: 'Saree',
    image: img('product-p6'),
    closeup: img('product-p6-close'),
    note: 'Pre-draped metallic saree with a structured beaded blouse.',
    isNew: true,
  },
  {
    id: 'p7',
    name: 'The Silver Mist Saree Gown',
    price: 890,
    category: 'Indo-Western',
    collection: 'Saree',
    image: img('product-p7'),
    closeup: img('product-p7-close'),
    note: 'Printed silver saree gown with a sculpted full-sleeve jacket.',
    isNew: true,
  },
  {
    id: 'p8',
    name: 'The Embellished Lengha with Scalloped Blouse',
    price: null,
    category: 'Lengha',
    collection: 'Lengha',
    image: img('product-p8'),
    note: 'Smoke-grey lengha with a scalloped, hand-embellished blouse.',
  },
  {
    id: 'p9',
    name: 'The Sequin Lengha with Full-Sleeve Blouse',
    price: 2690,
    category: 'Lengha',
    collection: 'Lengha',
    image: img('product-p9'),
    note: 'Blush sequin lengha, full-sleeve blouse and sheer dupatta.',
  },
  {
    id: 'p10',
    name: 'The Mirrorwork and Sequins Pants Set',
    price: 480,
    category: 'Pants Suit',
    collection: 'Asian Woman',
    image: img('product-p10'),
    closeup: img('product-p10-close'),
    note: 'Halter top and palazzo with mirrorwork drape.',
    isNew: true,
  },
  {
    id: 'p11',
    name: 'The Gold Draped Gown with Handcrafted Kashmiri Gara Pallu',
    price: 3500,
    category: 'Indo-Western',
    collection: 'Asian Woman',
    image: img('product-p11'),
    closeup: img('product-p11-close'),
    note: 'Champagne gown with a hand-painted, gara-embroidered pallu.',
  },
  {
    id: 'p12',
    name: 'The Sequin Jacket Set with Satin Trousers',
    price: 540,
    category: 'Pants Suit',
    collection: 'Lengha',
    image: img('product-p12'),
    note: 'Rose-gold sequin cape jacket over satin trousers.',
    isNew: true,
  },
  {
    id: 'p13',
    name: 'The Lion Suit – SG60 Black Indo-Western Tuxedo',
    price: 890,
    category: 'Menswear',
    collection: 'Asian Woman',
    image: img('product-p13'),
    closeup: img('product-p13-close'),
    note: 'SG60 edition tuxedo with a hand-embroidered lion-mane shoulder.',
    isNew: true,
  },
  {
    id: 'p14',
    name: 'The Black and Gold Ombré Saree',
    price: 655,
    category: 'Saree',
    collection: 'Saree',
    image: img('product-p14'),
    note: 'Ready-to-wear ombré saree with a gilded bustier blouse.',
  },
]

const PREFIX: Record<Product['category'], string> = {
  Lengha: 'LEN',
  Saree: 'SAR',
  Gown: 'GWN',
  'Indo-Western': 'IWW',
  'Pants Suit': 'PNT',
  Menswear: 'MEN',
}

// Sample stock for priced pieces (made-to-order pieces don't track stock); p9 and p13 are low
const stock: Record<string, number> = { p5: 4, p6: 5, p7: 3, p9: 1, p10: 6, p11: 2, p12: 4, p13: 2, p14: 5 }

// Craft notes (previously lookbook-only annotations)
const details: Record<string, string[]> = {
  p9: ['Full-sleeve sequin blouse', 'Blush sequin lengha'],
  p3: ['Hand-worked Kashmiri gara sleeves', 'Teal-to-sapphire ombré silk'],
  p11: ['Hand-painted, gara-embroidered pallu', 'Champagne draped gown'],
  p13: ['Hand-embroidered lion-mane shoulder', 'SG60 edition Indo-Western tuxedo'],
  p7: ['Sculpted full-sleeve jacket', 'Printed silver saree gown'],
  p2: ['Embellished bustier', 'Liquid-metal drape'],
  p5: ['Sweetheart bodice', 'Threadwork skirt in petal pink'],
  p6: ['Structured beaded blouse', 'Pre-draped metallic saree'],
}

const SEEDED_AT = '2026-10-06T00:00:00.000Z'

export function seedProducts(): Product[] {
  const counters: Record<string, number> = {}
  return base.map((p) => {
    const prefix = PREFIX[p.category]
    counters[prefix] = (counters[prefix] ?? 0) + 1
    return {
      ...p,
      sku: `SM-${prefix}-${String(counters[prefix]).padStart(4, '0')}`,
      stock: stock[p.id] ?? 0,
      status: 'active',
      details: details[p.id] ?? [],
      createdAt: SEEDED_AT,
      updatedAt: SEEDED_AT,
    }
  })
}
