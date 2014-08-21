App.tabs.doctorManager = (function(){
	var limit = 20,tabId = "doctorTab",addOrUpdateWin;
	
	function init(){
		var curPanel = Ext.getCmp('tabsPanel');
		var store = new Ext.data.Store({
			autoLoad:false,
			proxy:new Ext.data.HttpProxy({url:App.baseURL+'/doctor/list'}),
			reader:new Ext.data.JsonReader({
				totalProperty:'totalCount',
				root:'datas',
				idProperty:'id',
				fields:[{name:'id'},{name:'name'},{name:'sex'},{name:'birthday'},{name:'cardId'},{name:'tel'}]
			}),
			baseParams:{start:0,limit:limit}
		}),
		sm = new Ext.grid.CheckboxSelectionModel({singleSelect:false}),
		cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),sm,
			{header : '<center>姓  名</center>',dataIndex : 'name',sortable : true,width : 150},
			{header : '<center>性  别</center>',dataIndex : 'sex',sortable : true,align:'center',width : 80},
			{header : '<center>联系电话</center>',dataIndex : 'tel',sortable : true,width : 120},
			{header : '<center>身份证号</center>',dataIndex : 'cardId',sortable : true,align:'center',width : 150},
			{header : '<center>出生日期</center>',dataIndex : 'birthday',sortable : true,align:'center',width : 150},
			{header : '<center>所在单位</center>',dataIndex : '',sortable : true,id : 'szdw',renderer:function(val,metaData, record, rowIndex, colIndex, store){
				if(record.json.hospital){
					return record.json.hospital.name;
				}else{
					return "";
				}
			}},
			{header : '<center>工作岗位</center>',dataIndex : '',sortable : true,renderer:function(val,metaData, record, rowIndex, colIndex, store){
				if(record.json.station){
					return record.json.station.name;
				}else{
					return "";
				}
			}}
		]),
		grid = new Ext.grid.GridPanel({
			id:'doctorGrid',
			border : false,
			columnLines : true,
			autoScroll : true,
			store : store,
			autoHeight:false,
			stripeRows:true,
			autoExpandColumn:'szdw',
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
				' ',{text:'修改',iconCls:'update',hidden:!hasPermission('hos_doctor_update'),handler:showAddOrUpdate},
				' ',{text:'删除',iconCls:'delete',hidden:!hasPermission('hos_doctor_delete'),handler:doDelete},
				'->',{
					xtype:'combo',
					id:'searchCombo-doctor',
					typeAhead: true,
				    triggerAction: 'all',
				    lazyRender:true,
				    mode: 'local',
				    value:'name',
				    width:80,
				    editable:false,
				    store: new Ext.data.ArrayStore({
				        fields: ['keytype','keytext'],
				        data: [['name', '姓名'], ['sex', '性别'], ['cardId', '身份证号'], ['tel', '联系电话'], ['station', '工作岗位'], ['hospital', '工作单位']]
				    }),
				    valueField: 'keytype',
				    displayField: 'keytext'
				},' ',{xtype:'textfield',emptyText:'输入关键字查找',enableKeyEvents:true,id:'keyword-doctor',width:180,
					listeners:{
						keydown:{
							fn:function(t,e){
								if(e.keyCode == 13){
									searchDotor();
								}
							},
							buffer:350,
							scope:this
						}
					}
			},' ',
			{text:'查&nbsp;&nbsp;询',iconCls:'query',handler:searchDotor},
			'-',{text:'刷&nbsp;&nbsp;新',iconCls:'refresh',handler:function(){store.reload();}}]
		}),
		tab = curPanel.add({
			title : '&nbsp;医生管理&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
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
	
	/** 修改 **/
	function showAddOrUpdate(){
		var sex='男',title='修改医生信息',iconCls='update',btnText='修改',url=App.baseURL+'/doctor/update';
		var grid = Ext.getCmp('doctorGrid'),
		selectRocords = grid.getSelectionModel().getSelections();
		if(selectRocords.length <= 0){
			Ext.Msg.alert('提示','请选择一条记录进行修改!');
			return;
		}else if(selectRocords.length > 1){
			Ext.Msg.alert('提示','只能选择一条记录进行修改!');
			return;
		}else{
			record = selectRocords[0];
			if(record.json.sex){sex = record.json.sex;}
		}
		if(!addOrUpdateWin){
			addOrUpdateWin = new Ext.Window({
				title:title,
				height:320,
				width:400,
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
						fieldLabel:'姓  名',
						ref:'../name',
						allowBlank:false,
						maxLength:15,
						value:record.data.name
					},{
						xtype:'radiogroup',
						fieldLabel:'性  别',
						ref:'../sex',
						items: [
			                {boxLabel: '男', name: 'sex',inputValue:'男',checked:sex=='男'?true:false},
							{boxLabel: '女', name: 'sex',inputValue:'女',checked:sex=='女'?true:false}
				          ],
						  listeners:{
						  	change:function(radiogroup,checked){
								sex = checked.inputValue;
							}
						  }
					},{
						fieldLabel:'联系电话',
						ref:'../tel',
						allowBlank:false,
						regex:App.regTel,
						regexText:App.regTelTxt,
						maxLength:30,
						value:record.data.tel
					},{
						fieldLabel:'身份证号',
						allowBlank:false,
						ref:'../cardId',
						regex:App.regSfz,
						regexText:App.regSfzTxt,
						maxLength:90,
						value:record.data.cardId
					},{
						fieldLabel:'出生日期',
						editable:false,
						ref:'../birthday',
						xtype:'datefield',
						format:'Y-m-d',
						value:record.data.birthday
					},{
						xtype:'combo',
						ref:'../sid',
						fieldLabel:"工作岗位",
						allowBlank:false,
						triggerAction:"all",
						mode:"local",
						emptyText:"请选择工作岗位",
						store:new Ext.data.Store({
							autoLoad:true,
							proxy:new Ext.data.HttpProxy({url:App.baseURL+"/commonDic/listDic"}),
							reader:new Ext.data.JsonReader({fields:[{name:"id"},{name:"name"}]}),
							baseParams:{type:App.dicType.gzgw},
							listeners:{
								load:function(store,records,opts){
									if(record && record.json.station){
										addOrUpdateWin.sid.setValue(record.json.station.id);
									}	
								}
							}
						}),
						displayField:"name",
		 				valueField:"id",
						editable:false,
						autoShow:true
					},{
						xtype:'hidden',
						ref:'../hid',
						value:record.json.hospital?record.json.hospital.id:''
					},{
						fieldLabel:'所在单位',
						ref:'../hname',
						allowBlank:false,
						readOnly:true,
						value:record.json.hospital?record.json.hospital.name:'',
						listeners:{
							focus:function(){
								App.modules.getHospital('doctor',function(item){
									addOrUpdateWin.hid.setValue(item.id);
									addOrUpdateWin.hname.setValue(item.name);
								});
							}
						}
					}]
				})],
				bbar:['->',{
					text:btnText,
					iconCls:'saveBtn',
					handler:function(){
						if(!addOrUpdateWin.itemForm.getForm().isValid()){return;}
						var name = addOrUpdateWin.name.getValue(),
						birthday = addOrUpdateWin.birthday.getValue(),
						tel = addOrUpdateWin.tel.getValue(),
						cardId = addOrUpdateWin.cardId.getValue(),
						sid = addOrUpdateWin.sid.getValue(),
						hid = addOrUpdateWin.hid.getValue(),
						myMask = new Ext.LoadMask(addOrUpdateWin.el,{msg:'正在保存数据...',removeMask:true});
						myMask.show();
						Ext.Ajax.request({
							url:url,
							method:'POST',
							params:{name:name,birthday:(birthday?birthday.format('Y-m-d'):""),id:record.data.id,cardId:cardId,tel:tel,sid:sid,hid:hid,sex:sex},
							success:function(res){
								myMask.hide();
								var ret = Ext.decode(res.responseText);
								if(ret.flag){
									Ext.Msg.alert('提示','操作成功');
									Ext.getCmp('doctorGrid').getStore().reload();
									addOrUpdateWin.close();
								}else{
									Ext.Msg.alert('提示','操作失败');
								}
							},
							failure:function(res){
								Ext.Msg.alert('提示','操作失败');
								myMask.hide();}
						});
					}
				},'-',{text:'重置',iconCls:'resetBtn',handler:function(){addOrUpdateWin.itemForm.getForm().reset();}},
				'-',{text:'取消',iconCls:'cancelBtn',handler:function(){addOrUpdateWin.close();}
				}]
			});
		}
		addOrUpdateWin.show();
	}
	
	function searchDotor(){
		var field = Ext.getCmp('searchCombo-doctor').getValue(),
		keyword = Ext.get('keyword-doctor').getValue(),
		_store = Ext.getCmp('doctorGrid').getStore();
		Ext.apply(_store.baseParams,{keyword:keyword,field:field});
		_store.load();
	}
	
	function doDelete(){
		var ids = '',grid = Ext.getCmp('doctorGrid'),selects = grid.getSelectionModel().getSelections();
		if(selects.length <= 0){
			Ext.Msg.alert('提示','请选择记录进行删除!');
			return;
		}
		for (var i = 0; i < selects.length; i++) {
			ids += ',' + selects[i].json.id;
		}
		Ext.Msg.confirm("提示","删除医生信息，将把医生相关信息一起删除，您确定要删除吗？",function(val){
			if(val=='yes'){
				 Ext.Ajax.request({
					url:App.baseURL+"/doctor/delete",
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


