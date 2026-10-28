import games from "../../data/games.mjs";
import { sendResponse } from "../../responses/index.mjs";

export const handler = async (event) => {
    const id = Number(event.pathParameters.id);

    const index = games.findIndex((item) => item.id === id);

    if (index === -1) {
        return sendResponse(404, {message: 'Game not found. '});
    }

    const deletedGame = games.splice(index, 1)[0];

    return sendResponse(200, {message: 'Game deleted.', game: deletedGame});
};