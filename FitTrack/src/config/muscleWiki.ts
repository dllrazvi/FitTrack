type MuscleWikiLocalConfig = {

  MUSCLEWIKI_API_KEY?: string;

  MUSCLEWIKI_RAPIDAPI_KEY?: string;

  MUSCLEWIKI_RAPIDAPI_HOST?: string;

};



let local: MuscleWikiLocalConfig = {};



try {

  // eslint-disable-next-line @typescript-eslint/no-var-requires

  local = require('./muscleWiki.local') as MuscleWikiLocalConfig;

} catch {

  local = {};

}



export const MUSCLEWIKI_API_KEY = (local.MUSCLEWIKI_API_KEY || '').trim();

export const MUSCLEWIKI_RAPIDAPI_KEY = (local.MUSCLEWIKI_RAPIDAPI_KEY || '').trim();

export const MUSCLEWIKI_RAPIDAPI_HOST = (

  local.MUSCLEWIKI_RAPIDAPI_HOST || 'musclewiki-api.p.rapidapi.com'

).trim();


