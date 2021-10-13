module.exports.responseJsonSerializerSchema = {
  serializers: [
    {
      regex: /^application\/xml$/,
      serializer: ({ body }) => `<message>${body}</message>`,
    },
    {
      regex: /^application\/json$/,
      serializer: ({ body }) => JSON.stringify(body)
    },
    {
      regex: /^text\/plain$/,
      serializer: ({ body }) => body
    }
  ],
  default: 'application/json'
};
