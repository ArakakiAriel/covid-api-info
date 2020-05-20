
//===============
//    PORT
//===============
process.env.PORT = process.env.PORT || 3000;


//=====================
//    ENVIRONMENT
//=====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//=========================
//  Google Client ID
//========================
process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS || './credentials/credentialAccess.json';


module.exports = {
    mongo: {
        urlDB: process.env.MONGO_URL_DB || 'mongodb://localhost:27018/covid',
        reconnection_interval: process.env.MONGO_RECONNECTION_INTERVAL || 3000
    },
    timeouts: {
        timer_default: process.env.TIMEOUT_TIMER_DEFAULT || 3000,
        timer_query: process.env.TIMEOUT_TIMER_QUERY || 150000,
        timer_post_mongo: process.env.TIMER_POST_MONGO || 5000,

    },
    redisConfig: {
        port: process.env.NODE_REDIS_PORT || 6379,
        server: process.env.NODE_REDIS_SERVER || '127.0.0.1',
        dbNumber: process.env.NODE_REDIS_DB_NUMBER || 15,
        pass: process.env.NODE_REDIS_PASS || '',
        ttl: process.env.NODE_REDIS_TTL || 86400,
        tls: process.env.REDIS_USE_TLS
    },
    bigQuery: {
        countries_to_normalize: process.env.BIGQUERY_COUNTRIES_TO_NORMALIZE || `%KOREA%&SOUTH KOREA;IRAN (ISLAMIC REPUBLIC OF)&IRAN;NORTH IRELAND&IRELAND;REPUBLIC OF IRELAND&IRELAND;UNITED KINGDOM&UK;REPUBLIC OF MOLDOVA&MOLDOVA;CONGO (KINSHASA)&CONGO KINSHASA;CONGO (BRAZZAVILLE)&CONGO BRAZZAVILLE;MAINLAND CHINA&CHINA;BAHAMAS, THE&BAHAMAS;HONG KONG SAR&HONG KONG;GAMBIA, THE&GAMBIA;TAIWAN*&TAIWAN; AZERBAIJAN&AZERBAIJAN;CRUISE SHIP&DIAMOND PRINCESS;IVORY COAST&COTE D\\\'IVOIRE;CZECH REPUBLIC&CZECHIA;HOLY SEE&ITALY;VATICAN CITY&ITALY;CAPE VERDE&CABO VERDE;TAIPEI AND ENVIRONS&TAIWAN;OTHERS&DIAMOND PRINCESS;RUSSIAN FEDERATION&RUSSIA;TIMOR-LESTE&EAST TIMOR;ST. MARTIN&SAINT MARTIN`
    }
};
  