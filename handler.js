const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const httpResponseSerializer = require('@middy/http-response-serializer');
const validator = require('@middy/validator');
const { uuid } = require('uuidv4');

const { errorHandler } = require('./utils/error-handler');
const { responseJsonSerializerSchema } = require('./utils/json-seriealizer-schema');
const db = require('./utils/db');

const addPersonInputSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 4, maxLength: 10 },
        email: { type: 'string', pattern: '[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$' },
      },
      required: ['name', 'email'],
    },
  },
};
const addPerson = (event) => {
  const { name, email } = event.body;
  const person = {
    id: uuid(),
    name,
    email,
  };

  db.addPerson(person);

  return {
    statusCode: 200,
    body: person,
  };
};

const getPeople = () => {
  const people = db.getPeople();

  return {
    statusCode: 200,
    body: people,
  };
};

const getPersonInputSchema = {
  type: 'object',
  properties: {
    pathParameters: {
      type: 'object',
      properties: {
        personId: { type: 'string' },
      },
      required: ['personId'],
    },
  },
};
const getPerson = (event) => {
  const { personId } = event.pathParameters;
  const person = db.getPerson(personId);

  if (!person) {
    return {
      statusCode: 404,
      body: {
        message: `Person with id: ${personId} not found`,
      },
    }
  }

  return {
    statusCode: 200,
    body: person,
  }
};

module.exports.addPerson = middy(addPerson)
  .use(jsonBodyParser())
  .use(validator({ inputSchema: addPersonInputSchema }))
  .use(errorHandler())
  .use(httpResponseSerializer(responseJsonSerializerSchema));

module.exports.getPeople = middy(getPeople)
  .use(jsonBodyParser())
  .use(errorHandler())
  .use(httpResponseSerializer(responseJsonSerializerSchema));

module.exports.getPerson = middy(getPerson)
  .use(jsonBodyParser())
  .use(validator({ inputSchema: getPersonInputSchema }))
  .use(errorHandler())
  .use(httpResponseSerializer(responseJsonSerializerSchema));;