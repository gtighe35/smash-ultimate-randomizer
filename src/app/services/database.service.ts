import { Injectable } from '@angular/core';
import { Database, ref, set } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private database: Database) { }

  seedCharacters() {
      const characters = [
        'Mario', 'Donkey Kong', 'Link', 'Samus', 'Dark Samus', 'Yoshi', 'Kirby',
        'Fox', 'Pikachu', 'Luigi', 'Ness', 'Captain Falcon', 'Jigglypuff',
        'Peach', 'Daisy', 'Bowser', 'Ice Climbers', 'Sheik', 'Zelda',
        'Dr. Mario', 'Pichu', 'Falco', 'Marth', 'Lucina', 'Young Link',
        'Ganondorf', 'Mewtwo', 'Roy', 'Chrom', 'Mr. Game & Watch',
        'Meta Knight', 'Pit', 'Dark Pit', 'Zero Suit Samus', 'Wario',
        'Snake', 'Ike', 'Pokémon Trainer', 'Diddy Kong', 'Lucas', 'Sonic',
        'King Dedede', 'Olimar', 'Lucario', 'R.O.B.', 'Toon Link', 'Wolf',
        'Villager', 'Mega Man', 'Wii Fit Trainer', 'Rosalina & Luma',
        'Little Mac', 'Greninja', 'Mii Brawler', 'Mii Swordfighter', 'Mii Gunner',
        'Palutena', 'Pac-Man', 'Robin', 'Shulk', 'Bowser Jr.', 'Duck Hunt',
        'Ryu', 'Ken', 'Cloud', 'Corrin', 'Bayonetta',
        'Inkling', 'Ridley', 'Simon', 'Richter', 'King K. Rool',
        'Isabelle', 'Incineroar', 'Piranha Plant',
        // DLC Fighters Pass 1
        'Joker', 'Hero', 'Banjo & Kazooie', 'Terry', 'Byleth',
        // DLC Fighters Pass 2
        'Min Min', 'Steve', 'Sephiroth', 'Pyra', 'Mythra',
        'Kazuya', 'Sora'
      ];

      const characterMap = Object.fromEntries(characters.map(name => [name, true]));

      set(ref(this.database, 'characters'), characterMap)
        .then(() => console.log('Characters seeded!'))
        .catch(err => console.error('Seeding failed:', err));
  }

}
