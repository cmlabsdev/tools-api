const crypto = require('crypto')
const knexClient = require('../config/knex');
const redisClient = require('../config/redis')
const moment = require('moment');
const MongoAPI = require('../config/mongo');

async function getKeyword(data){
  
  let availableTasks = {};
  let total_sv =0;

  let getSearchVolume = await MongoAPI.findSort({
    keyword:data.keyword,
    location_code: parseInt(data.location_code),
    language_code: data.language_code,
  }, {created:-1},1, 'keyword_search_volume_results').then((search_volume) => {
      search_volume.map(sv => {
        return total_sv += sv.search_volume == null || sv.search_volume == undefined ? 0 : sv.search_volume;
      })
    return search_volume;
  })

  if(getSearchVolume.length < 1) {
    
    availableTasks = {
      status_code: 400,
      status_error: 1,
      status_message: `No results found for this keyword : ${data.keyword}`,
    }
    
  }else{

    let result = [];

    for(let i in getSearchVolume['monthly_searches']) {
      result.push({
        month: getSearchVolume['monthly_searches'][i].month,
        year: getSearchVolume['monthly_searches'][i].year,
        period: moment(getSearchVolume['monthly_searches'][i].month + '-' + getSearchVolume['monthly_searches'][i].month + '-01').format("MMM") + ', ' + getSearchVolume['monthly_searches'][i].month,
        total_sv: getSearchVolume['monthly_searches'][i].month
      })
    }

    availableTasks = {
      status_code: 200,
      status_error: 0,
      status_message: "OK",
      result: {
        sv_average: Math.round(total_sv / 12),
        cpc:`$ ${(!parseFloat(getSearchVolume[0]['cpc']) ? 0 : getSearchVolume[0]['cpc'])}`,
        search_volume:getSearchVolume['monthly_searches'],
        paid_difficulty:(!parseFloat(getSearchVolume[0]['competition']) ? 0 : (getSearchVolume[0]['competition'].toFixed(2) * 100).toFixed(0))
      }
    }
  }
  
  
  return availableTasks;
}

async function suggestionKeyword(data){

  let availableTasks = {};
  let keywords = [];
  let searchIdeasKeyword = await MongoAPI.find({
      date: data.date,
      'keyword': {
        '$regex' : `.*${data.keyword}.*`,
        '$options' : 'i'
      },
      location_code: data.location_code,
      language_code: data.language_code,
      device:"desktop"
    }, 'serp_results')
      .then((keyword) => {
        keyword.map(keywordIdeas => {
          if(!keywords.includes(keywordIdeas.keyword)){
            return keywords.push(keywordIdeas.keyword);
          }
        });
      })

  if(searchIdeasKeyword){
    availableTasks = {
      status_code: 404,
      status_error: 0,
      status_message: "Not Found"
    }
  }else{

      let getDataOverview = [];

      for(keywords of keywords){
        let dataOverview = await getKeyword({
          date: data.date,
          keyword: keywords,
          location_code: data.location_code,
          language_code: data.language_code,
        });
        getDataOverview.push(dataOverview);
      }

      availableTasks ={
        result:getDataOverview
      }

  }


  return availableTasks;
  
}

async function relatedKeyword(data){

  let availableTasks = {};
  let keywords = [];
  let relatedKeyword = await MongoAPI.find({
    'keyword': {
      '$regex' : `.*${data.keyword}.*`,
      '$options' : 'i'
    },
    location_code: data.location_code,
    language_code: data.language_code,
  }, 'related_keywords').then((keyword) => {
      keyword[0].related_keyword.map(related => {
        if(!keywords.includes(related.keyword)){
          keywords.push(related.keyword);
        }
      });
      return keyword;
  })

  if(relatedKeyword.length < 1 || relatedKeyword == undefined){
      availableTasks = {
        status_code: 404,
        status_error: 0,
        status_message: "Not Found"
      }
    }else{
      let getDataOverview = [];

      for(keywords of keywords){
        let dataOverview = await getKeyword({
          date: data.date,
          keyword: keywords,
          location_code: data.location_code,
          language_code: data.language_code,
        });
        getDataOverview.push(dataOverview);
      }

      availableTasks ={
        result:getDataOverview
      }

    }
    return availableTasks;



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
  suggestionKeyword,
  contentIdeas,
  relatedKeyword
}
