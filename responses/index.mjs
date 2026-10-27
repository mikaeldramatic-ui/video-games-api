export const sendResponse = (statusCode, data) => {
    return {
        statusCode: statusCode,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
};