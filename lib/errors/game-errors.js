'use strict';

module.exports = {
    TurnError: {
        name: 'TurnError',
        message: data => `It is not your turn. Turn is to player "${data.turn}".`
    },
    NoBattleError: {
        name: 'NoBattleError',
        message: 'No battle in progress.'
    },
    BattleTurnError: {
        name: 'BattleTurnError',
        message: data => `It is not your turn in the current battle. Turn is to player "${data.battleTurn}".`
    },
    GameEndedError: {
        name: 'GameEndedError',
        message: 'Game has ended.'
    },
    GameNotStartedError: {
        name: 'GameNotStartedError',
        message: 'Game has not started.'
    },
    PhaseActionError: {
        name: 'PhaseActionError',
        message: data => `Action is not allowed in game phase "${data.phase}".`
    },
    TurnPhaseActionError: {
        name: 'TurnPhaseActionError',
        message: data => `Action is not allowed in game phase "${data.phase}" and turn phase "${data.turnPhase}".`
    },
    InvalidTerritoryError: {
        name: 'InvalidTerritoryError',
        message: data => `Territory "${data.territoryId}" is invalid.`,
        data: {
            territoryId: 'The given "id" of the territory.'
        }
    },
    InvalidContinentError: {
        name: 'InvalidContinentError',
        message: data => `Continent "${data.continentId}" is invalid.`,
        data: {
            continentId: 'The given "id" of the continent.'
        }
    },
    InvalidPlayerError: {
        name: 'InvalidPlayerError',
        message: data => `Player "${data.playerId}" is invalid.`
    },
    TerritoryClaimedError: {
        name: 'TerritoryClaimedError',
        message: data => `Territory "${data.territoryId}" is already claimed by player "${data.owner}".`
    },
    NotOwnTerritoryError: {
        name: 'NotOwnTerritoryError',
        message: data => `Territory "${data.territoryId}" is not yours. The owner is player "${data.owner}".`
    },
    MoveOwnTerritoriesError: {
        name: 'MoveOwnTerritoriesError',
        message: data => `You can only move units between your own territories. Territories ${data.territoryIds.map(id => `"${id}"`).join(', ')} are not yours.`
    },
    TerritoriesAdjacentError: {
        name: 'TerritoriesAdjacentError',
        message: data => `Territories ${data.territoryIds.map(id => `"${id}"`).join(', ')} are not adjacent.`
    },
    NoStartingUnitsError: {
        name: 'NoStartingUnitsError',
        message: 'You have no more starting units left.'
    },
    NoUnitsError: {
        name: 'NoUnitsError',
        message: 'You have no more units available.'
    },
    InvalidDiceError: {
        name: 'InvalidDiceError',
        message: data => `Number of dice "${data.dice}" is invalid.`
    },
    InvalidUnitsError: {
        name: 'InvalidUnitsError',
        message: data => `Number of units "${data.units}" is invalid.`
    },
    NumberOfCardsError: {
        name: 'NumberOfCardsError',
        message: 'You must redeem 3 cards.'
    },
    NotOwnCardsError: {
        name: 'NotOwnCardsError',
        message: data => `You do not have these cards: ${data.cards.map(card => `"${card}"`).join(', ')}.`
    },
    InvalidCardsError: {
        name: 'InvalidCardsError',
        message: data => `Card combination ${data.cards.map(card => `"${card}"`).join(', ')} is invalid.`
    },
    InvalidCardError: {
        name: 'InvalidCardError',
        message: data => `Card "${data.card}" is invalid.`
    },
    AlreadyInBattleError: {
        name: 'AlreadyInBattleError',
        message: 'You are already in a battle. You can not attack while in a battle.'
    },
    AttackSelfError: {
        name: 'AttackSelfError',
        message: data => `You can not attack your self. Territory "${data.territoryId}" is your own.`
    },
    LeaveOneUnitError: {
        name: 'LeaveOneUnitError',
        message: 'Leave at least 1 unit behind.'
    },
    NotInBattleError: {
        name: 'NotInBattleError',
        message: 'You are not in a battle. You can not roll dice while not in battle.'
    },
    RequireDeployError: {
        name: 'RequireDeployError',
        message: data => `You must deploy your units first. You have "${data.units}" units left to deploy.`
    },
    RequireCardRedeemError: {
        name: 'RequireCardRedeemError',
        message: data => `You must redeem cards until you have less than 5. Your cards: ${data.cards.map(card => `"${card}"`).join(', ')}.`
    },
    TooManyDiceError: {
        name: 'TooManyDiceError',
        message: data => `The maximum number of dice you can roll is ${data.maxDice}. You tried to roll with ${data.dice}.`
    }
};
