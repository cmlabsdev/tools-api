const fetch = require('node-fetch');

const REDIRECT_LIMIT = 20;

class RedirectChainChecker {
  async visit(url, fetchOptions) {
    const response = await fetch(url, fetchOptions)
    if (this.isRedirect(response.status)) {
      const location = response.headers.get('location')
      if (!location) {
        throw `${url} responded with status ${response.status} but no location header`
      }
      
      return {
        url: url,
        redirect: true,
        status: response.status,
        redirectUrl: response.headers.get('location'),
        date: this.formatDate((new Date())),
      }
    } else if (response.status === 200) {
      return {
        url: url,
        redirect: false,
        status: response.status,
        date: this.formatDate((new Date())),
      }
    } else {
      return {
        url: url,
        redirect: false,
        status: response.status,
        date: this.formatDate((new Date())),
      }
    }
  }
  
  formatDate(date) {
    // Format should be : DD/MM/YYYY HH:ii
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
  }
  
  isRedirect(statusCode) {
    return 300 <= statusCode && statusCode < 400;
  }
  
  async analyze(url, userAgent = 'GoogleBot') {
    const fetchOptions = {
      redirect: 'manual',
      follow: 0,
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html'
      }
    }
    
    let _url = url;
    let _counter = 1;
    let result = [];
    while (true) {
      let _response = await this.visit(_url, fetchOptions)
      result.push(_response);
      _counter++;
      _url = _response.redirectUrl;
      if (!_response.redirect || _counter >= REDIRECT_LIMIT) {
        break;
      }
    }
    
    return result;
  }
}

module.exports = new RedirectChainChecker()
