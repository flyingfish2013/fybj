App.tabs.logManager = (function(){
	var limit = 20,tabId= 'logTab',addOrUpdateWin = null;	
	
	function init(){
		var curPanel = Ext.getCmp('tabsPanel');
		var store = new Ext.data.Store({
			autoLoad:false,
			proxy:new Ext.data.HttpProxy({url:App.baseURL+'/log/list'}),
			reader:new Ext.data.JsonReader({
				totalProperty:'totalCount',
				root:'datas',
				idProperty:'id',
				fields:[{name:'id'},{name:'logDate'},{name:'operate'},{name:'ip'},{name:'username'},{name:'userType'},{name:'unit'},{name:'address'}]
			}),
			baseParams:{start:0,limit:limit}
		}),
		sm = new Ext.grid.CheckboxSelectionModel({singleSelect:false}),
		cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),sm,
			{header : '<center>操作IP</center>',dataIndex : 'ip',sortable : true,align:'center',width : 100},
			{header : '<center>操作时间</center>',dataIndex : 'logDate',sortable : true,align:'center',width : 140},
			{header : '<center>操作内容</center>',dataIndex : 'operate',sortable : true,width:200},
			{header : '<center>用户名</center>',dataIndex : 'username',sortable : true,width : 80},
			{header : '<center>用户类型</center>',align:'center',dataIndex : 'userType',sortable : true,width : 80},
			{header : '<center>所在单位</center>',dataIndex : 'unit',width : 150},
			{header : '<center>单位所在地区</center>',dataIndex : 'address',id:'cznr'}
		]),
		grid = new Ext.grid.GridPanel({
			style:'border-top:1px solid '+App.borderColor,
			id:'logGrid',
			region:'center',
			border : false,
			columnLines : true,
			autoScroll : true,
			store : store,
			autoHeight:false,
			stripeRows:true,
			autoExpandColumn:'cznr',
			cm : cm,
			sm : sm,
			loadMask : {msg : '正在加载数据……'},
			bbar:new Ext.PagingToolbar({
				pageSize : limit,
				store : store,
				emptyMsg : "<font color='red'>没有记录</font>",
				displayInfo : true,
				plugins:new Ext.ux.ComboPageSize({addToItem:true,index:10})
			}),
			tbar:[
				' ',{text:'删除',iconCls:'delete',hidden:!hasPermission('sys_log_delete'),handler:doDelete},
				' ',{text:'批量删除',iconCls:'batchdelete',hidden:!hasPermission('sys_log_batchDelete'),handler:doBatchDelete},
				'->',{text:'查&nbsp;&nbsp;询',iconCls:'query',handler:function(){
					var formWin = Ext.getCmp('logCon');
					formWin.expand();
					var operate = formWin.operate.getValue(),
					endTime = formWin.endTime.getValue(),
					beginTime = formWin.beginTime.getValue(),
					username = formWin.username.getValue();
					Ext.apply(store.baseParams,{operate:operate,endTime:(endTime?endTime.format('Y-m-d H:i:s'):''),beginTime:(beginTime?beginTime.format('Y-m-d H:i:s'):''),username:username});
					store.load();
				}},
				'-',{text:'刷&nbsp;&nbsp;新',iconCls:'refresh',handler:function(){store.reload();}}]
		}),
		tab = curPanel.add({
			title : '&nbsp;日志管理&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
			id : tabId,
			closable : true,
			layout : 'border',
			iconCls:'info',
			activeItem :0,
			items:[{
				region:'north',
				border:false,
				split:true,
				collapsed:true,
				id:'logCon',
				collapseMode:'mini',
				style:'border-bottom:1px solid '+App.borderColor,
				height:35,
				layout:'column',
				items:[{
					xtype:'form',
					columnWidth:.25,
					border:false,
					labelWidth:60,
					labelAlign:'right',
					defaults:{anchor:'93%',xtype:'textfield',ctCls:'formMargin-1'},
					items:[{
						fieldLabel:'开始时间',
						editable:false,
						xtype:'datetimefield',
						format:'Y-m-d H:i:s',
						ref:'../beginTime'
					}]
				},{
					xtype:'form',
					columnWidth:.25,
					border:false,
					labelWidth:60,
					labelAlign:'right',
					defaults:{anchor:'93%',xtype:'textfield',ctCls:'formMargin-1'},
					items:[{
						fieldLabel:'结束时间',
						editable:false,
						xtype:'datetimefield',
						format:'Y-m-d H:i:s',
						ref:'../endTime'
					}]
				},{
					xtype:'form',
					columnWidth:.25,
					border:false,
					labelWidth:60,
					labelAlign:'right',
					defaults:{anchor:'93%',xtype:'textfield',ctCls:'formMargin-1'},
					items:[{
						fieldLabel:'用户名',
						ref:'../username'
					}]
				},{
					xtype:'form',
					columnWidth:.25,
					border:false,
					labelWidth:60,
					labelAlign:'right',
					defaults:{xtype:'textfield',ctCls:'formMargin-1',anchor:'93%'},
					items:[{
						fieldLabel:'操作内容',
						ref:'../operate'
					}]
				}]
			},grid]
		});	
		curPanel.setActiveTab(tab);
		store.load();
	}
	
	function doBatchDelete(){
		var grid = Ext.getCmp('logGrid');
		var batchWin = new Ext.Window({
			title:'批量删除',
			height:180,
			width:300,
			iconCls:'batchdelete',
			constrain:true,
			modal:true,
			resizable:false,
			autoScroll:true,
			renderTo:tabId,
			closeAction:'close',
			layout:'fit',
			listeners:{close:function(){batchWin.destroy();batchWin = null;}},
			items:[new Ext.form.FormPanel({
				ref:'itemForm',
				layout:'form',
				border:false,
				labelWidth:80,
				labelAlign:'right',
				buttonAlign:'center',
				defaults:{anchor:'93%',xtype:'textfield',ctCls:'formMargin',labelStyle:'margin-top:8px;'},
				items:[{
					fieldLabel:'开始时间',
					editable:false,
					xtype:'datetimefield',
					format:'Y-m-d H:i:s',
					ref:'../beginTime'
				},{
					fieldLabel:'结束时间',
					editable:false,
					xtype:'datetimefield',
					format:'Y-m-d H:i:s',
					ref:'../endTime'
				},{
					fieldLabel:'操作内容',
					ref:'../operate'
				}],
				bbar:['->',{
					text:'删除',
					iconCls:'batchdelete',
					handler:function(){
						if(!batchWin.itemForm.getForm().isValid()){return;}
						var operate = batchWin.operate.getValue(),
						endTime = batchWin.endTime.getValue(),
						beginTime = batchWin.beginTime.getValue();
						Ext.Ajax.request({
							url:App.baseURL+'/log/batchDelete',
							params:{operate:operate,endTime:(endTime?endTime.format('Y-m-d H:i:s'):''),beginTime:(beginTime?beginTime.format('Y-m-d H:i:s'):'')},
							success:function(response){
								var json = Ext.decode(response.responseText);
								if(json.flag){
									Ext.Msg.alert("提示","删除成功");
									grid.getStore().reload();  
									batchWin.close();
								}else{
									Ext.Msg.alert("提示","删除失败");
								}
							}
						});
					}
				},'-',{text:'重置',iconCls:'resetBtn',handler:function(){batchWin.itemForm.getForm().reset();}},
				'-',{text:'取消',iconCls:'cancelBtn',handler:function(){batchWin.close();}
				}]
			})]
		});
		batchWin.show();
	}
	
	function doDelete(){
		var ids = '',grid = Ext.getCmp('logGrid'),selects = grid.getSelectionModel().getSelections();
		if(selects.length <= 0){
			Ext.Msg.alert('提示','请选择记录进行删除!');
			return;
		}
		for (var i = 0; i < selects.length; i++) {
			ids += ',' + selects[i].json.id;
		}
		Ext.Msg.confirm("提示","确定要删除吗？",function(val){
			if(val=='yes'){
				 Ext.Ajax.request({
					url:App.baseURL+"/log/delete",
					method:'POST',
					params:{ids:ids.substring(1)},
					success:function(response){
						var json = Ext.decode(response.responseText);
						if(json.flag){
							Ext.Msg.alert("提示","删除成功");
							grid.getStore().reload();
						}else{
							Ext.Msg.alert("提示","删除失败");
						}
					},
					failure:function(){
						Ext.Msg.alert('提示','删除出错');
					}
				});
			}
		});
	}
	
	/** 激活面板 **/
	function active(){
		var curPanel = Ext.getCmp('tabsPanel');
		curPanel.setActiveTab(tabId);
	}
	
	return {
		init:init,
		active:active
	};
})();	