export interface NavItem {
  label: string
  href: string
  menu?: boolean
}

export const navItems: NavItem[] = [
  { label: 'Home', href: '#top' },
  { label: 'About Us', href: '#kavita' },
  { label: 'Shop', href: '#new-arrivals', menu: true },
  { label: 'Media', href: '#press' },
  { label: 'Services', href: '#appointment' },
  { label: 'Signature Collection', href: '#featured' },
  { label: 'Contact Us', href: '#visit' },
]

// Category names exactly as on stylemart.sg
export const shopCategories = [
  'Asian Woman',
  'Bridal Lengha',
  'Gown',
  'Indo-Western Wear',
  'Lengha',
  'Pants Suit',
  'ReadyMade Saree',
  'Saree',
]
