const sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: true,
    statusCode: data.statusCode,
    message: data.message,
    ...(data.meta && { meta: data.meta }),
    data: data.data || null,
  });
};

export default sendResponse;
