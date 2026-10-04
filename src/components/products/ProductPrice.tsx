import { formatPrice } from "../../utils/price";

type ProductPriceProps = {
  price: number;
  oldPrice?: number;
};

export function ProductPrice({ price, oldPrice }: ProductPriceProps) {
  const hasOldPrice = oldPrice && oldPrice > price;

  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold text-stone-900">
        {formatPrice(price)}
      </span>
      {hasOldPrice ? (
        <>
          <span className="text-sm text-stone-400 line-through">
            {formatPrice(oldPrice)}
          </span>
          <span className="rounded-full bg-[#f4d4a8] px-2 py-1 text-[10px] font-bold text-stone-900">
            خصم
          </span>
        </>
      ) : null}
    </div>
  );
}
