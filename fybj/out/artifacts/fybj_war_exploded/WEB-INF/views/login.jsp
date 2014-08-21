<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ include file="/common/taglib.jsp" %>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>登录</title>
	<link rel="stylesheet" type="text/css" href="${ext_dir}/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="${css_dir}/common.css" />
	<script type="text/javascript" src="${ext_dir}/ext-base.js"></script>
	<script type="text/javascript" src="${ext_dir}/ext-all.js"></script>
	<script type="text/javascript" src="${ext_dir}/ext-lang-zh_CN.js"></script>	
	<script type="text/javascript" src="${js_dir}/common/base.js"></script>
	<script type="text/javascript">
		Ext.BLANK_IMAGE_URL = App.blankImgURL;
		Ext.QuickTips.init();
		Ext.form.Field.prototype.msgTarget = 'side';
	</script>
	<script type="text/javascript" src="${js_dir}/login.js"></script>
</head>
<body>
	<%@ include file="/common/loading.jsp" %>
</body>
</html>