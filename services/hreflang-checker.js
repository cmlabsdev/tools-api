const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');

class HreflangChecker {
  constructor() {
    this.LANGUAGES = this.importLanguage();
    this.LOCATIONS = this.importLocation();
  }
  
  importLanguage() {
    const LANG_FILEPATH = path.resolve('resource/languages.json')
    return JSON.parse(fs.readFileSync(LANG_FILEPATH, 'utf8'))
  }
  
  importLocation() {
    const LOC_FILEPATH = path.resolve('resource/locations.json')
    return JSON.parse(fs.readFileSync(LOC_FILEPATH, 'utf8'))
  }
  
  translateHreflang(code) {
    let [lang_code, loc_code] = code.split('-')
    lang_code = lang_code ?? '-';
    loc_code = loc_code ?? '-';
    const language = this.LANGUAGES.find(_lang => {
      return _lang.code.toLowerCase() === lang_code.toLowerCase()
    });
    
    const location = this.LOCATIONS.find(_loc => {
      return _loc.code.toLowerCase() === loc_code.toLowerCase()
    })
    
    return {
      language: language,
      location: location
    }
  }
  
  extractAlternateLink($) {
    const result = [];
    const links = $('link[rel=alternate]');
    for (let link of links) {
      let hreflang = $(link).attr('hreflang');
      if(!hreflang) continue;
      
      let {language, location} = this.translateHreflang(hreflang)
  
      result.push({
        hreflang,
        url: $(link).attr('href'),
        language,
        location
      });
    }
    
    return result;
  }
  
  analyze(url, UserAgent = 'GoogleBot') {
    return new Promise(resolve => axios.get(url, {
        headers: {
          'Accept': '*/*',
          'User-Agent': UserAgent
        },
        // maxRedirects: 0
      })
      .then(response => {
        const $ = cheerio.load(response.data);
        const hreflangs = this.extractAlternateLink($);
        
        resolve({
          statusCode: response.status,
          statusText: response.statusText,
          data: hreflangs
        })
      })
      .catch(err => {
        if(err.response){
          resolve({
            statusCode: err.response.status,
            statusText: err.response.statusText,
            data: []
          })
        } else {
          resolve({
            statusCode: 500,
            statusText: 'Server error, ' + err.message
          })
        }
      })
    )
  }
}

module.exports = new HreflangChecker()
