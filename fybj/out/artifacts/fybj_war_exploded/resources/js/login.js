Ext.onReady(function(){
	var win = new Ext.Window({
		title: '用户登录',
        width: 280,
        height: 200,
        plain: true,
        closable:false,
        constrain:true,
        modal:true,
        resizable:false,
        layout: 'fit',
        items:{
        	xtype:'form',
        	ref:'loginForm',
        	border:false,
        	style:'background-color:#fff;padding-top:10px;',
        	labelWidth: 50,
        	labelAlign:"right",
        	defaults: {anchor: '93%'},
       		defaultType: 'textfield',
        	items:[{
        		value:'admin',
        		fieldLabel: '用户名',
            	ref:'../username',
            	allowBlank:false
        	},{
        		value:'admin',
				fieldLabel:'密&nbsp;&nbsp;&nbsp;码',
				ref:'../password',
				inputType:'password',
				allowBlank:false
        	},{
        		fieldLabel:'验证码',
				ref:'../randCode',
				allowBlank:false,
				maxLength:4,
				minLength:4
        	},{
        		xtype:'label',
        		html:'<img src="'+App.baseURL+'/randCode" style="cursor:pointer;padding-left:50px" id="randCodeImg"/>'
        	}],
        	bbar:['->',{
				text:'登陆',
				iconCls:'sure',
				id:'login',
				handler:function(){
					if(!win.loginForm.getForm().isValid()){return;}
					var username = win.username.getValue(),
					password = win.password.getValue(),
					rand = win.randCode.getValue();
					var myMask = new Ext.LoadMask(win.el,{msg:'登陆中...',removeMask:true});
					myMask.show();
					Ext.Ajax.request({
						url:App.baseURL + '/doLogin',
						method:'POST',
						params:{username:username, password:password, rand:rand},
						success:function(res){
							var ret = Ext.decode(res.responseText);
							if(ret.flag){
								window.location = App.baseURL+'/index';
							}else{
								myMask.hide();
								Ext.Msg.alert('提示',ret.msg);
							}
						},
						failure:function(){myMask.hide();}
					});
					
				}
			},'-',{
				text:'重置',
				iconCls:'reset',
				handler:function(){
					win.loginForm.getForm().reset();
				}
			}]
        }
	}).show();;
	
	App.removeLoading();
	randCode();
});

function randCode(){
	Ext.get('randCodeImg').on('click',function(){
		Ext.getDom('randCodeImg').src = App.baseURL+'/randCode?time='+new Date();
	});
}