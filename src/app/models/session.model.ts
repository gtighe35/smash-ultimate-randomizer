import { Player } from './player.model';
import { Character } from './character.model';

export interface Session {
  id?: string;
  players: { [id: string]: Player };
  characters: { [name: string]: Character };
  createdAt: number;
}
