'use strict';

const events = require('./events');

const PHASES = {
    SETUP_A: 'setup_a',
    SETUP_B: 'setup_b',
    BATTLE: 'battle',
    END: 'end'
};

const TURN_PHASES = {
    PLACEMENT: 'placement',
    ATTACKING: 'attacking',
    FORTIFYING: 'fortifying'
};

const GAME_EVENTS = Object.keys(events.GAME_EVENTS).reduce((previous, current) => {
    previous[current] = events.GAME_EVENTS[current].name;

    return previous;
}, {});

const PLAYER_EVENTS = Object.keys(events.PLAYER_EVENTS).reduce((previous, current) => {
    previous[current] = events.PLAYER_EVENTS[current].name;

    return previous;
}, {});

module.exports = {
    PHASES,
    TURN_PHASES,
    GAME_EVENTS,
    PLAYER_EVENTS
};
