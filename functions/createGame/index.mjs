import games from '../../data/games.mjs';
import { sendResponse } from '../../responses/index.mjs';

export const handler = async (event) => {
    let body;

    try {
        body = JSON.parse(event.body);
    } catch (error) {
        return sendResponse (400, {message: 'Invalid JSON in request body.'});
    }

  if (!body || !body.title || !body.developer || !body.platform || !body.genre || !body.year || !body.rating) {
    return sendResponse(400, { message: 'Title, developer, platform, genre, year and rating are required.' });
}

    const newId = Math.max(...games.map((item) => item.id)) + 1;

    const newGame = {
        id: newId,
        title: body.title,
        developer: body.developer,
        platform: body.platform,
        genre: body.genre,
        year: body.year,
        rating: body.rating
    };
    games.push(newGame);

    return sendResponse (201, newGame);
};