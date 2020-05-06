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

module.exports = {
    isNormalInteger,
    removeFrontZeros,
    allLetter,

}