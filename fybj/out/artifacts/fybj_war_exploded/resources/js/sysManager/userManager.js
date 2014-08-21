App.tabs.userManager = (function(){
	var limit = 20,tabId = "userTab",addOrUpdateWin = null, acrWin = null, aclWin = null;
	
	function initRoles(userId){
		Ext.Ajax.request({
			url:App.baseURL+"/ur/findByUser",
			params:{userId:userId},
			success:function(res){
				var arr = Ext.decode(res.responseText);
				if(arr && arr.length>0){
					for(var i=0; i<arr.length; i++){
						var role = arr[i].role;
						Ext.get("r_"+role.id).dom.checked = true;
					}
				}
			},
			failure:function(){}
		});
	}
	
	function showAcrWin(record){
		var userId = record.data.id;
		if(!acrWin){
			acrWin = new Ext.Window({
				title:"用户 [<font color='orange'>"+record.data.username+"</font>] 的角色",
				height:400,
				width:320,
				constrain:true,
				modal:true,
				resizable:false,
				autoScroll:true,
				closeAction:'close',
				bodyStyle:'background-color:white;',
				listeners:{
					close:function(){acrWin.destroy();acrWin = null;}
				},
				bbar:['->',{text:'保存',iconCls:'saveBtn',handler:function(){
					var boxs = Ext.select('input[name="roles"]');
					var rids = '';
					boxs.each(function(){
						if(this.dom.checked == true){
							rids += ','+this.dom.value;
						}
					});
					Ext.Ajax.request({
						url:App.baseURL+'/ur/add',
						params:{userId:userId, rids:rids.substring(1)},
						success:function(res){
							var ret = Ext.decode(res.responseText);
							Ext.Msg.alert('提示',ret.msg);
							if(ret.flag){
								acrWin.close();
							}
						},failure:function(){}
					});
				}},
				'-',{text:'取消',iconCls:'cancelBtn',handler:function(){acrWin.close();}}]
			});
		}
		acrWin.show();
		var myMask = new Ext.LoadMask(acrWin.el,{msg:'加载角色信息...',removeMask:true});
		myMask.show();
		Ext.Ajax.request({
			url:App.baseURL+"/role/findAll",
			method:'POST',
			success:function(res){
				var roles = Ext.decode(res.responseText);
				if(roles && roles.length > 0){
					var html = '<table width="100%" cellspacing="0" cellpadding="0" border="0" class="tb">';
					for ( var i = 0; i < roles.length; i+=3) {
						html += '<tr>';
						html += '<td width="33%" class="lb"><input type="checkbox" name="roles" id="r_'+roles[i].id+'" value="'+roles[i].id+'"/>&nbsp;<label for="r_'+roles[i].id+'">'+roles[i].roleName+'</label></td>';
						if(roles[i+1]){
							html += '<td width="33%" class="lb"><input type="checkbox" name="roles" id="r_'+roles[i+1].id+'" value="'+roles[i+1].id+'"/>&nbsp;<label for="r_'+roles[i+1].id+'">'+roles[i+1].roleName+'</label></td>';
						}else{
							html += '<td width="33%" class="lb"></td>';
						}
						if(roles[i+2]){
							html += '<td class="lb"><input type="checkbox" name="roles" id="r_'+roles[i+2].id+'" value="'+roles[i+2].id+'"/>&nbsp;<label for="r_'+roles[i+2].id+'">'+roles[i+2].roleName+'</label></td>';
						}else{
							html += '<td class="lb"></td>';
						}
						html += '</tr>';
					}
					html += '</table>';
					acrWin.update(html);
					initRoles(userId);
				}
				myMask.hide();
			},
			failure:function(){myMask.hide();}
		});
	}
	
	function initCheckStatus(aclTree,userId){
		Ext.Ajax.request({
			url:App.baseURL+"/acl/findByUser",
			params:{userId:userId},
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
	
	function saveAcl(userId){
		var mids = "",  
		aclTree = Ext.getCmp('user_aclTree'),
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
			params:{principalType:'user',principalId:userId,mids:mids},
			success:function(res){
				var ret = Ext.decode(res.responseText);
				Ext.Msg.alert('提示',ret.msg);
			},
			failure:function(){}
		});
	}
	
	function showAclWin(record){
		var userId = record.data.id;
		var tree = new Ext.tree.TreePanel({
			id : 'user_aclTree',
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
		if(!aclWin){
			aclWin = new Ext.Window({
				title:"用户 [<font color='orange'>"+record.data.username+"</font>] 的模块权限",
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
	                    var treePanel = Ext.getCmp('user_aclTree');
	                    treePanel.root.expand(true);
	                },
	                scope: this
	            }, '-', {
	                iconCls: 'icon-collapse-all',
	                text: '全部收缩',
	                handler: function(){ 
	                    var treePanel = Ext.getCmp('user_aclTree');
	                    treePanel.root.collapseChildNodes(true);    
	                },
	                scope: this
	            },'-',{text:'保存',iconCls:'add',handler:function(){saveAcl(userId);}}]
			});
		}
		aclWin.show();
		initCheckStatus(tree,userId);
	}
	
	/** 输入框查询 **/
	function searchSchool(){
		var searchtext = Ext.getCmp('searchText-user').getValue(),
		code = Ext.getCmp('code-user').value,
		_store = Ext.getCmp('schoolGrid-user').getStore();
		Ext.apply(_store.baseParams,{name:searchtext,code:code});
		_store.load();
	}
	
	function initAcldStatus(userId){
		Ext.Ajax.request({
			url:App.baseURL+'/acld/findColumnByUser',
			params:{userId:userId},
			success:function(res){
				var arr = Ext.decode(res.responseText);
				var _roleGrid = Ext.getCmp('schoolGrid-user'),
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
		var userId = record.data.id;
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
				id:"schoolGrid-user",
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
			tbar:[' ',' ',{xtype:'textfield',emptyText:'输入名称关键字查找',id:'searchText-user',width:120},' ',' ',' ',
				{xtype:"myComboxTree",emptyText:'请选择地区',id:'code-user',width:200,
				 tree:new Ext.tree.TreePanel({
			   		id:'dqTree-user',
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
				var grid = Ext.getCmp("schoolGrid-user"),
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
					params:{principalType:'user',principalId:userId, mids:params.substring(1)},
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
		initAcldStatus(userId);
	}
	
	function init(){
		var curPanel = Ext.getCmp('tabsPanel');
		var store = new Ext.data.Store({
			autoLoad:false,
			proxy:new Ext.data.HttpProxy({url:App.baseURL+'/user/list'}),
			reader:new Ext.data.JsonReader({
				totalProperty:'totalCount',
				root:'datas',
				idProperty:'id',
				fields:[{name:'id'},{name:'username'},{name:'password'},{name:'userType'},{name:'unit'},{name:'address'},{name:'createTime'}]
			}),
			baseParams:{start:0,limit:limit}
		}),
		sm = new Ext.grid.CheckboxSelectionModel({singleSelect:false}),
		cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),sm,
			{header : '<center>用户名</center>',dataIndex : 'username',sortable : true,width : 100},
			{header : '<center>密   码</center>',dataIndex : 'password',sortable : true,width : 100},
			{header : '<center>用户类型</center>',dataIndex : 'userType',sortable : true,width : 100},
			{header : '<center>所在单位</center>',dataIndex : 'unit',width : 150},
			{header : '<center>单位所在地区</center>',dataIndex : 'address',id:'szdq'},
			{header : '<center>注册时间</center>',dataIndex : 'createTime',sortable : true,align:'center',width:150},
			{header : '<center>授权</center>',dataIndex : 'id',align:'center',width : 200,renderer:function(){
				var str = '';
				if(hasPermission('sys_user_role')){
					str += '<a name="acr">授予角色</a>&nbsp;&nbsp;&nbsp;';
				}
				if(hasPermission('sys_user_module')){
					str += '<a name="acl">模块授权</a>&nbsp;&nbsp;&nbsp;';
				}
				if(hasPermission('sys_user_data')){
					str += '<a name="acld">数据授权</a>';
				}
				if(str==''){
					return '<font color="red">无授权操作</font>';
				}else{
					return str;
				}
			}}
		]),
		grid = new Ext.grid.GridPanel({
			id:'userGrid',
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
			tbar:[{text:'添加',iconCls:'add',hidden:!hasPermission('sys_user_add'), handler:function(){showAddOrUpdate('add');}},
				' ',{text:'修改',iconCls:'update',hidden:!hasPermission('sys_user_update'), handler:function(){showAddOrUpdate('update');}},
				' ',{text:'删除',iconCls:'delete',hidden:!hasPermission('sys_user_delete'),handler:doDelete},
				'->',{
					xtype:'combo',
					id:'searchCombo',
					typeAhead: true,
				    triggerAction: 'all',
				    lazyRender:true,
				    mode: 'local',
				    value:'username',
				    width:80,
				    editable:false,
				    store: new Ext.data.ArrayStore({
				        fields: ['keytype','keytext'],
				        data: [['username', '用户名'], ['userType', '用户类型']]
				    }),
				    valueField: 'keytype',
				    displayField: 'keytext'
				},' ',{xtype:'textfield',emptyText:'输入关键字查找',enableKeyEvents:true,id:'searchText',width:180,
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
			},' ',
			{text:'查&nbsp;&nbsp;询',iconCls:'query',handler:search},'-',
			{text:'刷&nbsp;&nbsp;新',iconCls:'refresh',handler:function(){store.reload();}}],
			listeners:{
				cellclick:function(grid,rowIndex,columnIndex,e){
					var rstore = grid.getStore(),
					record = rstore.getAt(rowIndex); 
					if(columnIndex==8){
						if(!e.getTarget("a"))return;
						var target = e.getTarget("a").name;
						if(target=="acr"){
							showAcrWin(record);
						}else if(target=="acl"){
							showAclWin(record);
						}else if(target=="acld"){
							showAcldWin(record);
						}
					}
				}
			}
		}),
		tab = curPanel.add({
			title : '&nbsp;用户管理&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
			id : tabId,
			closable : true,
			layout : 'card',
			iconCls:'userSuit',
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
			title='添加用户',iconCls='add',btnText='保存',url=App.baseURL+'/user/add';
		}else if(type == 'update'){
			title='修改用户',iconCls='update',btnText='修改',url=App.baseURL+'/user/update';
			var grid = Ext.getCmp('userGrid'),
			selectRocords = grid.getSelectionModel().getSelections();
			if(selectRocords.length <= 0){
				Ext.Msg.alert('提示','请选择一个用户进行修改!');
				return;
			}else if(selectRocords.length > 1){
				Ext.Msg.alert('提示','只能选择一个用户进行修改!');
				return;
			}else{
				record = selectRocords[0];
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
						allowBlank:false,
						maxLength:25
					},{
						xtype:'combo',
						ref:'../userType',
						fieldLabel:'用户类型',
					    triggerAction: 'all',
					    lazyRender:true,
					    mode: 'local',
					    value:'管理员',
					    width:80,
					    editable:false,
					    store: new Ext.data.ArrayStore({
					        fields: ['keytype','keytext'],
					        data: [['管理员', '管理员'],['教委', '教委'],['医生', '医生'],['托儿所', '托儿所']]
					    }),
					    valueField: 'keytype',
					    displayField: 'keytext'
					},{
						fieldLabel:'初始密码',
						ref:'../password',
						disabled:true,
						value:'123456'
					}]
				})],
				bbar:['->',{
					text:btnText,
					iconCls:'saveBtn',
					handler:function(){
						if(!addOrUpdateWin.itemForm.getForm().isValid()){return;}
						var username = addOrUpdateWin.username.getValue(),
						userType = addOrUpdateWin.userType.getValue(),
						password = addOrUpdateWin.password.getValue(),
						myMask = new Ext.LoadMask(addOrUpdateWin.el,{msg:'正在保存数据...',removeMask:true});
						myMask.show();
						Ext.Ajax.request({
							url:url,
							method:'POST',
							params:{username:username,userType:userType,id:record?record.data.id:null,password:password},
							success:function(res){
								myMask.hide();
								var ret = Ext.decode(res.responseText);
								if(ret.flag){
									Ext.Msg.alert('提示','操作成功');
									Ext.getCmp('userGrid').getStore().reload();
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
			addOrUpdateWin.username.setValue(record.data.username);
			addOrUpdateWin.userType.setValue(record.data.userType);
		}
	}
	
	/** 输入框查询 **/
	function search(){
		var keytype = Ext.getCmp('searchCombo').getValue(),
		searchtext = Ext.get('searchText').getValue(),
		_store = Ext.getCmp('userGrid').getStore();
		if(!App.regNull.test(searchtext) && searchtext !='输入关键字查找'){
			Ext.apply(_store.baseParams,{keyword:searchtext,field:keytype});
			_store.load();
		}else{
			Ext.apply(_store.baseParams,{field:'',keyword:''});
			_store.load();
		}
	}
	
	function doDelete(){
		var ids = '',grid = Ext.getCmp('userGrid'),selects = grid.getSelectionModel().getSelections();
		if(selects.length <= 0){
			Ext.Msg.alert('提示','请选择记录进行删除!');
			return;
		}
		for (var i = 0; i < selects.length; i++) {
			ids += ',' + selects[i].json.id;
		}
		Ext.Msg.confirm("提示","删除用户信息，将把用户相关信息一起删除，您确定要删除吗？",function(val){
			if(val=='yes'){
				 Ext.Ajax.request({
					url:App.baseURL+"/user/delete",
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


