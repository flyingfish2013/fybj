App.tabs.orgManager = (function(){
	var limit = 20,tabId = "orgTab",addOrUpdateWin;
	
	function init(){
		var curPanel = Ext.getCmp('tabsPanel');
		var tab = curPanel.add({
			title : '&nbsp;地区管理&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
			id : tabId,
			closable : true,
			layout : 'card',
			iconCls:'zzjg', 
			activeItem :0,
			items:[new Ext.tree.TreePanel({
				id : 'jgTree',
				root : new Ext.tree.AsyncTreeNode({
					id : 'root',
					text : '地区列表',
					expanded:true,
					leaf:false
				}),
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
				rootVisible : true,
				lines : false,
				autoScroll : true,
				enableDD : false,
				animate : true,
				split : true,
				containerScroll: true,
				collapsible : false
			})],
			tbar:[' ',' ',{	
	                iconCls: 'icon-expand-all',
	                text: '全部展开',
	                handler: function(){
	                    var treePanel = Ext.getCmp('jgTree');
	                    treePanel.root.expand(true);
	                },
	                scope: this
	            }, '-', {
	                iconCls: 'icon-collapse-all',
	                text: '全部收缩',
	                handler: function(){ 
	                    var treePanel = Ext.getCmp('jgTree');
	                    treePanel.root.collapseChildNodes();    
	                },
	                scope: this
	            },
		        '->',{text:'添加',iconCls:'add',hidden:!hasPermission('sys_org_add'),handler:function(){showAddOrUpdate("add");}},
				' ',{text:'修改',iconCls:'update',hidden:!hasPermission('sys_org_update'),handler:function(){showAddOrUpdate("update");}},
				' ',{text:'删除',iconCls:'delete',hidden:!hasPermission('sys_org_delete'),handler:doDelete}
			]
		});	
		curPanel.setActiveTab(tab);
	}
	
	/** 添加或者修改 **/
	function showAddOrUpdate(type){
		var title='',iconCls='',btnText='',url='',id=0,pcode='',level=0;
		var treeCmp = Ext.getCmp("jgTree");
		var node = treeCmp.getSelectionModel().getSelectedNode();
		if(type == 'add'){
			title='添加地区信息',iconCls='add',btnText='保存',url=App.baseURL+'/org/add';
			if(!node){
				Ext.Msg.alert('提示','请选择上级节点!');
				return;
			}else{
				if(node.id=='root'){
					pcode = null;
					level = 1;
				}else{
					pcode = node.attributes.code;
					level = parseInt(node.attributes.level)+1;
				}
			}
		}else if(type == 'update'){
			title='修改地区信息',iconCls='update',btnText='修改',url=App.baseURL+'/org/update';
			if(!node){
				Ext.Msg.alert('提示','请选择一个节点进行修改!');
				return;
			}else{
				id = node.id;
				pcode = node.attributes.pcode;
				level = node.attributes.level;
			}
		}
		if(!addOrUpdateWin){
			addOrUpdateWin = new Ext.Window({
				title:title,
				height:150,
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
						fieldLabel:'地区名称',
						ref:'../text',
						allowBlank:false,
						maxLength:20
					},{
						fieldLabel:'地区代码',
						ref:'../code',
						allowBlank:false,
						maxLength:12,
						minLength:2
					}]
				})],
				bbar:['->',{
					text:btnText,
					iconCls:'saveBtn',
					handler:function(){
						if(!addOrUpdateWin.itemForm.getForm().isValid()){return;}
						var text = addOrUpdateWin.text.getValue(),
						code = addOrUpdateWin.code.getValue(),
						myMask = new Ext.LoadMask(addOrUpdateWin.el,{msg:'正在保存数据...',removeMask:true});
						myMask.show();
						Ext.Ajax.request({
							url:url,
							method:'POST',
							params:{code:code,text:text,id:id,pcode:pcode,level:level},
							success:function(res){
								myMask.hide();
								var ret = Ext.decode(res.responseText);
								if(ret.flag){
									Ext.Msg.alert('提示','操作成功');
									if(type == 'add'){
										var newNode = new Ext.tree.TreeNode({id:ret.msg,pcode:pcode,text:text,code:code,level:level});
										node.appendChild(newNode);
										node.expand();
									}else if(type == 'update'){
										node.setText(text);
										node.attributes.code = code;
									}
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
				'-',{text:'取消',iconCls:'cancelBtn',handler:function(){addOrUpdateWin.close();}}
				]
			});
		}
		addOrUpdateWin.show();
		if(type == 'update'){
			addOrUpdateWin.text.setValue(node.text);
			addOrUpdateWin.code.setValue(node.attributes.code);
		}
	}
	
	function doDelete(){
		var tree = Ext.getCmp('jgTree'),node = tree.getSelectionModel().getSelectedNode();
		if(!node){
			Ext.Msg.alert('提示','请选择对象进行删除!');
			return;
		}
		Ext.Msg.confirm("提示","删除地区信息，将把地区相关信息一起删除，您确定要删除吗？",function(val){
			if(val=='yes'){
				 Ext.Ajax.request({
					url:App.baseURL+"/org/delete",
					method:'POST',
					params:{id:node.id,code:node.attributes.code},
					success:function(response){
						var json = Ext.decode(response.responseText);
						if(json.flag){
							Ext.Msg.alert("提示","删除成功");
							tree.root.reload();
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


