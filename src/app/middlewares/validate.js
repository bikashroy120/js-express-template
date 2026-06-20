const validate = (schema) => async (req, res, next) => {
  try {
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (parsed.body) {
      req.body = parsed.body;
    }
    if (parsed.query) {
      for (const key in req.query) delete req.query[key];
      Object.assign(req.query, parsed.query);
    }

    if (parsed.params) {
      for (const key in req.params) delete req.params[key];
      Object.assign(req.params, parsed.params);
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export default validate;
