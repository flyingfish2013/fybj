App.tabs.commonDicManager = (function(){
	var limit = 20,tabId= 'commonDicTab',addOrUpdateWin = null;	
	function init(){
		var curPanel = Ext.getCmp('tabsPanel');
		var store = new Ext.data.GroupingStore({
			groupField:'type',
			proxy:new Ext.data.HttpProxy({url:App.baseURL+'/commonDic/list'}),
			reader:new Ext.data.JsonReader({
				totalProperty:'totalCount',
				root:'datas',
				idProperty:'id',
				fields:[{name:'id'},{name:'type'},{name:'name'}]
			}),
			baseParams:{start:0,limit:limit}
		}),
		grid = new Ext.grid.GridPanel({
			id:'commonDicGrid',
			border : false,
			columnLines : true,
			autoScroll : true,
			store : store,
			columns:[
				new Ext.grid.RowNumberer(),
				{header : '<center>分  类</center>',dataIndex : 'type',width : 200},
				{header : '<center>内  容</center>',dataIndex : 'name',width : 250}
			],
			loadMask : {msg : '正在加载数据……'},
			view: new Ext.grid.GroupingView({
				forceFit:false,
				startCollapsed:false,
				showGroupName:false,
				groupTextTpl: '<div style="font-weight:normal;">{text}(总数：<font color="red">{[values.rs.length]}</font>条)</div>'
			}),
			bbar:new Ext.PagingToolbar({
				pageSize : limit,
				store : store,
				emptyMsg : "<font color='red'>没有记录</font>",
				displayInfo : true,
				plugins:new Ext.ux.ComboPageSize({addToItem:true,index:10})
			}),
			tbar:[
				' ',{text:'添加',iconCls:'add',hidden:!hasPermission('dat_commonDic_add'),handler:function(){showAddOrUpdate('add')}},
				' ',{text:'修改',iconCls:'update',hidden:!hasPermission('dat_commonDic_update'),handler:function(){showAddOrUpdate('update')}},
				//' ',{text:'删除',iconCls:'delete',hidden:!hasPermission('dat_commonDic_delete'),handler:doDelete},
				'->',{
					xtype:'combo',
					id:'typeCon',
					fieldLabel:"分类",
					triggerAction:"all",
					mode:"local",
					maxLength:20,
					emptyText:"请选择分类",
					store:new Ext.data.Store({
						autoLoad:true,
						proxy:new Ext.data.HttpProxy({url:App.baseURL+"/commonDic/listType"}),
						reader:new Ext.data.JsonReader({fields:[{name:'typename'}]})
					}),
					displayField:"typename",
	 				valueField:"typename",
	 				editable:false,
					autoShow:true
				},' ',{fieldLabel:'内  容',xtype:'textfield',id:'nameCon',emptyText:'输入内容关键字查找'},' ',
				{text:'查&nbsp;&nbsp;询',iconCls:'query',handler:function(){
					var type = Ext.getCmp('typeCon').getValue();
					var name = Ext.getCmp('nameCon').getValue();
					store.load({params:{type:type,name:name}});
				}},
				'-',{text:'刷&nbsp;&nbsp;新',iconCls:'refresh',handler:function(){store.reload();}}]
		}),
		tab = curPanel.add({
			title : '&nbsp;系统常用字典&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
			id : tabId,
			closable : true,
			layout : 'fit',
			iconCls:'book',
			activeItem :0,
			items:[grid]
		});	
		curPanel.setActiveTab(tab);
		store.load();
	}
	
	/** 增加或者修改 **/
	function showAddOrUpdate(type){
		var title='',iconCls='',btnText='',url='',record=null,grid = Ext.getCmp('commonDicGrid');
		if(type == 'add'){
			title='添加系统常用字典信息',iconCls='add',btnText='保存',url=App.baseURL+'/commonDic/add';
		}else if(type == 'update'){
			title='修改系统常用字典信息',iconCls='update',btnText='修改',url=App.baseURL+'/commonDic/update';
			var selectRocords = grid.getSelectionModel().getSelections();
			if(selectRocords.length <= 0 || selectRocords.length > 1){
				Ext.Msg.alert('提示','请选择并且只能选择一条记录进行修改!');
				return;
			}else{
				record = selectRocords[0];
			}
		}
		if(!addOrUpdateWin){
			addOrUpdateWin = new Ext.Window({
				title:title,
				height:130,
				width:300,
				iconCls:iconCls,
				constrain:true,
				modal:true,
				resizable:false,
				autoScroll:true,
				renderTo:tabId,
				closeAction:'close',
				bodyStyle:'background-color:white;',
				listeners:{close:function(){addOrUpdateWin.destroy();addOrUpdateWin = null;}},
				items:[new Ext.form.FormPanel({
					ref:'itemForm',
					layout:'form',
					border:false,
					labelWidth:50,
					labelAlign:'right',
					buttonAlign:'center',
					defaults:{anchor:'93%',xtype:'textfield',ctCls:'formMargin-1',labelStyle:'margin-top:5px;'},
					items:[{
						xtype:'combo',
						ref:'../type',
						fieldLabel:"分类",
						allowBlank:false,
						triggerAction:"all",
						mode:"local",
						maxLength:20,
						emptyText:"请选择...",
						store:new Ext.data.Store({
							autoLoad:true,
							proxy:new Ext.data.HttpProxy({url:App.baseURL+"/commonDic/listType"}),
							reader:new Ext.data.JsonReader({fields:[{name:'typename'}]})
						}),
						displayField:"typename",
		 				valueField:"typename",
						autoShow:true
					},{
						fieldLabel:'内  容',
						allowBlank:false,
						maxLength:20,
						ref:'../name'
					}]
				})],
				bbar:['->',{
					text:btnText,
					iconCls:'saveBtn',
					handler:function(){
						if(!addOrUpdateWin.itemForm.getForm().isValid()){return;}
						var type = addOrUpdateWin.type.getValue(),
						name = addOrUpdateWin.name.getValue(),
						myMask = new Ext.LoadMask(addOrUpdateWin.el,{msg:'正在保存数据...',removeMask:true});
						myMask.show();
						Ext.Ajax.request({
							url:url,
							method:'POST',
							params:{id:record?record.data.id:null,type:type,name:name},
							success:function(res){
								myMask.hide();
								var ret = Ext.decode(res.responseText);
								if(ret.flag){
									Ext.Msg.alert('提示','保存成功');
									grid.getStore().reload();
									addOrUpdateWin.close();
								}else{
									Ext.Msg.alert('提示',ret.msg);
								}
							},
							failure:function(res){
								Ext.Msg.alert('提示',res.responseText);
								myMask.hide();}
						});
					}
				},'-',{text:'重置',iconCls:'resetBtn',handler:function(){addOrUpdateWin.itemForm.getForm().reset();}},
				'-',{text:'取消',iconCls:'cancelBtn',handler:function(){addOrUpdateWin.close();}
				}]
			});
		}
		addOrUpdateWin.show();
		if(type == 'update'){
			addOrUpdateWin.name.setValue(record.json.name);
			addOrUpdateWin.type.setValue(record.json.type);
		}
	}
	
	function doDelete(){
		var ids = '',grid = Ext.getCmp('commonDicGrid'),selects = grid.getSelectionModel().getSelections();
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
					url:App.baseURL+"/commonDic/delete",
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