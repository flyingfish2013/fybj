App.tabs.roleManager = (function(){
	var limit = 20,tabId= 'roleTab',addOrUpdateWin = null,aclWin = null, acldWin = null;
	
	function initCheckStatus(aclTree,roleId){
		Ext.Ajax.request({
			url:App.baseURL+"/acl/findByRole",
			params:{roleId:roleId},
			success:function(res){
				var arr = Ext.decode(res.responseText);
				if(arr && arr.length>0){
					for(var i=0; i<arr.length; i++){
						var node = aclTree.getNodeById(arr[i].sysModuleId);
						if(node){
							node.ui.checkbox.checked = true;
							node.attributes.checked = true;
						}
					}
				}
			},
			failure:function(){}
		});
	}
	
	function saveAcl(roleId){
		var mids = "",  
		aclTree = Ext.getCmp('role_aclTree'),
		checkedNodes = aclTree.getChecked();
		if(checkedNodes && checkedNodes.length>0){
			for ( var i = 0; i < checkedNodes.length; i++) {
				mids += ","+checkedNodes[i].id;
			}
		}
		if(mids.indexOf(",") != -1){
			mids = mids.substring(1);
		}
		Ext.Ajax.request({
			url:App.baseURL+"/acl/add",
			params:{principalType:'role',principalId:roleId,mids:mids},
			success:function(res){
				var ret = Ext.decode(res.responseText);
				Ext.Msg.alert('提示',ret.msg);
			},
			failure:function(){}
		});
	}
	
	function showAclWin(record){
		var roleId = record.data.id;
		var tree = new Ext.tree.TreePanel({
			id : 'role_aclTree',
			root : new Ext.tree.AsyncTreeNode({id:'root',text:'根节点', expanded:true}),
			loader : new Ext.tree.TreeLoader({
				url : App.baseURL+'/module/findAll'
			}),
			border : false,
			rootVisible : false,
			lines : true,
			autoScroll : true,
			enableDD : false,
			animate : true,
			split : true,
			containerScroll: true,
			collapsible : false
		});
		tree.on('checkchange', function(node, flag) {
			// 获取所有子节点
			node.cascade(function(node) {
				node.attributes.checked = flag;
				node.ui.checkbox.checked = flag;
				return true;
			});
			// 获取所有父节点
			var pNode = node.parentNode;
			for (; pNode.id != "root"; pNode = pNode.parentNode) {
				if (flag && tree.getChecked('id', pNode)) {
					pNode.ui.checkbox.checked = flag;
					pNode.attributes.checked = flag;
				}
			}
		});
//		tree.on('afterrender',function(aclTree){initCheckStatus(aclTree,roleId);});
		if(!aclWin){
			aclWin = new Ext.Window({
				title:"角色 [<font color='orange'>"+record.data.roleName+"</font>] 的模块权限",
				height:400,
				width:320,
				constrain:true,
				modal:true,
				resizable:false,
				autoScroll : true,
				closeAction:'close',
				bodyStyle:'background-color:white;',
				listeners:{
					close:function(){aclWin.destroy();aclWin = null;}
				},
				items:[tree],
				tbar:[' ',' ',{	
	                iconCls: 'icon-expand-all',
	                text: '全部展开',
	                handler: function(){
	                    var treePanel = Ext.getCmp('role_aclTree');
	                    treePanel.root.expand(true);
	                },
	                scope: this
	            }, '-', {
	                iconCls: 'icon-collapse-all',
	                text: '全部收缩',
	                handler: function(){ 
	                    var treePanel = Ext.getCmp('role_aclTree');
	                    treePanel.root.collapseChildNodes(true);    
	                },
	                scope: this
	            },'-',{text:'保存',iconCls:'add',handler:function(){saveAcl(roleId);}}]
			});
		}
		aclWin.show();
		initCheckStatus(tree,roleId);
	}
	
	/** 输入框查询 **/
	function searchSchool(){
		var searchtext = Ext.getCmp('searchText-role').getValue(),
		code = Ext.getCmp('code-role').value,
		_store = Ext.getCmp('schoolGrid-role').getStore();
		Ext.apply(_store.baseParams,{name:searchtext,code:code});
		_store.load();
	}
	
	function initAcldStatus(roleId){
		Ext.Ajax.request({
			url:App.baseURL+'/acld/findColumnByRole',
			params:{roleId:roleId},
			success:function(res){
				var arr = Ext.decode(res.responseText);
				var _roleGrid = Ext.getCmp('schoolGrid-role'),
				_roleStore = _roleGrid.getStore(),
				selectionModel = _roleGrid.getSelectionModel(),
				willSelectArr = [],
				_roles = _roleStore.getRange();
				selectionModel.clearSelections();
				for (var i = 0; i < _roles.length; i++) {
					var _role = _roles[i];
					if(arr.contains(_role.id)){
						willSelectArr.push(_role);
					}
				}
				selectionModel.selectRecords(willSelectArr);
			},
			failure:function(){Ext.Msg.alert('提示','请示失败!');}
		});
	}
	
	/** 获取所在单位 **/
	function showAcldWin(record){
		var roleId = record.data.id;
		var store = new Ext.data.Store({
			autoLoad:false,
			proxy:new Ext.data.HttpProxy({url:App.baseURL+'/school/listAll'}),
			reader:new Ext.data.JsonReader({
				totalProperty:'totalCount',
				root:'datas',
				idProperty:'id',
				fields:[{name:'id'},{name:'name'},{name:'addr'}]
			}),
			baseParams:{start:0,limit:10}
		}),
		sm = new Ext.grid.CheckboxSelectionModel({singleSelect:false});
		var win = new Ext.Window({
			title:'托儿所列表',
			height:350,
			width:500,
			iconCls:"housetab",
			constrain:true,
			modal:true,
			resizable:false,
			renderTo:tabId,
			closeAction:'close',
			bodyStyle:'background-color:white;',
			listeners:{close:function(){win.destroy();win = null;}},
			layout:'fit',
			items:[new Ext.grid.GridPanel({
				id:"schoolGrid-role",
				border : false,
				columnLines : true,
				autoScroll : true,
				store : store,
				autoHeight:false,
				stripeRows:true,
				autoExpandColumn:'szdq',
				cm : new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),sm,
					{header : '<center>托儿所名称</center>',dataIndex : 'name',sortable : true,width : 150},
					{header : '<center>所在地区</center>',dataIndex : 'addr',sortable : true,id : 'szdq'}
				]),
				sm : sm,
				loadMask : {msg : '正在加载数据……'},
				bbar:new Ext.PagingToolbar({
					pageSize : 10,
					store : store,
					emptyMsg : "<font color='red'>没有记录</font>",
					displayInfo : true,
					plugins:new Ext.ux.ComboPageSize({addToItem:true,index:10})
				})
			})],
			tbar:[' ',' ',{xtype:'textfield',emptyText:'输入名称关键字查找',id:'searchText-role',width:120},' ',' ',' ',
				{xtype:"myComboxTree",emptyText:'请选择地区',id:'code-role',width:200,
				 tree:new Ext.tree.TreePanel({
			   		id:'dqTree-role',
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
			},' ',' ',{text:'查&nbsp;&nbsp;询',iconCls:'query',handler:searchSchool}
			,' ',' ','-',' ',' ',{text:'<font color="red">保&nbsp;&nbsp;存</font>',iconCls:'sure',handler:function(){
				var grid = Ext.getCmp("schoolGrid-role"),
				_store = grid.getStore(),
				sm = grid.getSelectionModel(),
				allRecords = _store.getRange(),
				selectRecords = sm.getSelections();
				var params = '';
				for ( var i = 0; i < allRecords.length; i++) {
					var record = allRecords[i];
					if(selectRecords.contains(record)){
						params += ',y_'+record.id;
					}else{
						params += ',n_'+record.id;
					}
				}
				Ext.Ajax.request({
					url:App.baseURL+'/acld/add',
					params:{principalType:'role',principalId:roleId, mids:params.substring(1)},
					success:function(res){
						var ret = Ext.decode(res.responseText);
						Ext.Msg.alert('提示',ret.msg);
					},
					failure:function(){Ext.Msg.alert('提示','请求失败!');}
					
				});
			}}]
		});
		win.show();
		store.load();
		initAcldStatus(roleId);
	}
	
	/** 添加或者修改角色 **/
	function showAddOrUpdate(type){
		var title='',iconCls='',btnText='',url='',updateRole=null;
		if(type == 'add'){
			title='添加角色',iconCls='add',btnText='保存',url=App.baseURL+'/role/add';
		}else if(type == 'update'){
			title='修改角色',iconCls='update',btnText='修改',url=App.baseURL+'/role/update';
			var roleGrid = Ext.getCmp('roleGrid'),
			selectRoles = roleGrid.getSelectionModel().getSelections();
			if(selectRoles.length <= 0){
				Ext.Msg.alert('提示','请选择一个角色进行修改!');
				return;
			}else if(selectRoles.length > 1){
				Ext.Msg.alert('提示','只能选择一个角色进行修改!');
				return;
			}else{
				updateRole = selectRoles[0];
			}
		}
		if(!addOrUpdateWin){
			addOrUpdateWin = new Ext.Window({
				title:title,
				height:168,
				width:320,
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
					ref:'roleForm',
					layout:'form',
					border:false,
					labelWidth:75,
					labelAlign:'right',
					buttonAlign:'center',
					defaults:{anchor:'88%',xtype:'textfield',ctCls:'formMargin',labelStyle:'margin-top:8px;'},
					items:[{
						fieldLabel:'角色名',
						ref:'../roleName',
						allowBlank:false,
						maxLength:10,
						maxLengthText:'最长不超过{0}个长度'
					},{
						xtype:'textarea',
						height:60,
						fieldLabel:'描&nbsp;&nbsp;&nbsp;述',
						ref:'../remark',
						allowBlank:true,
						maxLength:200,
						maxLengthText:'最长不超过{0}个长度'
					}]
				})]
					,
					bbar:['->',{
						text:btnText,
						iconCls:'saveBtn',
						handler:function(){
							var roleName = addOrUpdateWin.roleName.getValue(),
							remark = addOrUpdateWin.remark.getValue(),
							myMask = new Ext.LoadMask(addOrUpdateWin.el,{msg:'正在保存数据...',removeMask:true});
							myMask.show();
							Ext.Ajax.request({
								url:url,
								method:'POST',
								params:{roleName:roleName,remark:remark,id:updateRole?updateRole.data.id:null},
								success:function(res){
									myMask.hide();
									var ret = Ext.decode(res.responseText);
									Ext.Msg.alert('提示',ret.msg);
									if(ret.flag){
										Ext.getCmp('roleGrid').getStore().reload();
										addOrUpdateWin.close();
									}
								},
								failure:function(res){
									alert(res.responseText);
									myMask.hide();}
							});
						}
					},'-',{text:'重置',iconCls:'resetBtn',handler:function(){addOrUpdateWin.roleForm.getForm().reset();}},
					'-',{text:'取消',iconCls:'cancelBtn',handler:function(){addOrUpdateWin.close();}}
					]
			});
		}
		addOrUpdateWin.show();
		if(type == 'update'){
			addOrUpdateWin.roleName.setValue(updateRole.data.roleName);
			addOrUpdateWin.remark.setValue(updateRole.data.remark);
		}
	}
	
	/** 输入框查询角色 **/
	function search(t,e){
		var searchtext = Ext.get('searchRoleText').getValue(),
		_roleStore = Ext.getCmp('roleGrid').getStore();
		if(!/^\s*$/.test(searchtext) && searchtext !='输入名称查找'){
			Ext.apply(_roleStore.baseParams,{roleName:searchtext});
			_roleStore.load();
		}else{
			Ext.apply(_roleStore.baseParams,{roleName:''});
			_roleStore.load();
		}
	}
	
	function init(){
		var curPanel = Ext.getCmp('tabsPanel');
		roleStore = new Ext.data.Store({
			autoLoad:false,
			proxy:new Ext.data.HttpProxy({url:App.baseURL+'/role/list'}),
			reader:new Ext.data.JsonReader({
				totalProperty:'totalCount',
				root:'datas',
				idProperty:'id',
				fields:[{name:'id'},{name:'roleName'},{name:'remark'}]
			}),
			baseParams:{start:0,limit:limit}
		}),
		sm = new Ext.grid.CheckboxSelectionModel({singleSelect:false}),
		cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),sm,
			{header : '<center>角色名</center>',dataIndex : 'roleName',sortable : true,width : 200},
			{header : '<center>备  注</center>',dataIndex : 'remark',sortable : true,id:'roleremarkex'},
			{header : '<center>授  权</center>',align:'center',dataIndex : 'id',width : 220,sortable : false, renderer:function(){
				var str = '';
				if(hasPermission('sys_role_module')){
					str += '<a name="acl">模块授权</a>&nbsp;&nbsp;&nbsp;';
				}
				if(hasPermission('sys_role_data')){
					str += '<a name="acld">数据授权</a>';
				}
				if(str==''){
					return '<font color="red">无授权操作</font>';
				}else{
					return str;
				}
			}}
		]),
		roleGrid = new Ext.grid.GridPanel({
			id : 'roleGrid',
			border : false,
			columnLines : true,
			autoScroll : true,
			store : roleStore,
			autoHeight:false,
			stripeRows:true,
			autoExpandColumn:'roleremarkex',
			cm : cm,
			sm : sm,
			loadMask : {msg : '正在加载数据……'},
			bbar:new Ext.PagingToolbar({
				pageSize : limit,
				store : roleStore,
				emptyMsg : "<font color='red'>没有记录</font>",
				displayInfo : true,
				plugins:new Ext.ux.ComboPageSize({addToItem:true,index:10})
			}),
			tbar:[{text:'添加',iconCls:'add',hidden:!hasPermission('sys_role_add'), handler:function(){showAddOrUpdate('add');}},
				' ',{text:'修改',iconCls:'update',hidden:!hasPermission('sys_role_update'),handler:function(){showAddOrUpdate('update');}},
				' ',{text:'删除',iconCls:'delete',hidden:!hasPermission('sys_role_delete'),handler:doDelete},
				'->',{xtype:'textfield',emptyText:'输入名称查找',enableKeyEvents:true,id:'searchRoleText',width:100,
					listeners:{
						keydown:{
							fn:function(t,e){
								if(e.keyCode == 13){
									search();
								}
							},
							buffer:350,
							scope:this
						}
					}
			},
			{text:'查&nbsp;&nbsp;询',iconCls:'query',handler:search},
			'-',{text:'刷&nbsp;&nbsp;新',iconCls:'refresh',handler:function(){roleStore.reload();}}],
			listeners:{
				cellclick:function(grid,rowIndex,columnIndex,e){
					var rstore = grid.getStore(),
					record = rstore.getAt(rowIndex); 
					if(columnIndex==4){
						if(!e.getTarget("a"))return;
						var target = e.getTarget("a").name;
						if(target=="acl"){
							showAclWin(record);
						}else if(target=="acld"){
							showAcldWin(record);
						}
					}
				}
			}
		}),
		roleTab = curPanel.add({
			title : '&nbsp;角色管理&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
			id : tabId,
			closable : true,
			layout : 'card',
			iconCls:'role',
			activeItem :0,
			items:[roleGrid]
		});	
		curPanel.setActiveTab(roleTab);
		roleStore.load();
	}
	
	function doDelete(){
		var ids = '',grid = Ext.getCmp('roleGrid'),selects = grid.getSelectionModel().getSelections();
		if(selects.length <= 0){
			Ext.Msg.alert('提示','请选择记录进行删除!');
			return;
		}
		for (var i = 0; i < selects.length; i++) {
			ids += ',' + selects[i].json.id;
		}
		Ext.Msg.confirm("提示","删除角色信息，将把角色相关信息一起删除，您确定要删除吗？",function(val){
			if(val=='yes'){
				 Ext.Ajax.request({
					url:App.baseURL+"/role/delete",
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