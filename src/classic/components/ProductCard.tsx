import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Heart, Plus } from 'lucide-react'
import { ProductImage } from '../../shared/catalog/ProductImage'
import { usePreloadImage } from '../../shared/catalog/usePreloadImage'
import { isMadeToOrder, isSoldOut, type Product } from '../../shared/catalog/types'
import { useCart } from '../../shared/cart'
import { formatPrice } from '../../shared/format'
import { focusRing, pillButton } from './tokens'

const pillDisabled = `inline-flex w-full cursor-not-allowed items-center justify-center rounded-full border border-classic-line px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-classic-muted ${focusRing}`

export function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false)
  // Brief "limit reached" note when the bag already holds every piece in stock
  const [atLimit, setAtLimit] = useState(false)
  const add = useCart((s) => s.add)
  const { closeup } = product
  const soldOut = isSoldOut(product)
  usePreloadImage(closeup)

  useEffect(() => {
    if (!atLimit) return
    const t = setTimeout(() => setAtLimit(false), 1800)
    return () => clearTimeout(t)
  }, [atLimit])

  return (
    <article className="group/card flex h-full flex-col">
      <div className="relative aspect-[2/3] overflow-hidden bg-[#ececea]">
        <ProductImage
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover object-top transition duration-700 ease-out group-hover/card:scale-[1.04] ${
            closeup ? 'group-hover/card:opacity-0' : ''
          }`}
        />
        {closeup && (
          <ProductImage
            src={closeup}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-[1.04] object-cover object-top opacity-0 transition duration-700 ease-out group-hover/card:scale-100 group-hover/card:opacity-100"
          />
        )}
        {(product.isNew || soldOut) && (
          <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5 sm:left-3 sm:top-3">
            {product.isNew && (
              <span className="bg-white px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-classic-ink">New</span>
            )}
            {soldOut && (
              <span className="bg-classic-charcoal px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white">
                Sold out
              </span>
            )}
          </div>
        )}
        <motion.button
          type="button"
          whileTap={{ scale: 0.82 }}
          onClick={() => setLiked((v) => !v)}
          aria-pressed={liked}
          aria-label={liked ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className={`absolute right-2.5 top-2.5 grid size-9 place-items-center rounded-full bg-white/90 text-classic-ink shadow-sm backdrop-blur transition-colors hover:text-classic-gold sm:right-3 sm:top-3 ${focusRing}`}
        >
          <Heart
            className={`size-4 transition-colors ${liked ? 'fill-classic-gold text-classic-gold' : ''}`}
            strokeWidth={1.6}
          />
        </motion.button>
      </div>

      <div className="flex flex-1 flex-col pt-4 text-center">
        <h3 className="line-clamp-2 min-h-[2.7em] font-playfair text-[14px] leading-[1.35] text-classic-ink sm:text-[15px]">
          {product.name}
        </h3>
        <p className={`mt-1.5 text-[13px] ${product.price == null ? 'italic text-classic-muted' : 'text-classic-ink'}`}>
          {formatPrice(product.price)}
        </p>
        <div className="mt-auto pt-3.5">
          {isMadeToOrder(product) ? (
            <a href="#appointment" className={pillButton}>
              Book a Fitting
            </a>
          ) : soldOut ? (
            <button type="button" disabled className={pillDisabled}>
              Sold out
            </button>
          ) : (
            // One button throughout so keyboard focus survives the "limit reached" flash
            <button
              type="button"
              onClick={() => atLimit || add(product.id) || setAtLimit(true)}
              aria-live="polite"
              className={atLimit ? pillDisabled : pillButton}
            >
              {atLimit ? (
                'Limit reached'
              ) : (
                <>
                  <Plus className="size-3.5" strokeWidth={1.8} aria-hidden />
                  Quick Add
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
