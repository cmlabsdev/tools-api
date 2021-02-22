const axios = require('axios');
const cheerio = require('cheerio');
const normalizeUrlFunction = require('normalize-url');

class LinkAnalyzer {
  async analyze(url) {
    try {
      const response = await axios.get(`${process.env.SCRAPPER_URL}?url=${url}`);
      if (response.data.statusCode === 200) {
        const $ = cheerio.load(response.data.html);
    
        const links = this.getAnchorLinks($, url);
        const internalLinks = links.filter(link => {
          return link.type === 'internal'
        });
        const externalLinks = links.filter(link => {
          return link.type === 'external'
        });
        const noFollowLinksValue = links.filter(link => {
          return link.rels.includes('nofollow')
        }).length;
        const doFollowLinksValue = links.length - noFollowLinksValue;
    
        return {
          statusCode: 200,
          message: 'success',
          data: {
            links: {
              value: links.length,
              percentage: 100
            },
            internal_links: {
              links: internalLinks,
              value: internalLinks.length,
              percentage: links.length ? (internalLinks.length / links.length * 100).toFixed(2) : 0
            },
            external_links: {
              links: externalLinks,
              value: externalLinks.length,
              percentage: externalLinks.length ? (externalLinks.length / links.length * 100).toFixed(2) : 0
            },
            nofollow_links: {
              value: noFollowLinksValue,
              percentage: links.length ? (noFollowLinksValue / links.length * 100).toFixed(2) : 0
            },
            dofollow_links: {
              value: doFollowLinksValue,
              percentage: links.length ? (doFollowLinksValue / links.length * 100).toFixed(2) : 0
            }
          }
        }
      } else {
        response.data.data = {};
        return response.data;
      }
    } catch (e){
      console.log(e);
    }
  }
  
  getAnchorLinks($, _mainUrl) {
    const result = [];
    for (const anchor of $('a')) {
      let url = $(anchor).attr('href');
      
      // check is href include mailto
      if (url.match(/mailto:.*/i)) {
        console.log(url)
        continue;
      }
      
      url = this.normalizeUrl(url, _mainUrl);
      
      let rels = []
      const type = this.checkInternalLink(url, _mainUrl) ? 'internal' : 'external';
      
      if ($(anchor).attr('rel')) {
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
  
  checkInternalLink(link, mainUrl){
    link = link.replace('www.', '');
    mainUrl = mainUrl.replace('www.', '');
    console.log('umama', link, mainUrl);
    console.log('wein', this.getHostname(link), this.getHostname(mainUrl));
    return this.getHostname(link) === this.getHostname(mainUrl);
  }
  
  normalizeUrl(path, mainUrl) {
    try {
      return normalizeUrlFunction(path);
    } catch (e) {
      return normalizeUrlFunction(mainUrl + path);
    }
  }
  
  getHostname(url) {
    try {
      return (new URL(url)).hostname;
    } catch (e) {
      return null;
    }
  }
}

module.exports = new LinkAnalyzer()
