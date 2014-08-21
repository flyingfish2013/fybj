Ext.onReady(function(){
	var nodes0=[],nodes1=[],nodes2=[];
	
	var tabPanel = {
		xtype:'tabpanel',
		id:'tabsPanel',
		activeItem:0,
		animScroll:true,
		enableTabScroll:true,
		plugins: new Ext.ux.TabCloseMenu(),
		items:[{
			title:'主&nbsp;页&nbsp;面',
			closable:false, 
			border:false,
			iconCls:'housetab',
			html:'<iframe frameborder="no" width="100%" height="100%" src="'+App.baseURL+'/common/welcome.jsp" ></iframe>'
		}]
	};
	if(hasPermission('sys_org')){
		nodes0.push({
			text:'地区管理',
			leaf:true,
			iconCls:'zzjg',
			listeners:{
				click:function(){
					var curPanel = Ext.getCmp('tabsPanel'),roleTab = curPanel.get('orgTab');
					if(!roleTab){
						App.loadScript([App.jsURL+'/sysManager/orgManager.js'],function(){
							App.tabs.orgManager.init();
						});
					}else{
						App.tabs.orgManager.active();
					}
				}
			}
		});
	}
	if(hasPermission('sys_user')){
		nodes0.push({
			text:'用户管理',
			leaf:true,
			iconCls:'userSuit',
			listeners:{
				click:function(){
					var curPanel = Ext.getCmp('tabsPanel'),userTab = curPanel.get('userTab');
					if(!userTab){
						App.loadScript([App.jsURL+'/sysManager/userManager.js'],function(){
							App.tabs.userManager.init();
						});
					}else{
						App.tabs.userManager.active();
					}
				}
			}
		});
	}
	if(hasPermission('sys_role')){
		nodes0.push({
			text:'角色管理',
			leaf:true,
			iconCls:'role',
			listeners:{
				click:function(){
					var curPanel = Ext.getCmp('tabsPanel'),roleTab = curPanel.get('roleTab');
					if(!roleTab){
						App.loadScript([App.jsURL+'/sysManager/roleManager.js'],function(){
							App.tabs.roleManager.init();
						});
					}else{
						App.tabs.roleManager.active();
					}
				}
			}
		});
	}
	if(hasPermission('sys_module')){
		nodes0.push({
			text:'模块管理',
			leaf:true,
			iconCls:'right',
			listeners:{
				click:function(){
					var curPanel = Ext.getCmp('tabsPanel'),willTab = curPanel.get('moduleTab');
					if(!willTab){
						App.loadScript([App.jsURL+'/sysManager/moduleManager.js'],function(){
							App.tabs.moduleManager.init();
						});
					}else{
						App.tabs.moduleManager.active();
					}
				}
			}
		});
	}
	if(hasPermission('sys_log')){
		nodes0.push({
			text:'日志管理',
			leaf:true,
			iconCls:'info',
			listeners:{
				click:function(){
					var curPanel = Ext.getCmp('tabsPanel'),tab = curPanel.get('logTab');
					if(!tab){
						App.loadScript([App.jsURL+'/sysManager/logManager.js'],function(){
							App.tabs.logManager.init();
						});
					}else{
						App.tabs.logManager.active();
					}
				}
			}
		});
	}
	var tree0 = new Ext.tree.TreePanel({
		rootVisible:false,
		border:false,
		autoHeight:true,
		useArrows:true,
		lines:false,
		root:{expanded: true,leaf:false,text:'',children:nodes0},
		autoWidth:true,
		style:'margin-bottom:5px;'
	});
	if(hasPermission('dat_commonDic')){
		nodes1.push({
			text:'系统常用字典',
			leaf:true,
			iconCls:'book',
			listeners:{
				click:function(){
					var curPanel = Ext.getCmp('tabsPanel'),tab = curPanel.get('commonDicTab');
					if(!tab){
						App.loadScript([App.jsURL+'/datManager/commonDic.js'],function(){
							App.tabs.commonDicManager.init();
						});
					}else{
						App.tabs.commonDicManager.active();
					}
				}
			}
		});
	}
	var tree1 = new Ext.tree.TreePanel({
		rootVisible:false,
		border:false,
		autoHeight:true,
		useArrows:true,
		lines:false,
		root:{expanded: true,leaf:false,text:'',children:nodes1},
		autoWidth:true,
		style:'margin-bottom:5px;'
	});
	if(hasPermission('hos_unit')){
		nodes2.push({
			text:'单位管理',
			leaf:true,
			iconCls:'hospitaltab',
			listeners:{
				click:function(){
					var curPanel = Ext.getCmp('tabsPanel'),unitTab = curPanel.get('unitTab');
					if(!unitTab){
						App.loadScript([App.jsURL+'/hosManager/unitManager.js'],function(){
							App.tabs.unitManager.init();
						});
					}else{
						App.tabs.unitManager.active();
					}
				}
			}
		});
	}
	if(hasPermission('hos_doctor')){
		nodes2.push({
			text:'医生管理',
			leaf:true,
			iconCls:'userSuit',
			listeners:{
				click:function(){
					var curPanel = Ext.getCmp('tabsPanel'),doctorTab = curPanel.get('doctorTab');
					if(!doctorTab){
						App.loadScript([App.jsURL+'/hosManager/doctorManager.js'],function(){
							App.tabs.doctorManager.init();
						});
					}else{
						App.tabs.doctorManager.active();
					}
				}
			}
		});
	}
	if(hasPermission('hos_archive')){
		nodes2.push({
			text:'病人管理',
			leaf:true,
			iconCls:'userSuit',
			listeners:{
				click:function(){
					var curPanel = Ext.getCmp('tabsPanel'),
                        archiveTab = curPanel.get('archiveTab');
					if(!archiveTab){
						App.loadScript([App.jsURL+'/hosManager/archiveManager.js'],function(){
							App.tabs.archiveManager.init();
						});
					}else{
						App.tabs.archiveManager.active();
					}
				}
			}
		});
	}
	var tree2 = new Ext.tree.TreePanel({
		rootVisible:false,
		border:false,
		autoHeight:true,
		useArrows:true,
		lines:false,
		root:{expanded: true,leaf:false,text:'',children:nodes2},
		autoWidth:true,
		style:'margin-bottom:5px;'
	});
	var viewPort = new Ext.Viewport({
		layout:'border',
		items:[{
			region:'north',
			height:73,
			split:false,
			margins : '0 5',
			contentEl:'head',
			border:false
		},{
			region:'west',
			width:220,
			minSize:220,
			maxWidth:250,
			margins:'0 0 5 5',
			collapseMode:'mini',
			miniClose:true,
			split:true,
			layout:'fit',
			iconCls:'sysoper',
			items:[{
				border:false,
				layout:'accordion',
				defaults : {
					border : false,
					layout:'fit',
					paddings:'10 0 0 0',
					collapseFirst:true
				},
				layoutConfig : {
					titleCollapse : true,
					animate : true,
					activeOnTop : false,
					fill:false,
					collapseFirst:false
				},
				items:[{
					hidden:!hasPermission('sys'),
					title:'<b class="tit">系统权限管理</b>',
					iconCls:'sysMgr',
					items:tree0
				},{
					hidden:!hasPermission('dat'),
					title:'<b class="tit">系统数据维护</b>',
					iconCls:'dataMgr',
					items:tree1
				},{
					hidden:!hasPermission('hos'),
					title:'<b class="tit">妇幼保健院管理</b>',
					iconCls:'hospitaltab',
					items:tree2
				}]
			}]
		},{
			region:'center',
			layout:'fit',
			margins:'0 5 5 0',
			split:true,
			border:false,
			id:'centerPanel',
			items:tabPanel
		}]
	});
	App.timeFun();
	App.isDoLogin();
	App.removeLoading();
});