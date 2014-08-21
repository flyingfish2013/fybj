package code.main.bean.util;

import java.text.ParseException;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Map;

public class DateTimeUtils {

	@SuppressWarnings("static-access")
	public static String after(String nowTime, Integer number) {
		String time = "";
		String pattern = "yyyy-MM-dd HH:mm:ss";
		SimpleDateFormat sdf = new SimpleDateFormat(pattern);
		Date now = null;
		try {
			now = sdf.parse(nowTime);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		Calendar c = Calendar.getInstance();
		c.setTime(now);
		c.add(Calendar.DAY_OF_MONTH, number);
		time = c.get(c.YEAR)
				+"-"+((c.get(Calendar.MONTH)+1)< 10?"0"+(c.get(Calendar.MONTH)+1):(c.get(Calendar.MONTH)+1))
				+"-"+(c.get(Calendar.DAY_OF_MONTH)<10?"0"+c.get(Calendar.DAY_OF_MONTH):c.get(Calendar.DAY_OF_MONTH))
				+" "+(c.get(Calendar.HOUR_OF_DAY)<10?"0"+c.get(Calendar.HOUR_OF_DAY):c.get(Calendar.HOUR_OF_DAY))
				+":"+(c.get(Calendar.MINUTE)<10?"0"+c.get(Calendar.MINUTE):c.get(Calendar.MINUTE))
				+":"+(c.get(Calendar.SECOND)<10?"0"+c.get(Calendar.SECOND):c.get(Calendar.SECOND));
		return time;
	}
	
	@SuppressWarnings({ "unchecked", "static-access" })
	public static Map afterTime(String nowTime, Integer number) {
		String time = "";
		String pattern = "yyyy-MM-dd HH:mm:ss";
		SimpleDateFormat sdf = new SimpleDateFormat(pattern);
		Date now = null;
		try {
			now = sdf.parse(nowTime);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		Calendar c = Calendar.getInstance();
		c.setTime(now);
		c.add(Calendar.DAY_OF_MONTH, number);
		time = c.get(c.YEAR)
				+"-"+((c.get(Calendar.MONTH)+1)< 10?"0"+(c.get(Calendar.MONTH)+1):(c.get(Calendar.MONTH)+1))
				+"-"+(c.get(Calendar.DAY_OF_MONTH)<10?"0"+c.get(Calendar.DAY_OF_MONTH):c.get(Calendar.DAY_OF_MONTH))
				+" "+(c.get(Calendar.HOUR_OF_DAY)<10?"0"+c.get(Calendar.HOUR_OF_DAY):c.get(Calendar.HOUR_OF_DAY))
				+":"+(c.get(Calendar.MINUTE)<10?"0"+c.get(Calendar.MINUTE):c.get(Calendar.MINUTE))
				+":"+(c.get(Calendar.SECOND)<10?"0"+c.get(Calendar.SECOND):c.get(Calendar.SECOND));
		int day = c.get(Calendar.DAY_OF_WEEK);
		String[] weekday = {"星期天","星期一","星期二","星期三","星期四","星期五","星期六"};
		Map m = new HashMap();
		m.put("time", time);
		m.put("week", weekday[day-1]);
		m.put("day", day);
		return m;
	}

	public static String timeToString(Date date){
		String pattern = "yyyy-MM-dd HH:mm:ss";
		SimpleDateFormat sdf = new SimpleDateFormat(pattern);
		return sdf.format(date);
	}
	
	public static String getNowTimeString(){
		Date date = new Date();
		String pattern = "yyyy-MM-dd HH:mm:ss";
		SimpleDateFormat sdf = new SimpleDateFormat(pattern);
		return sdf.format(date);
	}
	
	public static String timeToString(Date date,String patern){
		SimpleDateFormat sdf = new SimpleDateFormat(patern);
		return sdf.format(date);
	}
	
	//两个时间段的月数
	public static int getMonths(String birth){
		  int y = 0;
		  Date d = new Date();
		  try{
			  SimpleDateFormat formatter = new SimpleDateFormat ("yyyy-MM-dd");
			  ParsePosition pos = new ParsePosition(0);
			  Date dt1=formatter.parse(birth,pos);
			  long l =  d.getTime() - dt1.getTime();
			  long t = l/(3600*24*1000);
			  y = (int) (t/30);
			  if(y==0){y=1;}
		  }catch(Exception e){
			  e.printStackTrace();
		  }
		return y;
	}
	
	public static int getMonths(String birth,String date){
		  int y = 0;
		  try{
			  SimpleDateFormat formatter = new SimpleDateFormat ("yyyy-MM-dd");
			  ParsePosition pos = new ParsePosition(0);
			  Date dt1=formatter.parse(birth,pos);
			  SimpleDateFormat formatter0 = new SimpleDateFormat ("yyyy-MM-dd");
			  ParsePosition pos0 = new ParsePosition(0);
			  Date dt0=formatter0.parse(date,pos0);
			  if(dt0.getTime()>=dt1.getTime()){
				  long l =  dt0.getTime() - dt1.getTime();
				  long t = l/(3600*24*1000);
				  y = (int) (t/30);
				  if(y==0){y=1;}
			  }
		  }catch(Exception e){
			  e.printStackTrace();
		  }
		return y;
	}
	
	//两个时间段的天数
	public static int getDays(String birth){
		  int y = 0;
		  Date d = new Date();
		  try{
			  SimpleDateFormat formatter = new SimpleDateFormat ("yyyy-MM-dd");
			  ParsePosition pos = new ParsePosition(0);
			  Date dt1=formatter.parse(birth,pos);
			  long l =  d.getTime() - dt1.getTime();
			  long t = l/(3600*1000*24);
			  y = (int) t;
		  }catch(Exception e){
			  e.printStackTrace();
		  }
		return y;
	}
	
	//获取当前下月时间
	public static String getNextMonthDate(){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");     
		 Calendar   calendar = Calendar.getInstance();
		 Date nextDate = new Date(); 
		 try {
			 nextDate = sdf.parse(sdf.format(new Date()));
		} catch (Exception e) {
			e.printStackTrace();
		}
		calendar.setTime(nextDate);    
		calendar.add(Calendar.DAY_OF_MONTH, 30); 
		return sdf.format(calendar.getTime()); 
	}
	
	//计算年龄
	public static String getNowAge(String birth,String date){
		int months = 0;
		if(date!=null){
			months = getMonths(birth,date);
		}else{
			months = getMonths(birth);
		}
		String str = "";
		if(months<12){
			str = months+"个月";
		}else{
			int year = months/12;
			int mon = months%12;
			str = year+"岁"; 
			if(mon>0){
				str += mon+"个月";
			}
		}
		return str;
	}
	
	@SuppressWarnings({ "unchecked" })
	public static Map getMonthDetail(String d, String pattern) {
		Calendar cal = Calendar.getInstance();
		SimpleDateFormat datef = new SimpleDateFormat(pattern);
		try {
			cal.setTime(datef.parse(d));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		Map result = new HashMap();
		result.put("year", cal.get(Calendar.YEAR));
		result.put("month",cal.get(Calendar.MONTH)+1);
		result.put("date", cal.get(Calendar.DAY_OF_MONTH));
		int day = cal.get(Calendar.DAY_OF_WEEK);
		String[] weekday = {"星期天","星期一","星期二","星期三","星期四","星期五","星期六"};
		result.put("day", day);
		result.put("dayc", weekday[day-1]);
		cal.set(Calendar.DATE, 1);
		cal.roll(Calendar.DATE, -1);
		Date endTime = cal.getTime();
		String endTime1 = datef.format(endTime);
		result.put("end", endTime1);
		result.put("last", ParamsFilter.converterToInt(endTime1.substring(8)));
		cal.set(GregorianCalendar.DAY_OF_MONTH, 1);
		Date beginTime = cal.getTime();
		String beginTime1 = datef.format(beginTime);
		result.put("start", beginTime1);
		result.put("first", ParamsFilter.converterToInt(beginTime1.substring(8)));
		
		cal.setTime(new Date());
		result.put("nowDate", cal.get(Calendar.DAY_OF_MONTH));
		return result;
	}
}
