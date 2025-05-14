import { Character } from "./character.model";
import { Player } from "./player.model";

export interface PlayerResult {
  player: Player;
  characters: Character[];
}
