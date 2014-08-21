<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ include file="/common/taglib.jsp" %>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>主页</title>
	<link rel="stylesheet" type="text/css" href="${ext_dir}/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="${ext_dir}/ux/uploadDialog/css/icons.css"/>
	<link rel="stylesheet" type="text/css" href="${ext_dir}/ux/uploadDialog/css/UploadDialog.css"/>
	<link rel="stylesheet" type="text/css" href="${ext_dir}/ux/css/Spinner.css"/>
	<link rel="stylesheet" type="text/css" href="${css_dir}/common.css" />
	<script type="text/javascript" src="${ext_dir}/ext-base.js"></script>
	<script type="text/javascript" src="${ext_dir}/ext-all.js"></script>
	<script type="text/javascript" src="${ext_dir}/ux/TabCloseMenu.js"></script>
	<script type="text/javascript" src="${ext_dir}/ux/ComboPageSize.js"></script>
	<script type="text/javascript" src="${ext_dir}/ux/ComboTree.js"></script>
	<script type="text/javascript" src="${ext_dir}/ux/uploadDialog/swfupload.js"></script>
	<script type="text/javascript" src="${ext_dir}/ux/uploadDialog/UploadPanel.js"></script>
	<script type="text/javascript" src="${ext_dir}/ux/DateTimeField.js"></script>
	<script type="text/javascript" src="${ext_dir}/ux/Spinner.js"></script>
	<script type="text/javascript" src="${ext_dir}/ux/SpinnerField.js"></script>
	<script type="text/javascript" src="${ext_dir}/ext-lang-zh_CN.js"></script>	
	<script type="text/javascript" src="${jquery_dir}/jquery.js"></script>
	<script type="text/javascript" src="${js_dir}/common/loadFile.js"></script>
	<script type="text/javascript" src="${js_dir}/common/base.js"></script>
	<script type="text/javascript" src="${js_dir}/common/module.js"></script>
	<script type="text/javascript" src="${js_dir}/common/dateUtil.js"></script>
	<script type="text/javascript" src="${js_dir}/index.js"></script>
	<script type="text/javascript">
		Ext.BLANK_IMAGE_URL = App.blankImgURL;
		Ext.QuickTips.init();
		Ext.form.Field.prototype.msgTarget = 'side';
		var sinfo = {
			id:'${sessionScope.sessonUser.id}',
			username:'${sessionScope.sessonUser.username}',
			userType:'${sessionScope.sessonUser.userType}',
			rocs:Ext.decode("<%=session.getAttribute("acls")%>")
		};
		
		/**
		 * 判断当前用户是否具有当前应用模块的操作权限
		 * modelId 当前应用模块代码
		 */
		 function hasPermission(modelId){
			var flag = false;
			var rocs = sinfo.rocs;
			if(rocs){
				for ( var i = 0; i < rocs.length; i++) {
					if(modelId == rocs[i]){
						flag = true;
						break;
					}else{
						flag = false;
					}
				}
			}
			return flag;
		}
	</script>
</head>
<body>
	<%@ include file="/common/loading.jsp" %>
	<div id="head">
		<div id="left"><img src="${images_dir}/main/logo.jpg" height="73"/></div>
		<div id="right">
			<div style="height: 50%;width: 100%;padding: 6px 0px 0px 0px;">
				<a id="sessionUsername" style="color:#fff;">${sessionScope.sessonUser.username}</a>&nbsp;|&nbsp;
				<a onclick="App.updatePwd();" style="color:#fff;">修改密码</a>&nbsp;|&nbsp;
				<a onclick="App.doLogout();" style="color:#fff;">退出&nbsp;</a>
			</div>
			<div style="height: 50%;width: 100%;">
				<div id="timer"></div>
			</div>
		</div>
	</div>
	<!-- 营养素查询 -->
	<div id="nutrientsBtns">
		<ul>
			<li id="nl_千卡" class='nutBtn'>能  量</li>
			<li id="dbz_克" class='nutBtn'>蛋白质</li>
			<li id="tshhw_克" class='nutBtn'>碳水化合物</li>
			<li id="zf_克" class='nutBtn'>脂  肪</li>
			<li id="sf_克" class='nutBtn'>水  分</li>
			<li id="ssxw_克" class='nutBtn'>膳食纤维</li>
			<li id="dgc_毫克" class='nutBtn'>胆固醇</li>
			<li id="hf_克" class='nutBtn'>灰  份</li>
			<li id="wssa_微克" class='nutBtn'>维生素A</li>
			<li id="hlbs_微克" class='nutBtn'>胡萝卜素</li>
			<li id="shcva_微克" class='nutBtn'>视黄醇VA</li>
			<li id="wssb1_毫克" class='nutBtn'>硫胺素VB1</li>
			<li id="wssb2_毫克" class='nutBtn'>核黄素VB2</li>
			<li id="nksg_毫克" class='nutBtn'>尼克酸谷</li>
			<li id="wssc_毫克" class='nutBtn'>维生素C</li>
			<li id="wsse_毫克" class='nutBtn'>维生素E</li>
			<li id="ys_毫克" class='nutBtn'>烟  酸</li>
			<li id="yes_微克" class='nutBtn'>叶  酸</li>
			<li id="gai_毫克" class='nutBtn'>钙</li>
			<li id="lin_毫克" class='nutBtn'>磷</li>
			<li id="jia_毫克" class='nutBtn'>钾</li>
			<li id="na_毫克" class='nutBtn'>钠</li>
			<li id="mei_毫克" class='nutBtn'>镁</li>
			<li id="tie_毫克" class='nutBtn'>铁</li>
			<li id="xi_微克" class='nutBtn'>硒</li>
			<li id="tong_毫克" class='nutBtn'>铜</li>
			<li id="meng_毫克" class='nutBtn'>锰</li>
			<li id="fu_毫克" class='nutBtn'>氟</li>
			<li id="gu_毫克" class='nutBtn'>钴</li>
			<li id="dian_毫克" class='nutBtn'>碘</li>
		</ul>
	</div>
</body>
</html>