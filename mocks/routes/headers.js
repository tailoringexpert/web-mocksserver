module.exports = [{
    id: "add-headers",
    url: "*",
    method: ["GET", "POST", "PUT", "PATCH"],
    variants: [{
        id: "cachecontrol",
        type: "middleware",
        options: {
            middleware: (request, response, next, core) => {
                response.set('Cache-Control', 'no-store, no-cache, max-age=0, must-revalidate, proxy-revalidate');
                next();
            },
        },
    }]
}]