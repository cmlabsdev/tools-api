const fetch = require('node-fetch');

const REDIRECT_LIMIT = 20;
const fetchOptions = {
  redirect: 'manual',
  follow: 0,
  headers: {
    'User-Agent': 'GoogleBot',
    'Accept': 'text/html'
  }
}

class RedirectChainChecker {
  async visit(url) {
    const response = await fetch(url, fetchOptions)
    if (this.isRedirect(response.status)) {
      const location = response.headers.get('location')
      if (!location) {
        throw `${url} responded with status ${response.status} but no location header`
      }
      
      return {url: url, redirect: true, status: response.status, redirectUrl: response.headers.get('location')}
    } else if (response.status === 200) {
      return {url: url, redirect: false, status: response.status}
    } else {
      return {url: url, redirect: false, status: response.status}
    }
  }
  
  isRedirect(statusCode) {
    return 300 <= statusCode && statusCode < 400;
  }
  
  async analyze(url) {
    let _url = url;
    let _counter = 1;
    let result = [];
    while (true) {
      let _response = await this.visit(_url)
      result.push(_response);
      _counter++;
      _url = _response.redirectUrl;
      if(!_response.redirect || _counter >= REDIRECT_LIMIT){
        break;
      }
    }
    
    return result;
  }
}

module.exports = new RedirectChainChecker()
