import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import { createError } from '@middy/util';
import games from '../../data/games.mjs';
import { sendResponse } from '../../responses/index.mjs';

const textFields = ['title','developer','platform','genre'];
const numberFields = ['year', 'rating'];

const createGame = async (event) => {
    const body= event.body;

    if (!body) {
        throw createError(400, 'Request body is required.');
    }

    const invalidText = textFields.filter((field) => typeof body [field] !== 'string');
    const invalidNumbers = numberFields.filter((field) => typeof body[field] !== 'number');

    if (invalidText.length > 0 || invalidNumbers.length > 0) {
        const invalidFields = [...invalidText, ...invalidNumbers];
        throw createError(400, `Missing or invalid fields: ${invalidFields.join(', ')}`);
    }

    if (body.rating < 1 || body.rating >10) {
        throw createError(400, 'Rating must be between 1 and 10');
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