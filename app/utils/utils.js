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

function normalizeCountries(listOfCountries){
    let countriesToNormalize = [];
    let aux = listOfCountries.split(";");
    let response = ``;
    aux.forEach(element =>{
        countriesToNormalize.push(element.split(","));
    });
    let size = countriesToNormalize.length;

    for(let i = 0; i < size - 1; i++){
        if(countriesToNormalize[i][0].includes("%")){
            response += `IF(upper(cases.country_region) LIKE '${countriesToNormalize[i][0]}', '${countriesToNormalize[i][1]}', `;
        }else{
            response += `IF(upper(cases.country_region) = '${countriesToNormalize[i][0]}', '${countriesToNormalize[i][1]}', `
        }
    }
    if(countriesToNormalize[size - 1][0].includes("%")){
        response += `IF(upper(cases.country_region) LIKE '${countriesToNormalize[size -1][0]}', '${countriesToNormalize[size -1][1]}', upper(cases.country_region)`;
    }else{
        response += `IF(upper(cases.country_region) = '${countriesToNormalize[size -1][0]}', '${countriesToNormalize[size -1][1]}', upper(cases.country_region)`;
    }
    for(let i = 0; i < size; i++){
        response += ")";
    }

    return response;
}

module.exports = {
    isNormalInteger,
    removeFrontZeros,
    allLetter,
    normalizeCountries

}