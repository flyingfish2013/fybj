Ext.ns('Ext.ux.form.ComboxTree');  
// 树形下拉框  
Ext.ux.form.ComboxTree.TreeCombox = Ext.extend(Ext.form.ComboBox, {  
            store : new Ext.data.SimpleStore({fields : [],data : [[]]}),  
            editable : false,  
            mode : 'local',  
            triggerAction : 'all',  
            emptyText : '请选择...',  
            treeConfig : {  
                border : false,  
                autoScroll : true,  
                height : 200 ,
                useArrows:true,
				lines:false
            },  
            initComponent : function() {  
                Ext.apply(this.tree, this.treeConfig);  
                this.tpl = '<div id="tree-' + this.id + '"></div>';  
                Ext.ux.form.ComboxTree.TreeCombox.superclass.initComponent.call(this);  
                this.on('expand', this.expandtree, this);  
                this.tree.on('click', this.clicktree, this);  
            },  
            onViewClick : Ext.emptyFn,  
            assertValue : Ext.emptyFn,  
            expandtree : function() {  
                this.tree.render('tree-' + this.id);  
                this.tree.expand();  
            },  
            clicktree : function(node) {
                this.value = node.id;
            	this.setRawValue(node.text);
                this.collapse();
            },  
            onDestroy : function() {
                this.un('expand', this.expandtree, this);  
                Ext.destroy(this.tree);  
                Ext.ux.form.ComboxTree.TreeCombox.superclass.onDestroy.call(this);  
            }  
        });  
Ext.reg('myComboxTree', Ext.ux.form.ComboxTree.TreeCombox); 