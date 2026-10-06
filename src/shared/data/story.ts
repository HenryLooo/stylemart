// Facts from stylemart.sg/kavita-thulasidas and /our-history.

export const brand = {
  name: 'Stylemart',
  label: 'Asian Woman',
  founder: 'Kavita Thulasidas',
  tagline: 'Trendsetters of Fashionwear',
  philosophy: 'Asian opulence with western cuts and silhouettes.',
  address: '151 Selegie Road, Singapore 188315',
  phones: ['+65 6338 2073', '+65 6336 3605'],
  // Placeholder: confirm with client
  hours: 'Mon – Sat, 11am – 8pm · Sun by appointment',
  whatsapp: 'https://wa.me/6563382073',
}

export interface Chapter {
  numeral: string
  year: string
  title: string
  body: string
  image: string
  imageAlt: string
}

export const chapters: Chapter[] = [
  {
    numeral: 'I',
    year: '1999',
    title: 'The Inheritance',
    body:
      'Singapore-born Kavita Thulasidas formally takes over Stylemart Dept. Store, then a 700 sq ft shop on Selegie Road, and decides it will be known for one thing: the bride.',
    image: '/media/store-interior.webp',
    imageAlt: 'The Stylemart boutique interior on Selegie Road',
  },
  {
    numeral: 'II',
    year: '2000',
    title: 'The Bride',
    body:
      'Within a year, Stylemart Bridal Collection is born. She personally trains every stylist, and the store grows to 1,800 sq ft. Sales rise 50% in a year and triple in five.',
    image: '/media/editorial-bride-red.webp',
    imageAlt: 'A bride in a red embroidered dupatta and heirloom jewellery',
  },
  {
    numeral: 'III',
    year: '2004',
    title: 'Asian Woman',
    body:
      'Kavita launches her own label, Asian Woman: pure silks, intricate hand embroidery and one-of-a-kind pieces for cross-cultural and non-traditional brides. It is named a finalist in SPRING Singapore’s start-up competition.',
    image: '/media/editorial-trio.webp',
    imageAlt: 'Three models in Asian Woman gowns in a vintage parlour',
  },
  {
    numeral: 'IV',
    year: '2006',
    title: 'Selegie Road',
    body:
      'She buys the building. Another 750 sq ft of retail space on Selegie Road, followed in 2007 by a spa and lifestyle boutique in Bangalore.',
    image: '/media/editorial-gramophone.webp',
    imageAlt: 'A couple in Indo-Western couture beside a vintage gramophone',
  },
  {
    numeral: 'V',
    year: 'Today',
    title: 'The Runway',
    body:
      'From KL Asia Fashion Week to the SG60 Lion Suit, Stylemart is now a regional couture label, still made to measure, still fitted by hand.',
    image: '/media/runway-kl-couple.webp',
    imageAlt: 'Runway finale at KL Asia Fashion Week',
  },
]

export const stats = [
  { value: '1999', label: 'Kavita takes the helm' },
  { value: '3×', label: 'Growth in five years' },
  { value: '2004', label: 'Asian Woman label founded' },
]

export interface PressItem {
  title: string
  outlet: string
  image: string
}

// Outlet names are as legible on the scans; "Feature" where the masthead isn't visible.
export const press: PressItem[] = [
  { title: 'Kavita Thulasidas', outlet: 'Magazine feature', image: '/media/press-kavita-feature.webp' },
  { title: 'Indian business success stories', outlet: 'The Straits Times · Money', image: '/media/press-straits-times-money.webp' },
  { title: 'Singapore Indian Entrepreneurs', outlet: 'Book feature', image: '/media/press-sg-indian-entrepreneurs.webp' },
  { title: 'A Love Affair', outlet: 'Magazine feature', image: '/media/press-a-love-affair.webp' },
  { title: 'Service with Style', outlet: 'Newspaper feature', image: '/media/press-service-with-style.webp' },
  { title: 'Cool silks, hot looks', outlet: 'Newspaper feature', image: '/media/press-cool-silks.webp' },
  { title: 'Style Mistress', outlet: 'Magazine feature', image: '/media/press-style-mistress.webp' },
  { title: 'Fashion & Beauty', outlet: 'Magazine feature', image: '/media/press-looks-talking.webp' },
]

export const pressNames = [
  'The Straits Times',
  'TODAY',
  'KL Asia Fashion Week',
  'Singapore Indian Entrepreneurs',
  'SPRING Singapore',
]

export interface Testimonial {
  quote: string
  name: string
  detail: string
  sample: true
}

// SAMPLE copy: replace with real client testimonials before launch.
export const testimonials: Testimonial[] = [
  {
    quote:
      'Kavita understood that I wanted to honour my grandmother’s saree and still walk in like myself. The lengha she made is the most beautiful thing I own.',
    name: 'Priya & Daniel',
    detail: 'Wedding, 2024',
    sample: true,
  },
  {
    quote:
      'Three fittings, every one of them unhurried. The embroidery on my gown took weeks and you can see every hour of it.',
    name: 'Mei Ling',
    detail: 'Reception gown, Asian Woman',
    sample: true,
  },
  {
    quote:
      'I came in for one outfit and left with a wardrobe for the whole wedding week. Nobody in Singapore does fusion like Stylemart.',
    name: 'Ananya R.',
    detail: 'Bride, 2025',
    sample: true,
  },
]
