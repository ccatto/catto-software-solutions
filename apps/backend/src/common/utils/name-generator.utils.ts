/**
 * Generates random player names for users who register without providing a name.
 * Uses adjective + noun combinations for memorable, fun names.
 *
 * 100 adjectives × 100 nouns = 10,000 unique combinations
 *
 * Examples: "Swift Falcon", "Thunder Wolf", "Golden Eagle"
 */

const ADJECTIVES = [
  // Speed & Movement (20)
  'Swift',
  'Quick',
  'Speedy',
  'Rapid',
  'Fleet',
  'Dashing',
  'Racing',
  'Flying',
  'Soaring',
  'Gliding',
  'Rushing',
  'Blazing',
  'Zooming',
  'Darting',
  'Sprinting',
  'Bolting',
  'Streaking',
  'Whirling',
  'Spinning',
  'Leaping',

  // Strength & Power (20)
  'Mighty',
  'Fierce',
  'Bold',
  'Strong',
  'Powerful',
  'Sturdy',
  'Tough',
  'Rugged',
  'Hardy',
  'Solid',
  'Iron',
  'Steel',
  'Granite',
  'Titanium',
  'Diamond',
  'Crushing',
  'Smashing',
  'Roaring',
  'Thundering',
  'Booming',

  // Skill & Intelligence (20)
  'Clever',
  'Crafty',
  'Sharp',
  'Keen',
  'Wise',
  'Cunning',
  'Shrewd',
  'Savvy',
  'Slick',
  'Smooth',
  'Nimble',
  'Agile',
  'Deft',
  'Precise',
  'Accurate',
  'Steady',
  'Focused',
  'Alert',
  'Watchful',
  'Vigilant',

  // Elements & Nature (20)
  'Thunder',
  'Lightning',
  'Storm',
  'Frost',
  'Flame',
  'Solar',
  'Lunar',
  'Cosmic',
  'Stellar',
  'Nova',
  'Blaze',
  'Ember',
  'Spark',
  'Flash',
  'Glow',
  'Radiant',
  'Shining',
  'Gleaming',
  'Bright',
  'Brilliant',

  // Mystery & Shadow (20)
  'Shadow',
  'Phantom',
  'Silent',
  'Stealth',
  'Ghost',
  'Mystic',
  'Arcane',
  'Hidden',
  'Secret',
  'Veiled',
  'Masked',
  'Cloaked',
  'Dark',
  'Night',
  'Midnight',
  'Twilight',
  'Dusk',
  'Dawn',
  'Rising',
  'Falling',
];

const NOUNS = [
  // Birds of Prey (15)
  'Falcon',
  'Eagle',
  'Hawk',
  'Raven',
  'Owl',
  'Condor',
  'Osprey',
  'Kestrel',
  'Harrier',
  'Vulture',
  'Crow',
  'Sparrow',
  'Finch',
  'Robin',
  'Jay',

  // Big Cats (10)
  'Tiger',
  'Lion',
  'Panther',
  'Jaguar',
  'Cheetah',
  'Leopard',
  'Cougar',
  'Puma',
  'Lynx',
  'Ocelot',

  // Canines & Bears (10)
  'Wolf',
  'Fox',
  'Coyote',
  'Jackal',
  'Dingo',
  'Bear',
  'Grizzly',
  'Kodiak',
  'Polar',
  'Panda',

  // Other Mammals (15)
  'Badger',
  'Wolverine',
  'Otter',
  'Beaver',
  'Moose',
  'Elk',
  'Stag',
  'Buck',
  'Ram',
  'Bull',
  'Stallion',
  'Mustang',
  'Bronco',
  'Bison',
  'Buffalo',

  // Reptiles & Mythical (10)
  'Cobra',
  'Viper',
  'Python',
  'Dragon',
  'Phoenix',
  'Griffin',
  'Hydra',
  'Basilisk',
  'Wyvern',
  'Serpent',

  // Marine Life (10)
  'Shark',
  'Dolphin',
  'Orca',
  'Whale',
  'Marlin',
  'Barracuda',
  'Stingray',
  'Manta',
  'Kraken',
  'Leviathan',

  // Warriors & Heroes (15)
  'Warrior',
  'Knight',
  'Ninja',
  'Samurai',
  'Ranger',
  'Hunter',
  'Archer',
  'Gladiator',
  'Spartan',
  'Viking',
  'Centurion',
  'Paladin',
  'Guardian',
  'Sentinel',
  'Champion',

  // Sports & Competition (15)
  'Striker',
  'Ace',
  'Legend',
  'Star',
  'Captain',
  'Commander',
  'Chief',
  'Boss',
  'King',
  'Prince',
  'Duke',
  'Baron',
  'Lord',
  'Master',
  'Maverick',
];

export interface RandomPlayerName {
  firstName: string;
  lastName: string;
}

/**
 * Generates a random player name using adjective + noun combination.
 * @returns Object with firstName (adjective) and lastName (noun)
 *
 * @example
 * const name = generateRandomPlayerName();
 * // { firstName: 'Swift', lastName: 'Falcon' }
 */
export function generateRandomPlayerName(): RandomPlayerName {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];

  return {
    firstName: adjective,
    lastName: noun,
  };
}
