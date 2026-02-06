import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';

const JUMBOTRON_BG =
  'https://assets.pokemon.com//assets/cms2/img/misc/virtual-backgrounds/go/pokestop.jpg';
const POKEMON_LOGO =
  'https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg';

function Header() {
  return (
    <header>
      <div
        className="relative min-h-[280px] w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${JUMBOTRON_BG})` }}
      >
        {/* Black translucent overlay */}
        <div
          className="absolute inset-0 bg-black/50"
          aria-hidden
        />
        {/* Floating action button */}
        <button
          type="button"
          className="hidden absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white shadow-lg backdrop-blur-sm transition-shadow hover:bg-black/50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
          aria-label="Toggle theme"
        >
          <FontAwesomeIcon icon={faMoon} className="text-lg" />
        </button>
        {/* Centered Pokémon logo */}
        <div className="relative flex min-h-[280px] items-center justify-center">
          <img
            src={POKEMON_LOGO}
            alt="Pokémon - Gotta Catch 'Em All"
            className="max-h-32 w-auto max-w-[90%] object-contain drop-shadow-lg"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
