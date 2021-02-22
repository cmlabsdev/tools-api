const crypto = require('crypto')
const knexClient = require('../config/knex');
const redisClient = require('../config/redis')
const moment = require('moment');
const MongoAPI = require('../config/mongo');

async function getKeyword(data){
  
  let availableTasks = {};
  
  let date = moment(data.date).subtract(1,"years").format('YYYY-MM-DD');
  let results = [];
  
  let getSearchVolume = await knexClient('monthly_search_volume')
    .select(knexClient.raw('year,month,search_volume,date,cpc'))
    .where({
      keyword: data.keyword,
      location_code: data.location_code,
      language_code: data.language_code,
    })
    .whereRaw("date >= '" + date + "'")
    .groupByRaw('year,month')
    .orderByRaw('year asc,month asc');
  // console.log(getSearchVolume)
  
  if(getSearchVolume.length < 1) {
    
    availableTasks = {
      status_code: 400,
      status_error: 1,
      status_message: `No results found for this keyword : ${data.keyword}`,
    }
    
  }else{
    
    let sv_data = [];
    let total_sv = 0;
    let cpc = 0;
    for (let y in getSearchVolume) {
      cpc += getSearchVolume[y].cpc;
      
      sv_data.push({
        period: getSearchVolume[y].month + ':' + getSearchVolume[y].year,
        search_volume: getSearchVolume[y].search_volume
      })
      total_sv += getSearchVolume[y].search_volume;
    }
    
    let obj = {};
    
    sv_data.forEach(function (d) {
      if (obj.hasOwnProperty(d.period)) {
        obj[d.period] = obj[d.period] + d.search_volume;
      } else {
        obj[d.period] = d.search_volume;
      }
    });
    
    var size = 0;
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    
    
    for (const [key, val] of Object.entries(obj)) {
      
      let [month, year] = key.split(':');
      
      results.push({
        month: month,
        year: year,
        period: moment(year + '-' + month + '-01').format("MMM") + ', ' + year,
        total_sv: val
      })
    }
    
    results.sort(function (a, b) {
      return a.year - b.year;
    });


    let getSerp = await MongoAPI.find({
      date: data.date,
      keyword: data.keyword,
      location_code: data.location_code,
      language_code: data.language_code,
      device:"desktop"
    }, 'serp_results');


    let paidFilter = getSerp[0].items.filter(function (item) {
      return item.type == 'paid';
    });

    availableTasks = {
      status_code: 200,
      status_error: 0,
      status_message: "OK",
      result: {
        sv_average: Math.round(total_sv / size),
        sv_chart: results,
        cpc:`$ ${cpc.toFixed(3)}`,
        search_volume:results[results.length-1].total_sv,
        paid_difficulty:paidFilter.length < 1 ? 1 : paidFilter.length++
      }
    }
  }
  
  
  
  
  
  
  return availableTasks;
}

async function searchIdeasKeyword(data){
  
  /*
  * Stil need discuss
  *
  * */
  
  // let searchIdeasKeyword = await knexClient('keyword_ranks')
  //     .select('keyword')
  //     .where({
  //         location_code:data.location_code,
  //         language_code:data.language_code
  //     })
  //     .whereRaw(`keyword like '%${data.keyword}'`)
  //
  // return searchIdeasKeyword;
  
}

async function contentIdeas(data){
  let getContentSerp = await MongoAPI.find({
    date: data.date,
    keyword: data.keyword,
    location_code: data.location_code,
    language_code: data.language_code,
    device:"desktop"
  }, 'serp_results');
  
  let data_content = [];
  
  for(let i in getContentSerp){
    for(let ii in getContentSerp[i].items){
      if(getContentSerp[i].items[ii].title !== undefined)
        if(getContentSerp[i].items[ii].title.includes(data.keyword)){
          data_content.push({
            title:getContentSerp[i].items[ii].title,
            domain:getContentSerp[i].items[ii].domain
          })
        }
    }
  }
  
  return data_content;
  
}

module.exports = {
  getKeyword,
  searchIdeasKeyword,
  contentIdeas
}
