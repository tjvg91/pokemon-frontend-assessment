import { cn } from 'tailwind-cn';
import type { Pokemon } from '../types';
import { useWindowSize } from '@/hooks';

type PokeCardProps = {
  pokemon: Pokemon;
};

const PokeCard = ({ pokemon }: PokeCardProps) => {
  const { width } = useWindowSize();
  const isMobile = width < 440;

  const Image = () => (
    <img
        src={pokemon.image_url}
        alt={pokemon.name}
        className="mx-auto h-24 w-24 object-contain"
      />
  )
  const Name = () => (
    <h2 className="mt-2 text-center font-semibold text-slate-800 font-pokemon-solid tracking-wide text-xl">
      {pokemon.name}
    </h2>
  )

  const HP = () => (
    <div className="flex justify-center items-center border border-slate-800 rounded-[20px] p-1 mt-4 relative w-full">
      <div
        className={cn(
          'absolute top-0 left-0 w-full h-full rounded-[20px] opacity-100',
          'transition-opacity duration-800 ease-in-out bg-red-500',
          {
            'bg-amber-500': pokemon.hp > 50,
            'bg-green-500': pokemon.hp > 100,
          }
        )}
        style={{ width: `${pokemon.hp / 200 * 100}%` }}
      />
      <p className="relative z-10 text-center text-xs text-slate-800 font-medium">{pokemon.hp}</p>
    </div>
  )
  return (
    <div
      className={cn(
        'shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md',
        isMobile ? 'w-full h-auto' : 'h-[210px] w-[200px]'
      )}
      key={pokemon.id}
    >
      
      {
        isMobile ? (
          <div className="flex flex-row items-center gap-2">
            <Image />
            <div className="flex flex-col grow-1 items-start">
              <Name />
              <HP />
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <Image />
            <Name />
            <HP />
          </div>
        )
      }
      
    </div>
  );
}

export default PokeCard;
