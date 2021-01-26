let webserverHost = process.env.WEBSERVER_HOST || 'localhost';
let webserverProtocol = webserverHost === 'localhost' ? 'http' : 'https';

function getWebserverHost() {
  return webserverHost;
}

function setWebserverHost(newHost) {
  webserverHost = newHost;
}

function getWebserverProtocol() {
  return webserverProtocol;
}

function setWebserverProtocol(protocol) {
  webserverProtocol = protocol;
}

function getWebserverUrl(path) {
  return `${getWebserverProtocol()}://${getWebserverHost()}${path}`;
}

module.exports = {
  getWebserverHost,
  setWebserverHost,
  getWebserverProtocol,
  setWebserverProtocol,
  getWebserverUrl,
};
