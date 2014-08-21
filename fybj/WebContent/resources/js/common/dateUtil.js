 //返回某个日期的星期几
function getDayOfWeek(dayValue){
     var day = new Date(Date.parse(dayValue.replace(/-/g, '/'))); //将日期值格式化
     var today = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
	 return today[day.getDay()]; //day.getDay();根据Date返一个星期中的某一天，其中0为星期日
}

//根据Date返一个星期中的某一天，其中0为星期日
function getWeekDay(dayValue){
     var day = new Date(Date.parse(dayValue.replace(/-/g, '/'))); //将日期值格式化
	 return day.getDay(); 
}

//返回当前日期某几天之后的日期
function getNextDay(days){
	var nowDate = new Date();
	var tmpYear = nowDate.getFullYear();
	var tmpMonth = nowDate.getMonth()+1;
	if(tmpMonth<10){tmpMonth = "0"+tmpMonth;}

	var tmpDay = nowDate.getDate();	
	if(tmpDay<10){tmpDay = "0"+tmpDay;}

	var date = new Date(tmpYear,tmpMonth-1,tmpDay);
	var temp = new Number(days);
	date.setDate(date.getDate() + days);
	return changeTime(date);
}

//返回某个日期某几天之后的日期
function getNextDate(datestr,days){
	var nowDate =  new  Date(datestr);   
	var tmpYear = nowDate.getFullYear();
	var tmpMonth = nowDate.getMonth()+1;
	if(tmpMonth<10){tmpMonth = "0"+tmpMonth;}

	var tmpDay = nowDate.getDate();	
	if(tmpDay<10){tmpDay = "0"+tmpDay;}

	var date = new Date(tmpYear,tmpMonth-1,tmpDay);
	var temp = new Number(days);
	date.setDate(date.getDate() + days);
	return changeTime(date);
}

function changeTime(str){
	var fullDate = "";
	var tmpMonth = "";
	var tmpDay = "";
	var tmpYear = "";
	tmpMonth = str.getMonth() + 1;
	if(tmpMonth < 10){
		tmpMonth = "0" + tmpMonth;
	}
	tmpDay = str.getDate();
	if(tmpDay < 10){
		tmpDay = "0" + tmpDay;
	}
	tmpYear = str.getFullYear();
	return(tmpMonth+"/"+tmpDay+"/"+tmpYear);
}

//返回两个时间差的天数
function DateDiff(beginDate,  endDate){   
	//beginDate和endDate都是2007-8-10格式
    var Date1 =  new Date(Date.parse(beginDate.replace(/-/g, '/')));   
    var Date2 =  new Date(Date.parse(endDate.replace(/-/g, '/')));
    //转换为天数 
    var iDays  =  parseInt(Math.abs(Date1 - Date2)/1000/60/60/24);  
    return  iDays  
}   

//返回今天时间日期
function getToday(){
	var yesterday = getNextDay(0);
	var tmpYear = yesterday.substring(6,10);
	var tmpMonth = yesterday.substring(0,2);
	var tmpDay = yesterday.substring(3,5);
	return tmpYear+"-"+tmpMonth+"-"+tmpDay
}

