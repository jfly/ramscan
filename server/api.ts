import { scanCurrentBook } from "./methods";

const api = new Restivus({
    apiPath: "api/v1",
});

api.addRoute("scan", {
    post() {
        scanCurrentBook();
        return { status: "Success!" };
    },
});
