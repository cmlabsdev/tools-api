const axios = require('axios');
const cheerio = require('cheerio');
const normalizeUrlFunction = require('normalize-url');

class LinkAnalyzer {
  async analyze(url) {
    const response = await axios.get(`${process.env.SCRAPPER_URL}?url=${url}`);
    if(response.data.statusCode === 200){
      const $ = cheerio.load(response.data.html);
  
      return this.getAnchorLinks($, this.getHostname(url));
    } else {
      return response.data;
    }
  }
  
  getAnchorLinks($, _mainUrl) {
    const result = [];
    for(const anchor of $('a')){
      let url = $(anchor).attr('href');
      
      // check is href include mailto
      if(url.match(/mailto:.*/i)) {
        console.log(url)
        continue;
      }
      
      url = this.normalizeUrl(url, _mainUrl);
      
      let rels = []
      const type = this.getHostname(url) === this.getHostname(_mainUrl) ? 'internal' : 'external';
      
      if($(anchor).attr('rel')){
        rels = $(anchor).attr('rel').split(' ');
      }
      
      result.push({
        url: url,
        title: $(anchor).text().trim(),
        rels: rels,
        type: type
      })
    }
    return result;
  }
  
  normalizeUrl(path, mainUrl){
    try {
      return normalizeUrlFunction(path);
    } catch (e){
      return normalizeUrlFunction(mainUrl + path);
    }
  }
  
  getHostname(url){
    try {
      return (new URL(url)).hostname;
    } catch (e){
      return null;
    }
  }
}

module.exports = new LinkAnalyzer()
