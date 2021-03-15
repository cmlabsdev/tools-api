const ssl = require('get-ssl-certificate-next');

class SslChecker {
  async check(url) {
    url = url.replace(/^https?:\/\//, '')
    try {
      const cert = await ssl.get(url, 100000000, 443, 'https:');
      return {
        statusCode: 200,
        message: 'Success',
        data: cert
      }
    } catch (e){
      return {
        statusCode: 400,
        message: e.message
      }
    }
  }
  
  checkUrl(str) {
    try {
      const url = new URL(str);
      return url.protocol === 'https:' || url.protocol === 'http:';
    } catch (e) {
      return false;
    }
  }
}


module.exports = new SslChecker();
