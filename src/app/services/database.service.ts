import { Injectable, signal } from '@angular/core';
import { Database, get, onValue, push, ref, remove, set } from '@angular/fire/database';
import { Character } from '../models/character.model';
import { Player } from '../models/player.model';
import { PlayerResult } from '../models/player-result.model'; 
import { AnalyticsService } from './analytics.service';
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  //This allows one shared session for all app users
  private sessionId: string = 'abc123'//`session_${Date.now()}`;

  players = signal<Player[]>([]);
  characters = signal<Character[]>([]);
  results = signal<PlayerResult[]>([]);

  generateCount = signal<number>(1);
  noDuplicates = signal<boolean>(false);

  constructor(
    private database: Database,
    private analyticsService: AnalyticsService
  ) { }

  async seedCharacters() {
    const sessionRef = ref(this.database, `sessions/${this.sessionId}/characters`);

    const snapshot = await get(sessionRef);
    const existing = snapshot.val();

    if (existing && Object.keys(existing).length > 0) {
      console.log('Characters already exist for this session. Skipping seed.');
      this.loadCharacters();
      this.loadPlayers();
      return;
    }
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
      'Joker', 'Hero', 'Banjo & Kazooie', 'Terry', 'Byleth',
      'Min Min', 'Steve', 'Sephiroth', 'Pyra/Mythra',
      'Kazuya', 'Sora'
    ];

    const characterMap: Record<string, Character> = {};
    characters.forEach(displayName => {
      const safeKey = this.safeCharacterKey(displayName);
      characterMap[safeKey] = {
        name: displayName,
        vetoed: false
      };
    });


    await set(ref(this.database, `sessions/${this.sessionId}/characters`), characterMap)
      .then(() => console.log('Characters seeded into session!'))
      .catch(err => console.error('Seeding failed:', err));

    this.loadCharacters();
  }

  private loadPlayers() {
    const playersRef = ref(this.database, `sessions/${this.sessionId}/players`);
    onValue(playersRef, snapshot => {
      const data = snapshot.val() ?? {};
      const array = Object.entries(data).map(([id, player]) => ({
        id,
        ...(player as Player),
      }));
      this.players.set(array);
    });
  }

  private loadCharacters() {
    const charsRef = ref(this.database, `sessions/${this.sessionId}/characters`);
    onValue(charsRef, snapshot => {
      const data = snapshot.val() ?? {};
      const array = Object.values(data) as Character[];
      this.characters.set(array);
    });
  }

  // Create a new session
  // createSession(): void {
  //   const sessionRef = ref(this.database, `sessions/${this.sessionId}`);
  //   set(sessionRef, {
  //     players: {},
  //     characters: {}, // initialize empty, or call seedCharacters after
  //     createdAt: Date.now()
  //   });
  // }

  // Add a player
  addPlayer(name: string): void {
    const newPlayerRef = push(ref(this.database, `sessions/${this.sessionId}/players`));
    set(newPlayerRef, { name });
    this.loadPlayers();
  }

  // Remove a player by ID
  removePlayer(playerId: string): void {
    const playerRef = ref(this.database, `sessions/${this.sessionId}/players/${playerId}`);
    remove(playerRef);
    this.loadPlayers();
  }

  private safeCharacterKey(name: string): string {
    return name
      .replace(/\./g, '')
      .replace(/\//g, '-')
      .replace(/\s+/g, '_');
  }

 async generatePlayerResults(count: number, noDuplicates: boolean = false): Promise<void> {
  let unvetoed = this.characters().filter(c => !c.vetoed);
  const players = this.players();

  console.log(count);

  const allLogEventPromises: Promise<void>[] = [];

  this.results.set(players.map(player => {
    const shuffled = this.shuffle(unvetoed);
    const assigned = shuffled.slice(0, count);

    console.log("no duplicates:", noDuplicates);
    if (noDuplicates) {
      console.log(player.name);
      const assignedNames = new Set(assigned.map(c => c.name));
      console.log(assignedNames);

      unvetoed = unvetoed.filter(x => !assignedNames.has(x.name));

      console.log(unvetoed);
    }

    assigned.forEach(character => {
      const logPromise = this.analyticsService.logEvent('character_assigned', {
        playerId: player.id,
        character: character.name,
        sessionId: this.sessionId,
        noDuplicates: noDuplicates,
        playerName: player.name
      });
      allLogEventPromises.push(logPromise);
    });

    return {
      player,
      characters: assigned
    };
  }));

    await Promise.all(allLogEventPromises);
  }

  

  vetoCharacter(characterName: string): void {
    const safeKey = this.safeCharacterKey(characterName);
    const vetoRef = ref(this.database, `sessions/${this.sessionId}/characters/${safeKey}/vetoed`);
    set(vetoRef, true);
    this.loadCharacters();
  }

  unvetoCharacter(characterName: string): void {
    const safeKey = this.safeCharacterKey(characterName);
    const vetoRef = ref(this.database, `sessions/${this.sessionId}/characters/${safeKey}/vetoed`);
    set(vetoRef, false);
    this.loadCharacters();
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }


  // Delete the entire session
  // deleteSession(): void {
  //   const sessionRef = ref(this.database, `sessions/${this.sessionId}`);
  //   remove(sessionRef);
  // }

  // Generate a new session ID and start fresh
  // startNewSession(): void {
  //   this.sessionId = `session_${Date.now()}`;
  //   this.createSession();
  // }
}
