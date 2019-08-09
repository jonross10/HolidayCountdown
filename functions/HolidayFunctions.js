
var url = getUrl();
var alexa;

function getDaysBetween(dateObj){
  console.log(dateObj);
  let holidayName = dateObj.name[0].text;
  let d = new Date();
  if(d.getHours()<5){
    d.setDate(d.getDate()-1);
  }
  let today = new Date(d.getFullYear(),d.getMonth(), d.getDate());
  let dateOfHoliday = new Date(dateObj.date.year, dateObj.date.month-1, dateObj.date.day);
  var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
  let days =Math.round(Math.abs((today.getTime() - dateOfHoliday.getTime())/(oneDay)))
  console.log(days);
  let outString = "There are "+days+" days until "+holidayName;
  console.log(outString);
  alexa.emit(':tell', outString);
}

function getNextHoliday(dateObj){
  console.log(dateObj);
  let holidayName = dateObj.name[0].text;
  let d = new Date();
  if(d.getHours()<5){
    d.setDate(d.getDate()-1);
  }
  let today = new Date(d.getFullYear(),d.getMonth(), d.getDate());
  let dateOfHoliday = new Date(dateObj.date.year, dateObj.date.month-1, dateObj.date.day);
  var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
  let days =Math.round(Math.abs((today.getTime() - dateOfHoliday.getTime())/(oneDay)))
  console.log(days);
  let outString = "The next holiday is "+holidayName+", which is "+days+" days away."; 
  console.log(outString);
  alexa.emit(':tell', outString);
}


function formatDate(d){
  let year = d.getFullYear();
  let month = d.getMonth()+1;
  let day = d.getDate();

  return day+"-"+month+"-"+year;
}

function getUrl(){
  var url = "https://kayaposoft.com/enrico/json/v2.0/?action=getHolidaysForDateRange&fromDate={FROM_DATE}&toDate={TO_DATE}&country=usa&region=ma&holidayType=public_holiday"

  var current = new Date();
  let year = current.getFullYear();
  let month = current.getMonth();
  let day = current.getDate();
  var future = new Date(year + 1, month, day)

  url = url.replace("{FROM_DATE}",formatDate(current)).replace("{TO_DATE}",formatDate(future));

  return url;
}

function getDaysTilHoliday(holidayName, holidayList){
  
}

function checkAPIForHoliday(holidayName, alexa){
  alexa = alexa;
  request(url, function(error, response, body) {
  if (response.statusCode == 200) {
    console.log(body);
    var holidayList = JSON.parse(body);
    holidayList.push(addHalloween());
    holidayList.push(addValentines());
    holidayList.push(addStPattys());
    holidayList.push(addFlagDay());
    holidayList.push(addFathersDay());
    holidayList.push(addMothersDay());
    for(var i=0; i<holidayList.length; i++){
      if(holidayList[i].name[0].text.toLowerCase().includes(holidayName)){
        console.log(holidayList[i]);
        getDaysBetween(holidayList[i]);
        return;
      }
    }
    alexa.emit(':tell',"I'm sorry, I don't know");
  } else {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(error);
    alexa.emit(':tell',"I'm sorry, something went wrong");
  }
});
}

function getSoonestHoliday(alexa){
  alexa=alexa;
  request(url, function(error, response, body) {
  if (response.statusCode == 200) {
    console.log(body);
    var holidayList = JSON.parse(body);
    holidayList.push(addHalloween());
    holidayList.push(addValentines());
    holidayList.push(addStPattys());
    holidayList.push(addFlagDay());
    holidayList.push(addFathersDay());
    holidayList.push(addMothersDay());
    holidayList.sort(dateCompare);
    let now = new Date();
    for(var i=0; i<holidayList.length; i++){
      let date = new Date(holidayList[i].date.year, holidayList[i].date.month, holidayList[i].date.day);
      if(now.getTime() <= date.getTime()){
        console.log(holidayList[i]);
        getNextHoliday(holidayList[i]);
        return;

      }
    }
    alexa.emit(':tell',"I'm sorry, I don't know");
  } else {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(error);
    alexa.emit(':tell',"I'm sorry, something went wrong");
  }
});
}


function dateCompare(a,b) {
  let dateA = new Date(a.date.year, a.date.month, a.date.day);
  let dateB = new Date(b.date.year, b.date.month, b.date.day);
  if (dateA.getTime() < dateB.getTime())
    return -1;
  if (dateA.getTime() > dateB.getTime())
    return 1;
  return 0;
}



function addHalloween(){
  let d = new Date();
  if(d.getMonth()>9){
    return {"date":{"day":31,"month":10,"year":d.getFullYear()+1,"dayOfWeek":null},"name":[{"lang":"en","text":"Halloween"}],"holidayType":"public_holiday"};
  } else{
    return {"date":{"day":31,"month":10,"year":d.getFullYear(),"dayOfWeek":null},"name":[{"lang":"en","text":"Halloween"}],"holidayType":"public_holiday"};
  }  
}

function addValentines(){
  let d = new Date();
  if(d.getMonth()>1 || (d.getMonth() == 1 && d.getDate()>14)) {
    return {"date":{"day":14,"month":2,"year":d.getFullYear()+1,"dayOfWeek":null},"name":[{"lang":"en","text":"Valentines Day"}],"holidayType":"public_holiday"};
  } else{
    return {"date":{"day":14,"month":2,"year":d.getFullYear(),"dayOfWeek":null},"name":[{"lang":"en","text":"Valentines Day"}],"holidayType":"public_holiday"};
  }  
}

function addStPattys(){
  let d = new Date();
  if(d.getMonth()>2 || (d.getMonth() == 2 && d.getDate()>17)) {
    return {"date":{"day":17,"month":3,"year":d.getFullYear()+1,"dayOfWeek":null},"name":[{"lang":"en","text":"St Patricks Day"}],"holidayType":"public_holiday"};
  } else{
    return {"date":{"day":17,"month":3,"year":d.getFullYear(),"dayOfWeek":null},"name":[{"lang":"en","text":"St Patricks Day"}],"holidayType":"public_holiday"};
  }  
}

function addFlagDay(){
  let d = new Date();
  if(d.getMonth()>5 || (d.getMonth() == 5 && d.getDate()>14)) {
    return {"date":{"day":14,"month":5,"year":d.getFullYear()+1,"dayOfWeek":null},"name":[{"lang":"en","text":"Flag Day"}],"holidayType":"public_holiday"};
  } else{
    return {"date":{"day":14,"month":5,"year":d.getFullYear(),"dayOfWeek":null},"name":[{"lang":"en","text":"Flag Day"}],"holidayType":"public_holiday"};
  }  
}

function addMothersDay(){
  let d = new Date();
  let year = d.getFullYear();
  if(d.getMonth()>4){
    year+=1
  }
  var mayFirst = new Date(year, 4, 1);
  var dayOfWeek = mayFirst.getUTCDay();
  var firstSunday;
  if (dayOfWeek === 0) {
    firstSunday = mayFirst;
  } else {
    firstSunday = new Date(mayFirst);
    firstSunday.setDate(1 + (7 - dayOfWeek));
  }
  var mothersDay = new Date(firstSunday);
  mothersDay.setDate(firstSunday.getUTCDate() + 7);
  mothersDay = new Date(mothersDay);
  console.log(mothersDay)
  if(d.getMonth==4 && d.getDate()>mothersDay.getDate()){
    year+=1
    mayFirst = new Date(year, 4, 1);
    dayOfWeek = mayFirst.getUTCDay();
    if (dayOfWeek === 0) {
      firstSunday = mayFirst;
    } else {
      firstSunday = new Date(mayFirst);
      firstSunday.setDate(1 + (7 - dayOfWeek));
    }
    mothersDay = new Date(firstSunday);
    mothersDay.setDate(firstSunday.getUTCDate() + 7);
    mothersDay = new Date(mothersDay);
    console.log(mothersDay);
  }
  return {"date":{"day":mothersDay.getDate(),"month":mothersDay.getMonth()+1,"year":mothersDay.getFullYear(),"dayOfWeek":null},"name":[{"lang":"en","text":"Mothers Day"}],"holidayType":"public_holiday"};
}

function addFathersDay(){
  let d = new Date();
  let year = d.getFullYear();
  if(d.getMonth()>5 || ((d.getDate()-d.getUTCDay())>21 && d.getMonth()==5)){
    year+=1
  }
  var juneFirst = new Date(d.getFullYear()+1, 5, 1);
  var dayOfWeek = juneFirst.getUTCDay();
  var firstSunday;
  if (dayOfWeek === 0) {
    firstSunday = juneFirst;
  } else {
    firstSunday = new Date(juneFirst);
    firstSunday.setDate(1 + (14 - dayOfWeek));
  }
  var fathersDay = new Date(firstSunday);
  fathersDay.setDate(firstSunday.getUTCDate() + 7);
  fathersDay = new Date(fathersDay);
  console.log(fathersDay)

  if(d.getMonth==5 && d.getDate()>fathersDay.getDate()){
    year+=1
    juneFirst = new Date(year, 4, 1);
    dayOfWeek = juneFirst.getUTCDay();
    if (dayOfWeek === 0) {
      firstSunday = juneFirst;
    } else {
      firstSunday = new Date(juneFirst);
      firstSunday.setDate(1 + (14 - dayOfWeek));
    }
    fathersDay = new Date(firstSunday);
    fathersDay.setDate(firstSunday.getUTCDate() + 7);
    fathersDay = new Date(fathersDay);
    console.log(fathersDay);
  }
  return {"date":{"day":fathersDay.getDate(),"month":fathersDay.getMonth()+1,"year":fathersDay.getFullYear(),"dayOfWeek":null},"name":[{"lang":"en","text":"Fathers Day"}],"holidayType":"public_holiday"};
}