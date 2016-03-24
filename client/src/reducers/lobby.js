import Types from '../actions/Types';

const initialState = {
    clients: [
        { id: '234', name: 'yoo' }
    ],
    rooms: [
        {
            id: '1',
            name: 'room1',
            players: 3,
            clients: []
        },
        {
            id: '2',
            name: 'room2',
            players: 4,
            clients: []
        }

    ]
};

export default function lobby(state = initialState, action) {
    switch (action.type) {
        case Types.ADD_CLIENT:
            return Object.assign({}, state, {
                clients: [
                    ...state.clients,
                    action.client
                ]
            });
       case Types.ADD_ROOM:
            return Object.assign({}, state, {
                rooms: [
                    ...state.rooms,
                    action.room
                ]
            });
        default:
            return state
    }
};
