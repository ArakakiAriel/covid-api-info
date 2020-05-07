function getMonth(month) {
    if(!month){
        let d = new Date();
        month = d.getMonth() + 1;
    }
    if (month < 10) {
        month = "0" + month;
    }else{
        month = month.toString();
    }
    return month;
}

function getDay(day) {
    if(!day){
        let d = new Date();
        day = d.getDate();
    }
    if (day < 10) {
        day = "0" + day;
    }else{
        day = day.toString();
    }
    return day;
}

function getFullDate(day, month, year) {
        let d = new Date();
        year = (year) ? year.toString() : d.getFullYear().toString();
        month = (month) ? getMonth(month) : getMonth();
        day = (day) ? getDay(day) : getDay();
    

    return {
        year,
        month,
        day
    };
}

function differenceBetweenDates(recentDate, previosDate){
    let date1 = new Date(recentDate);
    let date2 = new Date(previosDate);
    let diffTime = Math.abs(date2 - date1);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    return(diffDays);    
}

function formatCertainDate(date){
    let year = date.year;
    let month = date.month;
    let day = date.day;    

    return year+"-"+month+"-"+day;
}

module.exports = {
    getDay,
    getMonth,
    getFullDate,
    formatCertainDate,
    differenceBetweenDates
}