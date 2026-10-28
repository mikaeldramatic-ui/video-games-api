import games from '../../data/games.mjs';
import { sendResponse } from '../../responses/index.mjs';

export const handler = async (event) => {
    const query = event.queryStringParameters || {};

    let result = games;

    if (query.platform) {
        const platform = query.platform.toLowerCase();
        result = result.filter((item) => item.platform.toLowerCase().includes(platform));
    }

        if (query.genre) {
        const genre = query.genre.toLowerCase();
        result = result.filter((item) => item.genre.toLowerCase().includes(genre));
    }

    
    return sendResponse(200, result);
};