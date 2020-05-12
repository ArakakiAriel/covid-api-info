function isNormalInteger(str) {
    str = str.trim();
    if (!str) {
        return false;
    }
    str = str.replace(/^0+/, "") || "0";
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}

function removeFrontZeros(number){
    return parseInt(number, 10);
}

function allLetter(str){ 
    var letters = /^[A-Za-z\.\, áéíúóÁÉÍÓÚÄËÏÖÜäëüïö]+$/;
    if(str.match(letters)){
        return true;
    }
    else{
        return false;
    }
}

function normalizeCountries(listOfCountries, fileName){
    let countriesToNormalize = [];
    let aux = listOfCountries.split(";");
    let response = `CASE `;
    aux.forEach(element =>{
        countriesToNormalize.push(element.split("-"));
    });
    let size = countriesToNormalize.length;

    for(let i = 0; i < size; i++){
        if(countriesToNormalize[i][0].includes("%")){
            response += `WHEN upper(${fileName}.country_region) LIKE '${countriesToNormalize[i][0]}' THEN '${countriesToNormalize[i][1]}'`;
        }else{
            response += `WHEN upper(${fileName}.country_region) = '${countriesToNormalize[i][0]}' THEN '${countriesToNormalize[i][1]}'`
        }
    }
    
    response += `ELSE upper(${fileName}.country_region) END`

    return response;
}


function normalizeCountryName(country){
    const regex = /[\+%_]/g;
    let normalized = country.replace(regex," ").toUpperCase()
    return normalized;
}

module.exports = {
    isNormalInteger,
    removeFrontZeros,
    allLetter,
    normalizeCountries,
    normalizeCountryName
}