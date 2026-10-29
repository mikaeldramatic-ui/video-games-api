import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import { createError } from '@middy/util';
import games from '../../data/games.mjs';
import { sendResponse } from '../../responses/index.mjs';

const createGame = async (event) => {
    const body= event.body;

    if (!body || !body.title || !body.developer || !body.platform || !body.genre || !body.year || !body.rating) {
        throw createError(400, 'Title, developer, platform, genre, year and rating are required.');
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

    return sendResponse(201, newGame);
};

export const handler = middy(createGame)
    .use(httpJsonBodyParser())
    .use(httpErrorHandler());