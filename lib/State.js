'use strict';

const Queue = require('./utils/Queue');
const RotatingQueue = require('./utils/RotatingQueue');
const Territory = require('./Territory');
const Continent = require('./Continent');
const Player = require('./Player');
const Board = require('./Board');
const Battle = require('./Battle');

class State {
    constructor (rawState) {
        this.turnCount = rawState.turnCount || 0;
        this.cards = rawState.cards;
        this.cardQueue = new Queue(rawState.cardQueue || this.cards);
        this.players = this._loadPlayers(rawState.players);
        this.board = this._loadBoard(rawState.board);

        this._territoryOwners(rawState.board.territories, rawState.players);

        if (rawState.playerQueue) {
            const rawPlayerQueue = rawState.playerQueue.map(playerId => {
                return this.players.get(playerId);
            });

            this.playerQueue = new RotatingQueue(rawPlayerQueue);
        } else {
            this.playerQueue = new RotatingQueue(Array.from(this.players.values()));
        }

        this.phase = rawState.phase;
        this.turn = this._loadTurn(rawState.turn);
        this.previousTurnEvent = rawState.previousTurnEvent || null;
        this.previousPlayerEvent = rawState.previousPlayerEvent || null;
    }

    _loadTurn (rawTurn) {
        const player = rawTurn.player !== null ? this.players.get(rawTurn.player) : null;
        let battle = null;

        if (rawTurn.battle) {
            const from = this.board.territories.get(rawTurn.battle.from);
            const to = this.board.territories.get(rawTurn.battle.to);

            battle = new Battle(from, to, rawTurn.battle.attacker.initialUnits);

            battle.attackUnits = rawTurn.battle.attacker.units;
            battle.defendUnits = rawTurn.battle.defender.units;
            battle.turn = this.players.get(rawTurn.battle.turn);
            battle.attackDice = rawTurn.battle.attacker.dice || [];
            battle.defendDice = rawTurn.battle.defender.dice || [];
            battle.winner = rawTurn.battle.winner || null;
        }

        const turn = {
            movements: new Map(rawTurn.movements.map(rawMove => {
                const move = {
                    from: this.board.territories.get(rawMove[1].from),
                    to: this.board.territories.get(rawMove[1].to),
                    units: rawMove[1].units
                };

                return [rawMove[0], move];
            })),
            phase: rawTurn.phase,
            player: player,
            unitsPlaced: rawTurn.unitsPlaced,
            cardBonus: rawTurn.cardBonus,
            battle: battle,
            wonBattle: rawTurn.wonBattle
        };

        return turn;
    }

    _territoryOwners (rawTerritories, rawPlayers) {
        for (const rawTerritory of rawTerritories) {
            for (const rawPlayer of rawPlayers) {
                if (rawPlayer.territoryIds && rawPlayer.territoryIds.includes(rawTerritory.id)) {
                    const territory = this.board.territories.get(rawTerritory.id);
                    const player = this.players.get(rawPlayer.id);

                    territory.setOwner(player, rawTerritory.units);
                    player.territories.add(territory);
                }
            }
        }
    }

    _loadBoard (rawBoard) {
        const territories = new Map();
        const continents = new Map();

        for (const rawContinent of rawBoard.continents) {
            const continent = new Continent(rawContinent.id, rawContinent.name, rawContinent.bonus);

            continents.set(continent.id, continent);
        }

        for (const rawTerritory of rawBoard.territories) {
            const territory = new Territory(rawTerritory.id, rawTerritory.name);

            territories.set(territory.id, territory);

            const continent = continents.get(rawTerritory.continentId);

            if (!continent) {
                throw new Error('Invalid continent id for territory: ' + rawTerritory.id);
            }

            territory.continent = continent;

            continent.addTerritory(territory);
        }

        for (const rawTerritory of rawBoard.territories) {
            const territory = territories.get(rawTerritory.id);

            rawTerritory.adjacentTerritoryIds.forEach(id => {
                const adjacentTerritory = territories.get(id);

                if (!adjacentTerritory) {
                    throw new Error('Invalid adjacent territory id: ' + id);
                }

                territory.addAdjacentTerritory(adjacentTerritory);
            });
        }

        const board = new Board(territories, continents);

        return board;
    }

    _loadPlayers (rawPlayers) {
        const players = new Map();

        rawPlayers.map(rawPlayer => {
            const player = new Player(rawPlayer.id);

            player.startUnits = rawPlayer.startUnits || player.startUnits;

            if (rawPlayer.cards) {
                rawPlayer.cards.forEach(card => player.addCard(card));
            }

            players.set(player.id, player);
        });

        return players;
    }

    toJSON () {
        const json = {
            turnCount: this.turnCount,
            phase: this.phase,
            previousTurnEvent: this.previousTurnEvent,
            previousPlayerEvent: this.previousPlayerEvent,
            turn: {
                movements: [...this.turn.movements].map(move => {
                    const rawMove = {
                        from: move[1].from.id,
                        to: move[1].to.id,
                        units: move[1].units
                    };

                    return [move[0], rawMove];
                }),
                phase: this.turn.phase,
                player: this.turn.player.id,
                unitsPlaced: this.turn.unitsPlaced,
                cardBonus: this.turn.cardBonus,
                battle: this.turn.battle ? this.turn.battle.toJSON() : null,
                wonBattle: this.turn.wonBattle
            },
            cards: this.cards,
            cardQueue: this.cardQueue.items,
            players: Array.from(this.players.values()).map(player => {
                return player.toJSON();
            }),
            playerQueue: this.playerQueue.items.map(player => player.id),
            board: this.board.toJSON()
        };

        return json;
    }
}

module.exports = State;