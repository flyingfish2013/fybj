//去除数组中的重复
Array.prototype.uniq = function(){
	var temp = {}, len = this.length;
	for (var i = 0; i < len; i++) {
		temp[this[i]] = i;
	}
	this.length = 0;
	len = 0;
	for(var i in temp){
		if(i.length>0){
			this[len++] = i;
		}
	}
	return this;
};

Array.prototype.contains = function(element) {
	for ( var i = 0; i < this.length; i++) {
		if (this[i] == element) {
			return true;
		}
	}
	return false;
}; 

//上传图片
App.modules.uploadImage={
	imageArr:[],
	delImg:[],
	width:400,
	height:450,
	uploadFileSize:'500K',
	uploadFileTypes:'*.jpg;*.png;*.gif;*.bmp',
	uploadUrl:App.baseURL+"/fileUpload/doUpload",
	pathType:1 //1是托儿所图片
};
App.modules.uploadImage.upload = function imageUpLoad(callback){
    var imageWin = new Ext.Window({
		title : "图片上传(<span style='font-weight:normal'>图片大小限定小于<font color=red>"+this.uploadFileSize+"</font></span>)",
		width : this.width,
		height : this.height,				
		resizable : false,
		layout : 'fit',
		modal:true,
		constrain:true,
		closeAction:'close',
		renderTo:'centerPanel',
		listeners:{
			close:function(){
				var count = imageWin.uploadpanel.fileList.getStore().getCount();
				imageWin.uploadpanel.fileList.getStore().each(function(record){
					if(record.get('filename')){App.modules.uploadImage.imageArr.push(record.get('filename'));}
				});
				imageWin.uploadpanel.fileList.getStore().removeAll();
				imageWin.destroy();
				imageWin = null;
				if(callback){callback();}
			}
		},
		items : [{
			ref:'uploadpanel',
			xtype : 'uploadpanel',
			uploadUrl : this.uploadUrl,
			filePostName : 'myUpload', // 这里很重要，默认值为'fileData',这里匹配action中的setMyUpload属性
			flashUrl : App.baseURL+'/resources/jslib/extjs3.4.0/ux/uploadDialog/swfupload.swf',
			fileSize : this.uploadFileSize,					
			height : 400,
			border : false,
			fileTypes : this.uploadFileTypes, // 在这里限制文件类型:'*.jpg,*.png,*.gif'
			fileTypesDescription : '所有文件',
			postParams:{pathType:this.pathType}
		}]
	});
	imageWin.show();
};
App.modules.uploadImage.browse = function(pathType,imagePath,opt){
	var htm = "",htm2 = "",url = "";
	var pre = App.imageBrowseURL;
	if(imagePath){
		var imageArr = imagePath.split(",").uniq();
		App.modules.uploadImage.imageArr = imageArr;
		Ext.each(imageArr,function(name){
			if(name.length>0){
				url = pre+name;
				htm += "<div class='thumb-wrap' id='"+name+"'><div class='thumb'><a href='javascript:App.modules.uploadImage.clickImage(\""+url+"\");'><img ename='"+name+"' src='"+url+"'/></a></div>" +
				"<p class='ylzt' style='margin-top:3px;'><input type='checkbox' id='ck_"+name+"' value='"+name+"'>&nbsp;&nbsp;<a href='"+url+"' target='_blank'>预览</a></p></div>";
			}
		});
		url = pre+imageArr[0];
		htm2 = "<div id='showDetailImg'><img src='"+url+"'/></div>";
	}else{
		htm = "<div class='thumb-wrap'><font color='red'>暂无图片！</font></div>";
	}
	var browsImgWin = new Ext.Window({
		title : "图片浏览",
		iconCls:"photo",
		width : 747,
		height : 500,
		minWidth:747,
		minHeight:500,
		resizable:false,
		autoScroll:true,
		constrain:true,
		border:false,
		id:'browsImgWin',
		renderTo:'centerPanel',
		closeAction:"close",
		layout:"border",
		bodyStyle:"background-color:#fff;",
		listeners:{
			close:function(){
				browsImgWin.destroy();browsImgWin=null;
				if(opt=='look'){App.modules.uploadImage.imageArr = [];}
			}
		},
		items:[{
			region:"west",
			width:150,
			minWidth:150,
			html:htm,
			ref:"showImg",
			split:true,
			autoScroll:true,
			bbar:[{
				text:"删除",
				iconCls:"delete",
				handler:function(){
					var delImg = [];
					jQuery.each(jQuery("#browsImgWin input[@type='checkbox'][checked]"),function(i,item){
						delImg.push(item.value);
					});
					if(delImg.length>0){
						Ext.Msg.confirm("提示",'确定要删除吗?',function(btn){
							if(btn=="yes"){
								Ext.each(delImg,function(e){Ext.get(e).remove();});
								App.modules.uploadImage.imageArr = [];
								Ext.select(".thumb img").each(function(el){
									var name = el.dom.getAttribute("ename");
									if(name){
										App.modules.uploadImage.imageArr.push(name);
									}
								});
								if(opt=="add"){
									App.modules.uploadImage.delImg = [];
									Ext.Ajax.request({
										url:App.baseURL+'/fileUpload/deleteFiles',
										params:{
											files:delImg.join(','),
											pathType:pathType
										},
										success:function(res){
											if(res.responseText=='success'){
												Ext.Msg.alert('提示','删除成功');
											}else{
												Ext.Msg.alert('提示','删除失败');
											}
										}
									});
								}else{
									App.modules.uploadImage.delImg = delImg;
								}
							}
						});
					}else{
						Ext.Msg.alert("提示",'请选择需要删除的图片');return;
					}
				}
			}]
		},{
			region:"center",
			ref:"showDetailImg",
			autoScroll:true,
			split:true,
			html:htm2
		}]
	});
	browsImgWin.show(null,function(){
		if(imagePath){
			Ext.select('.thumb img').on('click', function(evt, el){
				Ext.select('.ylzt a').setStyle({color:'#2244bb'});
				Ext.select('.thumb img').setStyle({border:'3px solid #dddddd'});	
				Ext.get(el).setStyle({border:'3px solid red'});
			});
			Ext.select('.ylzt a').on('click', function(evt, el){
				Ext.select('.thumb img').setStyle({border:'3px solid #dddddd'});	
				Ext.select('.ylzt a').setStyle({color:'#2244bb'});	
				Ext.get(el).setStyle({color:'red'});
			});
			var img = Ext.select('#showDetailImg img').elements[0];
			var imgHeight = img.clientHeight,imgWidth = img.clientWidth;
			var h=imgHeight,w=imgWidth;
			if(imgHeight>462 || imgHeight<100){
				h=462;
			}
			if(imgWidth>572 || imgWidth<100){
				w=572;
			}
			Ext.get('showDetailImg').dom.innerHTML = "<img src='"+url+"' width='"+w+"' height='"+h+"'/>";
		}
	});
	if(imagePath=="" || opt=='look'){browsImgWin.showImg.getBottomToolbar().hide();}else{browsImgWin.showImg.getBottomToolbar().show();}
};
//设置点击图片显示动画效果
App.modules.uploadImage.clickImage = function(url){
	var fx = ['tl','t','tr','l','r','bl','b','br','tr','r'];
	Ext.get('showDetailImg').dom.innerHTML = "<img src='"+url+"'/>";
	var img = Ext.select('#showDetailImg img').elements[0];
	var imgHeight = img.clientHeight,imgWidth = img.clientWidth;
	var h=imgHeight,w=imgWidth;
	if(imgHeight>462 || imgHeight<100){
		h=462;
	}
	if(imgWidth>572 || imgWidth<100){
		w=572;
	}
	alert(h);
	Ext.get('showDetailImg').dom.innerHTML = "<img src='"+url+"' title='"+title+"' width='"+w+"' height='"+h+"'/>";
	Ext.get('showDetailImg').slideIn(fx[Math.floor(Math.random()*10)],{easing:"easeOut",duration:0.8});
};

//获取托儿所
App.modules.getSchool = function(tabName,callback){
	var store = new Ext.data.Store({
		autoLoad:false,
		proxy:new Ext.data.HttpProxy({url:App.baseURL+'/school/list'}),
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
		title:'单位信息列表',
		height:350,
		width:500,
		iconCls:"housetab",
		constrain:true,
		modal:true,
		resizable:false,
		renderTo:tabName+'Tab',
		closeAction:'close',
		bodyStyle:'background-color:white;',
		listeners:{close:function(){win.destroy();win = null;}},
		layout:'fit',
		items:[new Ext.grid.GridPanel({
			id:"schoolGrid-"+tabName,
			border : false,
			columnLines : true,
			autoScroll : true,
			store : store,
			autoHeight:false,
			stripeRows:true,
			autoExpandColumn:'szdq',
			cm : new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),sm,
				{header : '<center>单位名称</center>',dataIndex : 'name',width : 150},
				{header : '<center>所在地区</center>',dataIndex : 'addr',id : 'szdq'}
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
		tbar:[' ',' ',{xtype:'textfield',emptyText:'输入名称关键字查找',id:'searchText-'+tabName,width:120},' ',' ',' ',
			{xtype:"myComboxTree",emptyText:'请选择地区',id:'code-xx-'+tabName,width:200,
			 tree:new Ext.tree.TreePanel({
		   		id:'dqTree-'+tabName,
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
		},' ',' ',
		{text:'查&nbsp;&nbsp;询',iconCls:'query',handler:function(){
			var searchtext = Ext.getCmp('searchText-'+tabName).getValue(),
			code = Ext.getCmp('code-xx-'+tabName).value;
			store.load({params:{name:searchtext,code:code}});
		}},' ',' ','-',' ',' ',
		{text:'<font color="red">确&nbsp;&nbsp;定</font>',iconCls:'sure',handler:function(){
			var grid = Ext.getCmp("schoolGrid-"+tabName);
			selectRocords = grid.getSelectionModel().getSelections();
			if(selectRocords.length <= 0 || selectRocords.length > 1){
				Ext.Msg.alert('提示','请选择记录并且只能选择一条记录!');
				return;
			}else{
				var record = selectRocords[0];
				callback(record.json);
				win.close();
			}
		}}]
	});
	win.show();
	store.load();
};

//获取医生
App.modules.getDoctor = function(tabName,callback){
	var store = new Ext.data.Store({
		autoLoad:false,
		proxy:new Ext.data.HttpProxy({url:App.baseURL+'/doctor/list'}),
		reader:new Ext.data.JsonReader({
			totalProperty:'totalCount',
			root:'datas',
			idProperty:'id',
			fields:[{name:'id'},{name:'name'},{name:'sex'},{name:'birthday'},{name:'cardId'},{name:'tel'}]
		}),
		baseParams:{start:0,limit:10}
	}),
	sm = new Ext.grid.CheckboxSelectionModel({singleSelect:false});
	var win = new Ext.Window({
		title:'医生信息列表',
		height:350,
		width:450,
		iconCls:"user",
		constrain:true,
		modal:true,
		resizable:false,
		renderTo:tabName+"Tab",
		closeAction:'close',
		bodyStyle:'background-color:white;',
		listeners:{close:function(){win.destroy();win = null;}},
		layout:'fit',
		items:[new Ext.grid.GridPanel({
			id:"doctorGrid-"+tabName,
			border : false,
			columnLines : true,
			autoScroll : true,
			store : store,
			autoHeight:false,
			stripeRows:true,
			autoExpandColumn:'szdw',
			cm : new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),sm,
				{header : '<center>姓  名</center>',dataIndex : 'name',width : 80},
				{header : '<center>性  别</center>',dataIndex : 'sex',align:'center',width : 60},
				{header : '<center>工作岗位</center>',dataIndex : '',width : 80,renderer:function(val,metaData, record, rowIndex, colIndex, store){
					if(record.json.station){
						return record.json.station.name;
					}else{
						return "";
					}
				}},
				{header : '<center>所在单位</center>',dataIndex : '',id : 'szdw',renderer:function(val,metaData, record, rowIndex, colIndex, store){
					if(record.json.hospital){
						return record.json.hospital.name;
					}else{
						return "";
					}
				}}
			]),
			sm : sm,
			loadMask : {msg : '正在加载数据……'},
			bbar:new Ext.PagingToolbar({
				pageSize : 10,
				store : store,
				emptyMsg : '<font color="red">没有记录</font>',
				displayMsg:'总数：{0}条',
				displayInfo : true,
				plugins:new Ext.ux.ComboPageSize({addToItem:true,index:10})
			})
		})],
		tbar:[{
			xtype:'combo',
			id:'searchCombo-'+tabName,
			typeAhead: true,
		    triggerAction: 'all',
		    lazyRender:true,
		    mode: 'local',
		    value:'name',
		    width:120,
		    editable:false,
		    store: new Ext.data.ArrayStore({
		        fields: ['keytype','keytext'],
		        data: [['name', '姓名'], ['sex', '性别'], ['station', '工作岗位'], ['hospital', '工作单位']]
		    }),
		    valueField: 'keytype',
		    displayField: 'keytext'
		},' ',{xtype:'textfield',emptyText:'输入关键字查找',enableKeyEvents:true,id:'keyword-doctor',width:180,
			listeners:{
				keydown:{
					fn:function(t,e){
						if(e.keyCode == 13){
							var field = Ext.getCmp('searchCombo-'+tabName).getValue(),
							keyword = Ext.get('keyword-'+tabName).getValue();
							store.load({params:{keyword:keyword,field:field}});
						}
					},
					buffer:350,
					scope:this
				}
			}
		},' ',
		{text:'查&nbsp;&nbsp;询',iconCls:'query',handler:function(){
			var field = Ext.getCmp('searchCombo-'+tabName).getValue(),
			keyword = Ext.get('keyword-'+tabName).getValue();
			store.load({params:{keyword:keyword,field:field}});
		}},' ',' ','-',' ',' ',
		{text:'<font color="red">确&nbsp;&nbsp;定</font>',iconCls:'sure',handler:function(){
			var grid = Ext.getCmp('doctorGrid-'+tabName);
			selectRocords = grid.getSelectionModel().getSelections();
			if(selectRocords.length <= 0 || selectRocords.length > 1){
				Ext.Msg.alert('提示','请选择记录并且只能选择一条记录!');
				return;
			}else{
				var record = selectRocords[0];
				callback(record.json);
				win.close();
			}
		}}]
	});
	win.show();
	store.load();
};

//获取医院
App.modules.getHospital = function(tabName,callback){
	var store = new Ext.data.Store({
		autoLoad:false,
		proxy:new Ext.data.HttpProxy({url:App.baseURL+'/hospital/list'}),
		reader:new Ext.data.JsonReader({
			totalProperty:'totalCount',
			root:'datas',
			idProperty:'id',
			fields:[{name:'id'},{name:'name'},{name:'address'}]
		}),
		baseParams:{start:0,limit:10}
	}),
	sm = new Ext.grid.CheckboxSelectionModel({singleSelect:false});
	var hospitalWin = new Ext.Window({
		title:'单位列表',
		height:350,
		width:500,
		iconCls:"housetab",
		constrain:true,
		modal:true,
		resizable:false,
		renderTo:tabName+'Tab',
		closeAction:'close',
		bodyStyle:'background-color:white;',
		listeners:{close:function(){hospitalWin.destroy();hospitalWin = null;}},
		layout:'fit',
		items:[new Ext.grid.GridPanel({
			id:"unitGrid-"+tabName,
			border : false,
			columnLines : true,
			autoScroll : true,
			store : store,
			autoHeight:false,
			stripeRows:true,
			autoExpandColumn:'szdq',
			cm : new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),sm,
				{header : '<center>单位名称</center>',dataIndex : 'name',width : 150},
				{header : '<center>所在地区</center>',dataIndex : 'address',id : 'szdq'}
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
		tbar:[' ',' ',{xtype:'textfield',emptyText:'输入名称关键字查找',id:'searchText-'+tabName,width:120},' ',' ',' ',
			{xtype:"myComboxTree",emptyText:'请选择地区',id:'code-'+tabName,width:200,
			 tree:new Ext.tree.TreePanel({
		   		id:'dqTree-'+tabName,
				root : new Ext.tree.AsyncTreeNode({id : 'root',text : '根节点',expanded:true,leaf:false}),
				loader : new Ext.tree.TreeLoader({
					url : App.baseURL + '/org/findOrgTree2',
					baseParams:{pcode:''},
					listeners:{
						beforeload:function(loaderObj,node){
							loaderObj.baseParams.pcode = node.id;
						}
					}
				}),
				border : false,rootVisible : false,lines : false,autoScroll : true
			})
		},' ',' ',{text:'查&nbsp;&nbsp;询',iconCls:'query',handler:function(){
			var searchtext = Ext.getCmp('searchText-'+tabName).getValue(),
			code = Ext.getCmp('code-'+tabName).value;
			Ext.apply(store.baseParams,{name:searchtext,code:code});
			store.load();
		}},' ',' ','-',' ',' ',
		{text:'<font color="red">确&nbsp;&nbsp;定</font>',iconCls:'sure',handler:function(){
			var grid = Ext.getCmp('unitGrid-'+tabName);
			selectRocords = grid.getSelectionModel().getSelections();
			if(selectRocords.length <= 0){
				Ext.Msg.alert('提示','请选择一条记录!');
				return;
			}else if(selectRocords.length > 1){
				Ext.Msg.alert('提示','只能选择一条记录!');
				return;
			}else{
				var record = selectRocords[0];
				callback(record.json);
				hospitalWin.close();
			}
		}}]
	});
	hospitalWin.show();
	store.load();
}