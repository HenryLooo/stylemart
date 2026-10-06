// Real catalogue scraped from stylemart.sg on 2026-10-06.
// `price: null` = listed without a price on the live site (bespoke / enquiry).

export type Category =
  | 'Lengha'
  | 'Saree'
  | 'Gown'
  | 'Indo-Western'
  | 'Pants Suit'
  | 'Menswear'

export interface Product {
  id: string
  name: string
  price: number | null
  category: Category
  /** Tab grouping used on the live homepage */
  collection: 'Lengha' | 'Saree' | 'Asian Woman'
  image: string
  /** Waist-up crop, when the site has one */
  closeup?: string
  note: string
  isNew?: boolean
}

const img = (n: string) => `/media/${n}.webp`

export const products: Product[] = [
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

export const productById = (id: string) => products.find((p) => p.id === id)

export const collections = ['Lengha', 'Saree', 'Asian Woman'] as const
