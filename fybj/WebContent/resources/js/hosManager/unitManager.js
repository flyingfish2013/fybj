App.tabs.unitManager = (function(){
	var limit = 20,tabId = "unitTab",addOrUpdateWin;
	
	function init(){
		var curPanel = Ext.getCmp('tabsPanel');
		var store = new Ext.data.Store({
			autoLoad:false,
			proxy:new Ext.data.HttpProxy({url:App.baseURL+'/hospital/list'}),
			reader:new Ext.data.JsonReader({
				totalProperty:'totalCount',
				root:'datas',
				idProperty:'id',
				fields:[{name:'id'},{name:'name'},{name:'supe'},{name:'tel'},{name:'email'},{name:'nname'},{name:'nid'},{name:'lname'},{name:'lid'},{name:'address'},{name:'rid'},{name:'rname'}]
			}),
			baseParams:{start:0,limit:limit}
		}),
		sm = new Ext.grid.CheckboxSelectionModel({singleSelect:false}),
		cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),sm,
			{header : '<center>单位名称</center>',dataIndex : 'name',sortable : true,width : 200},
			{header : '<center>负责人</center>',dataIndex : 'supe',sortable : true,width : 100},
			{header : '<center>联系电话</center>',dataIndex : 'tel',sortable : true,width : 150},
			{header : '<center>电子邮件</center>',dataIndex : 'email',sortable : true,width : 150},
			{header : '<center>单位性质</center>',dataIndex : 'nname',sortable : true,width : 100},
			{header : '<center>单位级别</center>',dataIndex : 'lname',sortable : true,width : 100},
			{header : '<center>所在地区</center>',dataIndex : 'address',sortable : true,id : 'szdq'}
		]),
		grid = new Ext.grid.GridPanel({
			id:'unitGrid',
			border : false,
			columnLines : true,
			autoScroll : true,
			store : store,
			autoHeight:false,
			stripeRows:true,
			autoExpandColumn:'szdq',
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
			tbar:[{text:'添加',iconCls:'add',hidden:!hasPermission('hos_unit_add'),handler:function(){showAddOrUpdate('add');}},
				' ',{text:'修改',iconCls:'update',hidden:!hasPermission('hos_unit_update'),handler:function(){showAddOrUpdate('update');}},
				' ',{text:'删除',iconCls:'delete',hidden:!hasPermission('hos_unit_delete'),handler:doDelete},
				'->',{xtype:'textfield',emptyText:'输入名称关键字查找',id:'searchText-unit',width:120},' ',' ',' ',
				{xtype:"myComboxTree",emptyText:'请选择地区',width:200,id:'code-unit',
				 tree:new Ext.tree.TreePanel({
			   		id:'dqTree-unit',
					root : new Ext.tree.AsyncTreeNode({id : 'root',text : '根节点',expanded:true,leaf:false}),
					loader : new Ext.tree.TreeLoader({
						url : App.baseURL + '/org/findOrgTree2',
						baseParams:{pcode:''},
						listeners:{
							beforeLoad:function(loaderObj,node){
								loaderObj.baseParams.pcode = node.id;
							}
						}
					}),
					border : false,rootVisible : false,lines : false,autoScroll : true
				})
			},' ',{text:'查&nbsp;&nbsp;询',iconCls:'query',handler:search},
			'-',{text:'刷&nbsp;&nbsp;新',iconCls:'refresh',handler:function(){store.reload();}}]
		}),
		tab = curPanel.add({
			title : '&nbsp;单位管理&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
			id : tabId,
			closable : true,
			layout : 'card',
			iconCls:'hospitaltab',
			activeItem :0,
			items:[grid]
		});	
		curPanel.setActiveTab(tab);
		store.load();
	}
	
	/** 添加或者修改 **/
	function showAddOrUpdate(type){
		var title='',iconCls='',btnText='',url='',record=null;
		if(type == 'add'){
			title='添加单位信息',iconCls='add',btnText='保存',url=App.baseURL+'/hospital/add';
		}else if(type == 'update'){
			title='修改单位信息',iconCls='update',btnText='修改',url=App.baseURL+'/hospital/update';
			var grid = Ext.getCmp('unitGrid'),
			selectRocords = grid.getSelectionModel().getSelections();
			if(selectRocords.length <= 0){
				Ext.Msg.alert('提示','请选择一个单位进行修改!');
				return;
			}else if(selectRocords.length > 1){
				Ext.Msg.alert('提示','只能选择一个单位进行修改!');
				return;
			}else{
				record = selectRocords[0];
			}
		}
		if(!addOrUpdateWin){
			addOrUpdateWin = new Ext.Window({
				title:title,
				height:300,
				width:450,
				iconCls:iconCls,
				constrain:true,
				modal:true,
				resizable:false,
				renderTo:tabId,
				closeAction:'close',
				bodyStyle:'background-color:white;',
				listeners:{
					close:function(){addOrUpdateWin.destroy();addOrUpdateWin = null;}
				},
				items:[new Ext.form.FormPanel({
					ref:'itemForm',
					layout:'form',
					border:false,
					labelWidth:65,
					labelAlign:'right',
					buttonAlign:'center',
					defaults:{anchor:'93%',xtype:'textfield',ctCls:'formMargin',labelStyle:'margin-top:8px;'},
					items:[{
						fieldLabel:'单位名称',
						ref:'../name',
						allowBlank:false,
						maxLength:90
					},{
						fieldLabel:'负 责 人',
						ref:'../supe',
						allowBlank:false,
						maxLength:15
					},{
						fieldLabel:'联系电话',
						ref:'../tel',
						allowBlank:false,
						regex:App.regTel,
						regexText:App.regTelTxt,
						maxLength:30
					},{
						fieldLabel:'电子邮件',
						ref:'../email',
						regex:App.regEmail,
						regexText:App.regEmailTxt,
						maxLength:90
					},{
						xtype:'combo',
						ref:'../nid',
						fieldLabel:"单位性质",
						allowBlank:false,
						triggerAction:"all",
						mode:"local",
						emptyText:"请选择单位性质",
						store:new Ext.data.Store({
							autoLoad:true,
							proxy:new Ext.data.HttpProxy({url:App.baseURL+"/commonDic/listDic"}),
							reader:new Ext.data.JsonReader({fields:[{name:"id"},{name:"name"}]}),
							baseParams:{type:App.dicType.dwxz},
							listeners:{
								load:function(store,records,opts){
									if(record){
										addOrUpdateWin.nid.setValue(record.json.nid);
									}	
								}
							}
						}),
						displayField:"name",
		 				valueField:"id",
						editable:false,
						autoShow:true
					},{
						xtype:'combo',
						ref:'../lid',
						fieldLabel:"单位级别",
						allowBlank:false,
						triggerAction:"all",
						mode:"local",
						emptyText:"请选择单位级别",
						store:new Ext.data.Store({
							autoLoad:true,
							proxy:new Ext.data.HttpProxy({url:App.baseURL+"/commonDic/listDic"}),
							reader:new Ext.data.JsonReader({fields:[{name:"id"},{name:"name"}]}),
							baseParams:{type:App.dicType.dwjb},
							listeners:{
								load:function(store,records,opts){
									if(record){
										addOrUpdateWin.lid.setValue(record.json.lid);
									}	
								}
							}
						}),
						displayField:"name",
		 				valueField:"id",
						editable:false,
						autoShow:true
					},{
					   xtype:"myComboxTree",
					   fieldLabel:'所在地区',
					   allowBlank:false,
					   ref:'../rid',
					   tree:new Ext.tree.TreePanel({
					   		id:'dqTree',
							root : new Ext.tree.AsyncTreeNode({id : 'root',text : '根节点',expanded:true,leaf:false}),
							loader : new Ext.tree.TreeLoader({
								url : App.baseURL + '/org/findOrgTree',
								baseParams:{pcode:''},
								listeners:{
									beforeLoad:function(loaderObj,node){
										loaderObj.baseParams.pcode = node.attributes.code;
									}
								}
							}),
							border : false,
							rootVisible : false,
							lines : false,
							autoScroll : true
						})
					}]
				})],
				bbar:['->',{
					text:btnText,
					iconCls:'saveBtn',
					handler:function(){
						if(!addOrUpdateWin.itemForm.getForm().isValid()){return;}
						var name = addOrUpdateWin.name.getValue(),
						supe = addOrUpdateWin.supe.getValue(),
						tel = addOrUpdateWin.tel.getValue(),
						email = addOrUpdateWin.email.getValue(),
						nid = addOrUpdateWin.nid.getValue(),
						lid = addOrUpdateWin.lid.getValue(),
						rid = addOrUpdateWin.rid.value,
						myMask = new Ext.LoadMask(addOrUpdateWin.el,{msg:'正在保存数据...',removeMask:true});
						myMask.show();
						Ext.Ajax.request({
							url:url,
							method:'POST',
							params:{name:name,supe:supe,id:record?record.data.id:null,email:email,tel:tel,nid:nid,lid:lid,rid:rid},
							success:function(res){
								myMask.hide();
								var ret = Ext.decode(res.responseText);
								if(ret.flag){
									Ext.Msg.alert('提示','操作成功');
									Ext.getCmp('unitGrid').getStore().reload();
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
			addOrUpdateWin.name.setValue(record.data.name);
			addOrUpdateWin.supe.setValue(record.data.supe);
			addOrUpdateWin.tel.setValue(record.data.tel);
			addOrUpdateWin.email.setValue(record.data.email);
			addOrUpdateWin.rid.value = record.json.rid;
			addOrUpdateWin.rid.setRawValue(record.json.rname);
		}
	}
	
	/** 输入框查询 **/
	function search(){
		var searchtext = Ext.getCmp('searchText-unit').getValue(),
		code = Ext.getCmp('code-unit').value,
		_store = Ext.getCmp('unitGrid').getStore();
		Ext.apply(_store.baseParams,{name:searchtext,code:code});
		_store.load();
	}
	
	function doDelete(){
		var ids = '',grid = Ext.getCmp('unitGrid'),selects = grid.getSelectionModel().getSelections();
		if(selects.length <= 0){
			Ext.Msg.alert('提示','请选择记录进行删除!');
			return;
		}
		for (var i = 0; i < selects.length; i++) {
			ids += ',' + selects[i].json.id;
		}
		Ext.Msg.confirm("提示","删除妇幼保健院信息，将把妇幼保健院相关信息一起删除，您确定要删除吗？",function(val){
			if(val=='yes'){
				 Ext.Ajax.request({
					url:App.baseURL+"/hospital/delete",
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


