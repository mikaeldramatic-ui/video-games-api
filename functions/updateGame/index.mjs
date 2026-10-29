import middy from "@middy/core";
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from "@middy/http-error-handler";
import { createError } from "@middy/util";
import games from "../../data/games.mjs";
import { sendResponse } from "../../responses/index.mjs";

const updateGame = async (event) => {
    const id = Number(event.pathParameters.id);
    const body = event.body;

    if (!body || !body.title || !body.developer || !body.platform || !body.genre || !body.year || !body.rating) {
        throw createError(400, 'Title, developer, platform, genre, year and rating are required.');
    }

    const index = games.findIndex((item) => item.id === id);

    if (index === -1) {
        throw createError(404, 'Game not found.');
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

export const handler = middy(updateGame)
    .use(httpJsonBodyParser())
    .use(httpErrorHandler());