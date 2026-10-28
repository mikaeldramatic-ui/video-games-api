import games from "../../data/games.mjs";
import { sendResponse } from "../../responses/index.mjs";

export const handler = async (event) => {
    const id = Number(event.pathParameters.id);

    let body;

    try {
        body = JSON.parse(event.body);
    } catch (error) {
        return sendResponse(400,{message: 'Invalid JSON in request body.'});
    }

      if (!body || !body.title || !body.developer || !body.platform || !body.genre || !body.year || !body.rating) {
    return sendResponse(400, { message: 'Title, developer, platform, genre, year and rating are required.' });
}

const index = games.findIndex((item) => item.id === id);

if (index === -1) {
    return sendResponse (404,{message: 'Game not found.'});
}

const updatedGame = {
    id: id,
    title: body.title,
    developer: body.developer,
    platform: body.platform,
    genre: body.genre,
    year: body.year,
    rating: body.rating
};

games[index] = updatedGame;

return sendResponse(200, updatedGame);

};