let webserverHost = process.env.WEBSERVER_HOST || 'localhost';
let webserverProtocol = webserverHost === 'localhost' ? 'http' : 'https';

function getWebserverHost() {
  return webserverHost;
}

function setWebserverHost(newHost) {
  webserverHost = newHost;
}

function getFormattedWebserverPort() {
  return webserverHost === 'localhost' ? ':3000' : '';
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
  getWebserverProtocol,
  setWebserverProtocol,
  getWebserverUrl,
};
