const axios = require('axios');
const cheerio = require('cheerio');

class MetaChecker {
  async check(url) {
    try {
      const response = await axios.get(url);
      const data = this.extractMeta(response.data);
      return {
        statusCode: 200,
        message: 'Success',
        data: data
      }
    } catch (e){
      return {
        statusCode: 400,
        message: e.message
      }
    }
  }
  
  extractMeta(html){
    const $ = cheerio.load(html);
    return {
      title: $('title').text(),
      description: $('meta[name=description]').attr('content'),
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


module.exports = new MetaChecker();
