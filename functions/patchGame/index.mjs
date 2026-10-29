import middy from "@middy/core";
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from "@middy/http-error-handler";
import { createError } from "@middy/util";
import games from "../../data/games.mjs";
import { sendResponse } from "../../responses/index.mjs";

const patchGame = async (event) => {
    const id = Number(event.pathParameters.id);
    const body = event.body;

    if (!body || Object.keys(body).length === 0) {
        throw createError(400, 'At least one field is required.');
    }

    const index = games.findIndex((item) => item.id === id);

    if (index === -1) {
        throw createError(404, 'Game not found.');
    }

    const updatedGame = { ...games[index], ...body, id: id };

    games[index] = updatedGame;

    return sendResponse(200, updatedGame);
};

export const handler = middy(patchGame)
    .use(httpJsonBodyParser())
    .use(httpErrorHandler());