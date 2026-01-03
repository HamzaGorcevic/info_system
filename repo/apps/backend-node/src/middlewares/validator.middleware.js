export const validate = (schemas) => (req, res, next) => {
    try {
        if (schemas.body)
            req.body = schemas.body.parse(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
