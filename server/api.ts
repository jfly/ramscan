const api = new Restivus({
    apiPath: "api/v1",
});

api.addRoute("scan", {
    post() {
        return "HIYA"; // TODO
    },
});
