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
