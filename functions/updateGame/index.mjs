import middy from "@middy/core";
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from "@middy/http-error-handler";
import { createError } from "@middy/util";
import games from "../../data/games.mjs";
import { sendResponse } from "../../responses/index.mjs";

const textFields = ['title','developer','platform','genre',];
const numberFields = ['year','rating'];

const updateGame = async (event) => {
    const id = Number(event.pathParameters.id);
    const body = event.body;

    if (!body) {
        throw createError(400,'Request body is rquired.');
    }

    const invalidText = textFields.filter((field) => typeof body [field] !== 'string');
    const invalidNumbers = numberFields.filter((field) => typeof body[field] !== 'number');

    if (invalidText.length > 0 || invalidNumbers.length > 0) {
        const invalidFields = [...invalidText, ...invalidNumbers];
        throw createError(400, `Missing of invalid fields: ${invalidFields.join(', ')}`);
    }

    if (body.rating < 1 || body.rating >10) {
        throw createError(400, 'Rating must be between 1 and 10');
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