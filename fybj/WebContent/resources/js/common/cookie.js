var CookieHelper = 
{
	/*
	 * 获取Cookie
	 */
	GetCookie : function(key) {
		var cookieStr = key + "=";
		if (document.cookie.length > 0) {
			var index1 = document.cookie.indexOf(cookieStr);
			if (index1 != -1) {
				index1 += cookieStr.length;
			}
			var index2 = document.cookie.indexOf(";", index1);
			if (index2 == -1) {
				index2 = document.cookie.length;
			}
			return unescape(document.cookie.substring(index1, index2));
		}
		return "";
	},
	/*
	 * 设置Cookie
	 */
	SetCookie : function(key, value) {
		var date = new Date();
		// var year = date.getFullYear();
		var hour = date.getHours();
		var day = date.getDate();
		day = day + 30;
		date.setDate(day);
		date.setHours(23, 59, 59);
		document.cookie = key + "=" + value + ";path=/;expires="
				+ date.toGMTString();// 设置Cookie值,路径,过期时间
	},

	/*
	 * 删除Cookie
	 */
	DelCookie : function(key) {
		var date = new Date();
		date.setTime(date.getTime() - 1);
		var val = CookieHelper.GetCookie(key);
		if (val != "")
			document.cookie = key + "=" + val + ";path=/;expires="
					+ date.toGMTString();
	}
}