import games from '../../data/games.mjs';
import { sendResponse } from '../../responses/index.mjs';

export const handler = async (event) => {
    const id = Number(event.pathParameters.id);

    const game = games.find((item) => item.id === id);

    if (!game) {
        return sendResponse(404, {message: 'Game not found.'});
    }

    return sendResponse (200, game);
};