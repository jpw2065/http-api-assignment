const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const cssFile = fs.readFileSync(`${__dirname}/../client/style.css`);

/*
============ Helper Functions ============
*/

const respond = (response, content, status, type) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(content);
  response.end();
};

const isHeaderSet = (params, header, value) => {
  if (!params[header] || params[header] !== value) {
    return false;
  }
  return true;
};

const objectToXML = (content) => {
  let xmlString = '<response>';
  const keys = Object.keys(content);

  for (let i = 0; i < keys.length; i++) {
    xmlString += `<${keys[i]}> ${content[keys[i]]} </${keys[i]}>`;
  }

  xmlString += '</response>';

  return xmlString;
};

const objectToJson = (content) => JSON.stringify(content);

const respondWithXMLOrJson = (response, content, status, acceptedTypes) => {
  if (acceptedTypes[0] === 'text/xml') {
    respond(response, objectToXML(content), status, 'text/xml');
  } else {
    respond(response, objectToJson(content), status, 'application/json');
  }
};

/*
============ Route Functions ============
*/

const getIndex = (request, response) => {
  respond(response, index, 200, 'text/html');
};

const getCss = (request, response) => {
  respond(response, cssFile, 200, 'text/css');
};

const getSuccess = (request, response, acceptedTypes) => {
  const success = {
    message: 'This is a successful response',
  };

  respondWithXMLOrJson(response, success, 200, acceptedTypes);
};

const getBadRequest = (request, response, acceptedTypes, params) => {
  const error = {
    id: 'badRequest',
    message: 'Missing valid query parameter set to true',
  };

  const success = {
    message: 'This request has the valid parameters',
  };

  if (isHeaderSet(params, 'valid', 'true')) {
    respondWithXMLOrJson(response, success, 200, acceptedTypes);
  } else {
    respondWithXMLOrJson(response, error, 400, acceptedTypes);
  }
};

const getUnauthorized = (request, response, acceptedTypes, params) => {
  const error = {
    id: 'unauthorized',
    message: 'Missing loggedIn query parameter set to yes',
  };

  const success = {
    message: 'You have succesfully view the content',
  };

  if (isHeaderSet(params, 'loggedIn', 'yes')) {
    respondWithXMLOrJson(response, success, 200, acceptedTypes);
  } else {
    respondWithXMLOrJson(response, error, 401, acceptedTypes);
  }
};

const getForbidden = (request, response, acceptedTypes) => {
  const message = {
    id: 'forbidden',
    message: 'You do not have access to this content',
  };

  respondWithXMLOrJson(response, message, 403, acceptedTypes);
};

const getInternal = (request, response, acceptedTypes) => {
  const message = {
    id: 'internalError',
    message: 'Internal Server Error. Something went wrong.',
  };

  respondWithXMLOrJson(response, message, 500, acceptedTypes);
};

const getNotImplemented = (request, response, acceptedTypes) => {
  const message = {
    id: 'notImplemented',
    message: 'A get request to this page has not been implemented yet. Check again later for updated content.',
  };

  respondWithXMLOrJson(response, message, 501, acceptedTypes);
};

const getDoesNotExist = (request, response, acceptedTypes) => {
  const message = {
    id: 'notFound',
    message: 'The page you are looking for was not found.',
  };

  respondWithXMLOrJson(response, message, 404, acceptedTypes);
};

module.exports.getIndex = getIndex;
module.exports.getCss = getCss;
module.exports.getSuccess = getSuccess;
module.exports.getBadRequest = getBadRequest;
module.exports.getUnauthorized = getUnauthorized;
module.exports.getForbidden = getForbidden;
module.exports.getInternal = getInternal;
module.exports.getNotImplemented = getNotImplemented;
module.exports.getDoesNotExist = getDoesNotExist;
