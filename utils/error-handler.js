module.exports.errorHandler = () => {
  return {
    onError: request => {
      const error = request.error;
      console.log('######', error)
      request.response = {
        statusCode: error.statusCode,
        body: JSON.stringify(error.details),
      };

      return request.response;
    }
  }
};