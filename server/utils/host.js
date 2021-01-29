let webserverHost = process.env.WEBSERVER_HOST || 'localhost';
let webserverPort = webserverHost === 'localhost' ? '3000' : 'auto';
let webserverProtocol = webserverHost === 'localhost' ? 'http' : 'https';

function getWebserverHost() {
  return webserverHost;
}

function setWebserverHost(newHost) {
  webserverHost = newHost;
}

function getWebserverPort() {
  return webserverPort;
}

function getFormattedWebserverPort() {
  return webserverPort === 'auto' ? '' : `:${webserverPort}`;
}

function setWebserverPort(newPort) {
  webserverPort = newPort;
}

function getWebserverProtocol() {
  return webserverProtocol;
}

function setWebserverProtocol(protocol) {
  webserverProtocol = protocol;
}

function getWebserverUrl(path) {
  return `${getWebserverProtocol()}://${getWebserverHost()}${getFormattedWebserverPort()}${path}`;
}

module.exports = {
  getWebserverHost,
  setWebserverHost,
  getWebserverPort,
  setWebserverPort,
  getWebserverProtocol,
  setWebserverProtocol,
  getWebserverUrl,
};
