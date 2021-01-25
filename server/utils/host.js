let httpsHost = process.env.RAPPO_HOST || '';
function getHttpsHost() {
  return httpsHost;
}
function setHttpsHost(newHost) {
  console.log(`Setting httpsHost to ${newHost}`);
  httpsHost = newHost;
}

module.exports = {
  getHttpsHost,
  setHttpsHost,
};