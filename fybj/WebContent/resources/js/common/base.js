var App = (function (){
	return {
		baseURL:window.location.protocol + '//' + window.location.host + '/' + window.location.pathname.split('/')[1],
		imgURL:window.location.protocol + '//' + window.location.host + '/' + window.location.pathname.split('/')[1]+'/resources/images',
		jsURL:window.location.protocol + '//' + window.location.host + '/' + window.location.pathname.split('/')[1]+'/resources/js',
		blankImgURL:window.location.protocol + '//' + window.location.host + '/' + window.location.pathname.split('/')[1]+'/resources/jslib/extjs3.4.0/resources/images/default/s.gif',
		imageBrowseURL:'http://localhost:8081/icons/',
		tabs:{},
		modules:{},
		regNull:/^\s*$/,
		regTel:/(^((\d{3}|\d{4})-)?(\d{7}|\d{8}))$|((13[0-9]|15[0-9]|18[0-9])\d{8}$)/,
		regTelTxt:'固话电话格式：0952-2028570；手机号码格式：13895357688',
		regSfz:/^(\d{15})|(\d{18})|(\d{14}([xX]|[yY]))|(\d{17}([xX]|{yY}))$/,
		regSfzTxt:'输入标准身份证号！',
		regEmail:/^\w+@\w+\.\w+$/,
		regEmailTxt:'输入标准电子邮件！',
		borderColor:"#99BBE8",
		dicType:{
			//字典类型
			tyjgfl:'托幼机构分类',
			tyjgxz:'托幼机构性质',
			gzryfl:'工作人员分类',
			zjlx:'证件类型',
			gzlx:'工作类型',
			ryfl:'入园分类',
			lyfl:'离园分类',
			xdwt:'消毒物体',
			dwxz:'单位性质',
			dwjb:'单位级别',
			gzgw:'工作岗位',
			nj:'年级',
			xl:'学历',
			zc:'职称',
			pf:'皮肤',
			gms:'过敏史',
			ed:'耳朵',
			tr:'头颅',
			xk:'胸廓',
			gp:'肝脾',
			wszq:'外生殖器',
			jzsz:'脊柱四肢',
			yb:'咽部',
			xf:'心肺',
			cjb:'常见病',
			crb:'传染病',
			gz:'转归',
            gj:'国籍',
            mz:'民族',
            hjlx:'户籍分类',
            hjgs:'户籍归属',
            zy:'职业',
            xb:'性别'
		},
		loadScript:function(scripts,callback){
			//加载js文件
			if(scripts){
				var obj = {scripts: scripts};
				if(callback){obj.callback = callback;}
				common.ScriptMgr.load(obj); 
			}
		},
		removeLoading:function(){
			//去除进度条
			window.setTimeout(function(){
				Ext.get('loading').remove();
				Ext.get('loading-mask').fadeOut({remove:true});
			},1000);
		},
		timeFun:function(){
			//系统时间函数
			var now = new Date();
			var year = now.getFullYear();
			var month = (now.getMonth()+1) < 10 ? '0'+(now.getMonth()+1) : (now.getMonth()+1);
			var date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
			var hours = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
			var minutes = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
			var seconds = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
			var day = now.getDay();
			var chineseNum = ['天','一','二','三','四','五','六'];
			var timerHtml = year + '年' + month +'月' + date + '日' + '&nbsp;&nbsp;星期' + chineseNum[day] +'&nbsp;&nbsp;' +hours +':'+ minutes+':'+seconds+'  ';
			Ext.getDom('timer').innerHTML =  timerHtml;
			setTimeout('App.timeFun()',1000);
		},
		isDoLogin:function(){
			//判断是否已经登录
			if(!sinfo.id){
				App.removeLoading();
				Ext.Msg.alert('提示','您当前登录用户已经失效,请重新登录!');
				window.location = App.baseURL+"/login";
			}
		},
		doLogout:function(){
			//退出系统
			Ext.Msg.confirm('提示','确定要退出吗？',function(btn){
				if(btn=="yes"){
					Ext.Ajax.request({
						url:App.baseURL+'/doLogout',
						success:function(res){
							var res = Ext.decode(res.responseText);
							if(res.flag){
								window.location = App.baseURL+"/login";
							}
						}
					});
				}
			});
		},
		updatePwd:function(){
			//修改密码
			var pwdWin = new Ext.Window({
				title:'修改密码',
				height:240,
				width:320,
				iconCls:'update',
				constrain:true,
				modal:true,
				resizable:false,
				renderTo:Ext.getBody(),
				closeAction:'close',
				bodyStyle:'background-color:white;',
				listeners:{
					close:function(){pwdWin.destroy();pwdWin = null;}
				},
				items:[new Ext.form.FormPanel({
					ref:'itemForm',
					layout:'form',
					border:false,
					labelWidth:75,
					labelAlign:'right',
					buttonAlign:'center',
					defaults:{anchor:'93%',xtype:'textfield',ctCls:'formMargin',labelStyle:'margin-top:8px;'},
					items:[{
						fieldLabel:'用 户 名',
						ref:'../username',
						disabled:true,
						value:sinfo.username
					},{
						fieldLabel:'用户类型',
						ref:'../userType',
						disabled:true,
						value:sinfo.userType
					},{
						fieldLabel:'原始密码',
						inputType:'password',
						allowBlank:false,
						ref:'../oldPassword'
					},{
						fieldLabel:'新 密 码',
						inputType:'password',
						allowBlank:false,
						maxLength:20,
						ref:'../password'
					},{
						fieldLabel:'确认密码',
						inputType:'password',
						allowBlank:false,
						ref:'../rePassword'
					}]
				})],
				bbar:['->',{
					text:'修改',
					iconCls:'saveBtn',
					handler:function(){
						if(!pwdWin.itemForm.getForm().isValid()){return;}
						var password = pwdWin.password.getValue(),
						rePassword = pwdWin.rePassword.getValue();
						if(password!=rePassword){Ext.Msg.alert('提示','确认密码与新密码不一致!');return;}
						var myMask = new Ext.LoadMask(pwdWin.el,{msg:'正在保存数据...',removeMask:true});
						myMask.show();
						Ext.Ajax.request({
							url:App.baseURL+'/user/update',
							method:'POST',
							params:{username:sname,userType:stype,id:sinfo.id,password:password},
							success:function(res){
								myMask.hide();
								var ret = Ext.decode(res.responseText);
								if(ret.flag){
									Ext.Msg.alert('提示','操作成功');
									pwdWin.close();
								}else{
									Ext.Msg.alert('提示',ret.msg);
								}
							},
							failure:function(res){
								Ext.Msg.alert('提示',res.responseText);
								myMask.hide();}
						});
					}
				},'-',{text:'重置',iconCls:'resetBtn',handler:function(){pwdWin.itemForm.getForm().reset();}},
				'-',{text:'取消',iconCls:'cancelBtn',handler:function(){pwdWin.close();}
				}]
			});
			pwdWin.show();
		}
	}
})();