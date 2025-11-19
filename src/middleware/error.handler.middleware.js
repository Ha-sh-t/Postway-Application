import { ApplicationError } from "../error-handler/applicationError.js";
import { ForbiddenError, NotFoundError, UnexpectedError, ValidationError } from "../error-handler/business.layer.error.js";

export function errorHandler(err, req, res, next) {
    console.log(err.type)
    if (err.type == 'validation'){
        const status = err.code || err.status || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ error: message, details: err.details })
    }
    if (err.type == 'business') {
        if (err instanceof ApplicationError ||
            err instanceof NotFoundError ||
            err instanceof ForbiddenError ||
            err instanceof ValidationError||
            err instanceof UnexpectedError) {

            const status = err.code || err.status || 500;
            const message = err.message || "Internal Server Error";

            return res.status(status).json({ error: message });
        }
    }
    if(err.type == 'application'){
        const status = err.code;
        const message = err.message;
        return res.status(status).json({error:message});
    }

    //server or internal errors
    console.error(err);
    res.status(500)
        .send("Something went wrong, please try later")
}