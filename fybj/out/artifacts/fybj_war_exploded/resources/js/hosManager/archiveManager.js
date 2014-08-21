App.tabs.archiveManager = (function () {
    var limit = 20, tabId = "archiveTab", addOrUpdateWin = null, acrWin = null, aclWin = null;
    var provinceStore = new Ext.data.Store({
        autoLoad: true,
        proxy: new Ext.data.HttpProxy({
            url: App.baseURL + "/org/findOrgTree?pcode="
        }),
        reader: new Ext.data.JsonReader({
            fields: [
                {
                    name: "code"
                },
                {
                    name: "text"
                }
            ]
        })
    });

    var cityStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: App.baseURL + "/org/findOrgTree"
        }),
        reader: new Ext.data.JsonReader({
            fields: [
                {
                    name: "code"
                },
                {
                    name: "text"
                }
            ]
        })
    });
    var destrictStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: App.baseURL + "/org/findOrgTree"
        }),
        reader: new Ext.data.JsonReader({
            fields: [
                {
                    name: "code"
                },
                {
                    name: "text"
                }
            ]
        })
    });
    var villegeStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: App.baseURL + "/org/findOrgTree"
        }),
        reader: new Ext.data.JsonReader({
            fields: [
                {
                    name: "code"
                },
                {
                    name: "text"
                }
            ]
        })
    });
    var roadStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: App.baseURL + "/org/findOrgTree"
        }),
        reader: new Ext.data.JsonReader({
            fields: [
                {
                    name: "code"
                },
                {
                    name: "text"
                }
            ]
        })
    });

    function initRoles(userId) {
        Ext.Ajax.request({
            url: App.baseURL + "/ur/findByUser",
            params: {
                userId: userId
            },
            success: function (res) {
                var arr = Ext.decode(res.responseText);
                if (arr && arr.length > 0) {
                    for (var i = 0; i < arr.length; i++) {
                        var role = arr[i].role;
                        Ext.get("r_" + role.id).dom.checked = true;
                    }
                }
            },
            failure: function () {
            }
        });
    }

    function showAcrWin(record) {
        var userId = record.data.id;
        if (!acrWin) {
            acrWin = new Ext.Window({
                title: "用户 [<font color='orange'>" + record.data.username
                    + "</font>] 的角色",
                height: 400,
                width: 320,
                constrain: true,
                modal: true,
                resizable: false,
                autoScroll: true,
                closeAction: 'close',
                bodyStyle: 'background-color:white;',
                listeners: {
                    close: function () {
                        acrWin.destroy();
                        acrWin = null;
                    }
                },
                bbar: [ '->', {
                    text: '保存',
                    iconCls: 'saveBtn',
                    handler: function () {
                        var boxs = Ext.select('input[name="roles"]');
                        var rids = '';
                        boxs.each(function () {
                            if (this.dom.checked == true) {
                                rids += ',' + this.dom.value;
                            }
                        });
                        Ext.Ajax.request({
                            url: App.baseURL + '/ur/add',
                            params: {
                                userId: userId,
                                rids: rids.substring(1)
                            },
                            success: function (res) {
                                var ret = Ext.decode(res.responseText);
                                Ext.Msg.alert('提示', ret.msg);
                                if (ret.flag) {
                                    acrWin.close();
                                }
                            },
                            failure: function () {
                            }
                        });
                    }
                }, '-', {
                    text: '取消',
                    iconCls: 'cancelBtn',
                    handler: function () {
                        acrWin.close();
                    }
                } ]
            });
        }
        acrWin.show();
        var myMask = new Ext.LoadMask(acrWin.el, {
            msg: '加载角色信息...',
            removeMask: true
        });
        myMask.show();
        Ext.Ajax
            .request({
                url: App.baseURL + "/role/findAll",
                method: 'POST',
                success: function (res) {
                    var roles = Ext.decode(res.responseText);
                    if (roles && roles.length > 0) {
                        var html = '<table width="100%" cellspacing="0" cellpadding="0" border="0" class="tb">';
                        for (var i = 0; i < roles.length; i += 3) {
                            html += '<tr>';
                            html += '<td width="33%" class="lb"><input type="checkbox" name="roles" id="r_'
                                + roles[i].id
                                + '" value="'
                                + roles[i].id
                                + '"/>&nbsp;<label for="r_'
                                + roles[i].id
                                + '">'
                                + roles[i].roleName + '</label></td>';
                            if (roles[i + 1]) {
                                html += '<td width="33%" class="lb"><input type="checkbox" name="roles" id="r_'
                                    + roles[i + 1].id
                                    + '" value="'
                                    + roles[i + 1].id
                                    + '"/>&nbsp;<label for="r_'
                                    + roles[i + 1].id
                                    + '">'
                                    + roles[i + 1].roleName
                                    + '</label></td>';
                            } else {
                                html += '<td width="33%" class="lb"></td>';
                            }
                            if (roles[i + 2]) {
                                html += '<td class="lb"><input type="checkbox" name="roles" id="r_'
                                    + roles[i + 2].id
                                    + '" value="'
                                    + roles[i + 2].id
                                    + '"/>&nbsp;<label for="r_'
                                    + roles[i + 2].id
                                    + '">'
                                    + roles[i + 2].roleName
                                    + '</label></td>';
                            } else {
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
                failure: function () {
                    myMask.hide();
                }
            });
    }

    function initCheckStatus(aclTree, userId) {
        Ext.Ajax.request({
            url: App.baseURL + "/acl/findByUser",
            params: {
                userId: userId
            },
            success: function (res) {
                var arr = Ext.decode(res.responseText);
                if (arr && arr.length > 0) {
                    for (var i = 0; i < arr.length; i++) {
                        var node = aclTree.getNodeById(arr[i].sysModuleId);
                        if (node) {
                            node.ui.checkbox.checked = true;
                            node.attributes.checked = true;
                        }
                    }
                }
            },
            failure: function () {
            }
        });
    }

    function saveAcl(userId) {
        var mids = "", aclTree = Ext.getCmp('user_aclTree'), checkedNodes = aclTree
            .getChecked();
        if (checkedNodes && checkedNodes.length > 0) {
            for (var i = 0; i < checkedNodes.length; i++) {
                mids += "," + checkedNodes[i].id;
            }
        }
        if (mids.indexOf(",") != -1) {
            mids = mids.substring(1);
        }
        Ext.Ajax.request({
            url: App.baseURL + "/acl/add",
            params: {
                principalType: 'user',
                principalId: userId,
                mids: mids
            },
            success: function (res) {
                var ret = Ext.decode(res.responseText);
                Ext.Msg.alert('提示', ret.msg);
            },
            failure: function () {
            }
        });
    }

    function showAclWin(record) {
        var userId = record.data.id;
        var tree = new Ext.tree.TreePanel({
            id: 'user_aclTree',
            root: new Ext.tree.AsyncTreeNode({
                id: 'root',
                text: '根节点',
                expanded: true
            }),
            loader: new Ext.tree.TreeLoader({
                url: App.baseURL + '/module/findAll'
            }),
            border: false,
            rootVisible: false,
            lines: true,
            autoScroll: true,
            enableDD: false,
            animate: true,
            split: true,
            containerScroll: true,
            collapsible: false
        });
        tree.on('checkchange', function (node, flag) {
            // 获取所有子节点
            node.cascade(function (node) {
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
        if (!aclWin) {
            aclWin = new Ext.Window({
                title: "用户 [<font color='orange'>" + record.data.username
                    + "</font>] 的模块权限",
                height: 400,
                width: 320,
                constrain: true,
                modal: true,
                resizable: false,
                autoScroll: true,
                closeAction: 'close',
                bodyStyle: 'background-color:white;',
                listeners: {
                    close: function () {
                        aclWin.destroy();
                        aclWin = null;
                    }
                },
                items: [ tree ],
                tbar: [ ' ', ' ', {
                    iconCls: 'icon-expand-all',
                    text: '全部展开',
                    handler: function () {
                        var treePanel = Ext.getCmp('user_aclTree');
                        treePanel.root.expand(true);
                    },
                    scope: this
                }, '-', {
                    iconCls: 'icon-collapse-all',
                    text: '全部收缩',
                    handler: function () {
                        var treePanel = Ext.getCmp('user_aclTree');
                        treePanel.root.collapseChildNodes(true);
                    },
                    scope: this
                }, '-', {
                    text: '保存',
                    iconCls: 'add',
                    handler: function () {
                        saveAcl(userId);
                    }
                } ]
            });
        }
        aclWin.show();
        initCheckStatus(tree, userId);
    }

    /** 输入框查询 * */
    function searchSchool() {
        var searchtext = Ext.getCmp('searchText-user').getValue(), code = Ext
            .getCmp('code-user').value, _store = Ext.getCmp(
            'schoolGrid-user').getStore();
        Ext.apply(_store.baseParams, {
            name: searchtext,
            code: code
        });
        _store.load();
    }

    function initAcldStatus(userId) {
        Ext.Ajax
            .request({
                url: App.baseURL + '/acld/findColumnByUser',
                params: {
                    userId: userId
                },
                success: function (res) {
                    var arr = Ext.decode(res.responseText);
                    var _roleGrid = Ext.getCmp('schoolGrid-user'), _roleStore = _roleGrid
                        .getStore(), selectionModel = _roleGrid
                        .getSelectionModel(), willSelectArr = [], _roles = _roleStore
                        .getRange();
                    selectionModel.clearSelections();
                    for (var i = 0; i < _roles.length; i++) {
                        var _role = _roles[i];
                        if (arr.contains(_role.id)) {
                            willSelectArr.push(_role);
                        }
                    }
                    selectionModel.selectRecords(willSelectArr);
                },
                failure: function () {
                    Ext.Msg.alert('提示', '请示失败!');
                }
            });
    }

    /** 获取所在单位 * */
    function showAcldWin(record) {
        var userId = record.data.id;
        var store = new Ext.data.Store({
            autoLoad: false,
            proxy: new Ext.data.HttpProxy({
                url: App.baseURL + '/school/listAll'
            }),
            reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'datas',
                idProperty: 'id',
                fields: [
                    {
                        name: 'id'
                    },
                    {
                        name: 'name'
                    },
                    {
                        name: 'addr'
                    }
                ]
            }),
            baseParams: {
                start: 0,
                limit: 10
            }
        }), sm = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        var win = new Ext.Window(
            {
                title: '托儿所列表',
                height: 350,
                width: 500,
                iconCls: "housetab",
                constrain: true,
                modal: true,
                resizable: false,
                renderTo: tabId,
                closeAction: 'close',
                bodyStyle: 'background-color:white;',
                listeners: {
                    close: function () {
                        win.destroy();
                        win = null;
                    }
                },
                layout: 'fit',
                items: [ new Ext.grid.GridPanel({
                    id: "schoolGrid-user",
                    border: false,
                    columnLines: true,
                    autoScroll: true,
                    store: store,
                    autoHeight: false,
                    stripeRows: true,
                    autoExpandColumn: 'szdq',
                    cm: new Ext.grid.ColumnModel([
                        new Ext.grid.RowNumberer(), sm, {
                            header: '<center>托儿所名称</center>',
                            dataIndex: 'name',
                            sortable: true,
                            width: 150
                        }, {
                            header: '<center>所在地区</center>',
                            dataIndex: 'addr',
                            sortable: true,
                            id: 'szdq'
                        } ]),
                    sm: sm,
                    loadMask: {
                        msg: '正在加载数据……'
                    },
                    bbar: new Ext.PagingToolbar({
                        pageSize: 10,
                        store: store,
                        emptyMsg: "<font color='red'>没有记录</font>",
                        displayInfo: true,
                        plugins: new Ext.ux.ComboPageSize({
                            addToItem: true,
                            index: 10
                        })
                    })
                }) ],
                tbar: [
                    ' ',
                    ' ',
                    {
                        xtype: 'textfield',
                        emptyText: '输入名称关键字查找',
                        id: 'searchText-user',
                        width: 120
                    },
                    ' ',
                    ' ',
                    ' ',
                    {
                        xtype: "myComboxTree",
                        emptyText: '请选择地区',
                        id: 'code-user',
                        width: 200,
                        tree: new Ext.tree.TreePanel(
                            {
                                id: 'dqTree-user',
                                root: new Ext.tree.AsyncTreeNode({
                                    id: 'root',
                                    text: '根节点',
                                    expanded: true,
                                    leaf: false
                                }),
                                loader: new Ext.tree.TreeLoader(
                                    {
                                        url: App.baseURL
                                            + '/org/findOrgTree2',
                                        baseParams: {
                                            pcode: ''
                                        },
                                        listeners: {
                                            beforeLoad: function (loaderObj, node) {
                                                loaderObj.baseParams.pcode = node.id;
                                            }
                                        }
                                    }),
                                border: false,
                                rootVisible: false,
                                lines: false,
                                autoScroll: true
                            })
                    },
                    ' ',
                    ' ',
                    {
                        text: '查&nbsp;&nbsp;询',
                        iconCls: 'query',
                        handler: searchSchool
                    },
                    ' ',
                    ' ',
                    '-',
                    ' ',
                    ' ',
                    {
                        text: '<font color="red">保&nbsp;&nbsp;存</font>',
                        iconCls: 'sure',
                        handler: function () {
                            var grid = Ext.getCmp("schoolGrid-user"), _store = grid
                                .getStore(), sm = grid
                                .getSelectionModel(), allRecords = _store
                                .getRange(), selectRecords = sm
                                .getSelections();
                            var params = '';
                            for (var i = 0; i < allRecords.length; i++) {
                                var record = allRecords[i];
                                if (selectRecords.contains(record)) {
                                    params += ',y_' + record.id;
                                } else {
                                    params += ',n_' + record.id;
                                }
                            }
                            Ext.Ajax.request({
                                url: App.baseURL + '/acld/add',
                                params: {
                                    principalType: 'user',
                                    principalId: userId,
                                    mids: params.substring(1)
                                },
                                success: function (res) {
                                    var ret = Ext
                                        .decode(res.responseText);
                                    Ext.Msg.alert('提示', ret.msg);
                                },
                                failure: function () {
                                    Ext.Msg.alert('提示', '请求失败!');
                                }
                            });
                        }
                    } ]
            });
        win.show();
        store.load();
        initAcldStatus(userId);
    }

    function init() {
        var curPanel = Ext.getCmp('tabsPanel');
        var store = new Ext.data.Store({
            autoLoad: false,
            proxy: new Ext.data.HttpProxy({
                url: App.baseURL + '/archive/list'
            }),
            reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'datas',
                idProperty: 'id',
                fields: [
                    {
                        name: 'destrict'
                    },
                    {
                        name: 'villege'
                    },
                    {
                        name: 'road'
                    },
                    {
                        name: 'hukouBelong'
                    },
                    {
                        name: 'email'
                    },
                    {
                        name: 'province'
                    },
                    {
                        name: 'city'
                    },
                    {
                        name: 'postNo'
                    },
                    {
                        name: 'homePhone'
                    },
                    {
                        name: 'hukouType'
                    },
                    {
                        name: 'major'
                    },
                    {
                        name: 'education'
                    },
                    {
                        name: 'certType'
                    },
                    {
                        name: 'nation'
                    },
                    {
                        name: 'sex'
                    },
                    {
                        name: 'education'
                    },
                    {
                        name: 'minzu'
                    },
                    {
                        name: 'id'
                    },
                    {
                        name: 'name'
                    },
                    {
                        name: 'sex'
                    },
                    {
                        name: 'birthday'
                    },
                    {
                        name: 'certNo'
                    },
                    {
                        name: 'mobilePhone'
                    },
                    {
                        name: 'address'
                    }
                ]
            }),
            baseParams: {
                start: 0,
                limit: limit
            }
        }), sm = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        }), cm = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(), sm,
            {
                header: '<center>教育程度</center>',
                dataIndex: 'education',
                hidden : true
            }, {
                header: '<center>民族</center>',
                dataIndex: 'minzu',
                hidden : true
            }, {

                header: '<center>职业</center>',
                dataIndex: 'major',
                hidden : true
            }, {
                header: '<center>邮政编码</center>',
                dataIndex: 'postNo',
                hidden : true
            }, {
                header: '<center>证件类型</center>',
                dataIndex: 'certType',
                hidden : true
            }, {
                header: '<center>国    籍</center>',
                dataIndex: 'nation',
                hidden : true
            }, {
                header: '<center>省</center>',
                dataIndex: 'province',
                hidden : true
            }, {
                header: '<center>市</center>',
                dataIndex: 'city',
                hidden : true
            }, {
                header: '<center>家庭电话</center>',
                dataIndex: 'homePhone',
                hidden : true
            }, {
                header: '<center>户籍分类</center>',
                dataIndex: 'hukouType',
                hidden : true
            }, {
                header: '<center>区</center>',
                dataIndex: 'destrict',
                hidden : true
            }, {
                header: '<center>镇</center>',
                dataIndex: 'villege',
                hidden : true
            }, {
                header: '<center>街道</center>',
                dataIndex: 'road',
                hidden : true
            }, {
                header: '<center>户口归属</center>',
                dataIndex: 'hukouBelong',
                width: 150,
                hidden : true
            }, {
                header: '<center>电子邮件</center>',
                dataIndex: 'email',
                hidden : true
            }, {
                header: '<center>姓   名</center>',
                dataIndex: 'name',
                sortable: true,
                width: 100
            }, {
                header: '<center>性别</center>',
                dataIndex: 'sex',
                sortable: true,
                width: 100
            }, {
                header: '<center>生日</center>',
                dataIndex: 'birthday',
                sortable: true,
                width: 100
            }, {
                header: '<center>证件号码</center>',
                dataIndex: 'certNo',
                width: 150
            }, {
                header: '<center>联系电话</center>',
                dataIndex: 'mobilePhone'
            }, {
                header: '<center>现居住地</center>',
                dataIndex: 'address',
                id: 'szdq'
            }]);
        grid = new Ext.grid.GridPanel({
            id: 'archiveGrid',
            border: false,
            columnLines: true,
            autoScroll: true,
            store: store,
            autoHeight: false,
            stripeRows: true,
            autoExpandColumn: 'szdq',
            cm: cm,
            sm: sm,
            loadMask: {
                msg: '正在加载数据……'
            },
            bbar: new Ext.PagingToolbar({
                pageSize: limit,
                store: store,
                emptyMsg: "<font color='red'>没有记录</font>",
                displayInfo: true,
                plugins: new Ext.ux.ComboPageSize({
                    addToItem: true,
                    index: 10
                })
            }),
            tbar: [
                {
                    text: '导出',
                    iconCls: 'batchdelete',
                    hidden: !hasPermission('hos_archive_export'),
                    handler: function () {
                        exportToFile();
                    }
                },
                ' ',
                {
                    text: '添加',
                    iconCls: 'add',
                    hidden: !hasPermission('sys_user_add'),
                    handler: function () {
                        showAddOrUpdate('add');
                    }
                },
                ' ',
                {
                    text: '修改',
                    iconCls: 'update',
                    hidden: !hasPermission('sys_user_update'),
                    handler: function () {
                        showAddOrUpdate('update');
                    }
                },
                ' ',
                {
                    text: '删除',
                    iconCls: 'delete',
                    hidden: !hasPermission('sys_user_delete'),
                    handler: doDelete
                },
                '->',
                {
                    xtype: 'combo',
                    id: 'searchCombo',
                    typeAhead: true,
                    triggerAction: 'all',
                    lazyRender: true,
                    mode: 'local',
                    value: 'name',
                    width: 80,
                    editable: false,
                    store: new Ext.data.ArrayStore({
                        fields: [ 'keytype', 'keytext' ],
                        data: [
                            [ 'name', '姓名' ],
                            [ 'sex', '性别' ]
                        ]
                    }),
                    valueField: 'keytype',
                    displayField: 'keytext'
                },
                ' ',
                {
                    xtype: 'textfield',
                    emptyText: '输入关键字查找',
                    enableKeyEvents: true,
                    id: 'searchText',
                    width: 180,
                    listeners: {
                        keydown: {
                            fn: function (t, e) {
                                if (e.keyCode == 13) {
                                    search();
                                }
                            },
                            buffer: 350,
                            scope: this
                        }
                    }
                },
                ' ',
                {
                    text: '查&nbsp;&nbsp;询',
                    iconCls: 'query',
                    handler: search
                },
                '-',
                {
                    text: '刷&nbsp;&nbsp;新',
                    iconCls: 'refresh',
                    handler: function () {
                        store.reload();
                    }
                }
            ],
            listeners: {
                cellclick: function (grid, rowIndex, columnIndex, e) {
                    var rstore = grid.getStore(), record = rstore
                        .getAt(rowIndex);
                    if (columnIndex == 8) {
                        if (!e.getTarget("a"))
                            return;
                        var target = e.getTarget("a").name;
                        if (target == "acr") {
                            showAcrWin(record);
                        } else if (target == "acl") {
                            showAclWin(record);
                        } else if (target == "acld") {
                            showAcldWin(record);
                        }
                    }
                }
            }
        }), tab = curPanel.add({
            title: '&nbsp;病人管理&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
            id: tabId,
            closable: true,
            layout: 'card',
            iconCls: 'userSuit',
            activeItem: 0,
            items: [ grid ]
        });
        curPanel.setActiveTab(tab);
        store.load();
    }

    function exportToFile() {
        var ids = '', grid = Ext.getCmp('archiveGrid'), selects = grid.getSelectionModel().getSelections();
        if (selects.length <= 0) {
            Ext.Msg.alert('提示', '请选择记录进行导出!');
            return;
        }
        for (var i = 0; i < selects.length; i++) {
            ids += ',' + selects[i].json.id;
        }
        Ext.Msg.confirm("提示", "导出档案信息，您确定要导出吗？", function (val) {
            if (val == 'yes') {
                document.location = App.baseURL + "/archive/export?ids="+ids.substring(1);
            }
        });
    }

    /** 添加或者修改 * */
    function showAddOrUpdate(type) {
        var title = '', iconCls = '', btnText = '', url = '', record = null;
        if (type == 'add') {
            title = '添加病人', iconCls = 'add', btnText = '保存', url = App.baseURL
                + '/archive/add';
        } else if (type == 'update') {
            title = '修改病人', iconCls = 'update', btnText = '修改', url = App.baseURL + '/archive/update';
            var grid = Ext.getCmp('archiveGrid'), selectRocords = grid.getSelectionModel().getSelections();
            if (selectRocords.length <= 0) {
                Ext.Msg.alert('提示', '请选择一个用户进行修改!');
                return;
            } else if (selectRocords.length > 1) {
                Ext.Msg.alert('提示', '只能选择一个用户进行修改!');
                return;
            } else {
                record = selectRocords[0];
            }
        }
        if (!addOrUpdateWin) {
            var row1 = new Ext.Panel({
                border: false,
                layout: 'column',
                items: [ new Ext.Panel({
                    layout: 'form',
                    border: false,
                    labelWidth: 80,
                    labelAlign: 'right',
                    items: [
                        {
                            ref: '../name',
                            xtype: 'textfield',
                            fieldLabel: '姓名',
                            name: 'uname',
                            value: (!!record) ? record.data.name : ''
                        }
                    ]
                }), new Ext.Panel({
                    layout: 'form',
                    border: false,
                    labelWidth: 80,
                    labelAlign: 'right',
                    items: [
                        {
                            ref: '../birthday',
                            xtype: 'textfield',
                            fieldLabel: '出生日期',
                            name: 'birthday',
                            value: (!!record) ? record.data.birthday : ''
                        }
                    ]
                }), new Ext.Panel({
                    layout: 'form',
                    border: false,
                    labelWidth: 80,
                    labelAlign: 'right',

                    items: [
                        {
                            ref: '../sex',
                            id: 'sexSelect',
                            xtype: 'combo',
                            fieldLabel: '性别',
                            emptyText: '请选择...',
                            displayField: 'name',
                            mode: 'local',
                            triggerAction: 'all',
                            editable: false,
                            forceSelection: true,
                            blankText: '请选择',
                            store: new Ext.data.Store({
                                autoLoad: true,
                                proxy: new Ext.data.HttpProxy({url: App.baseURL + "/commonDic/listDic"}),
                                reader: new Ext.data.JsonReader({fields: [
                                    {name: "id"},
                                    {name: "name"}
                                ]}),
                                baseParams: {type: App.dicType.xb}
                            }),
                            listeners: {
                                afterRender: function (store, records, opts) {
                                    if (!!record && !!record.data.sex) {
                                        row1.sex.setValue(record.data.sex);
                                    }
                                }
                            }
                        }
                    ]
                }) ]
            });
            var row2 = new Ext.Panel({
                border: false,
                layout: 'column',
                items: [ new Ext.Panel({
                    layout: 'form',
                    border: false,
                    labelWidth: 80,
                    labelAlign: 'right',
                    items: [
                        {
                            ref: '../certType',
                            xtype: 'combo',
                            fieldLabel: '证件类型',
                            emptyText: '请选择...',
                            name: 'certType',
                            displayField: 'name',
                            mode: 'local',
                            triggerAction: 'all',
                            editable: false,
                            forceSelection: true,
                            blankText: '请选择',
                            store: new Ext.data.Store({
                                autoLoad: true,
                                proxy: new Ext.data.HttpProxy({url: App.baseURL + "/commonDic/listDic"}),
                                reader: new Ext.data.JsonReader({fields: [
                                    {name: "id"},
                                    {name: "name"}
                                ]}),
                                baseParams: {type: App.dicType.zjlx}

                            }),
                            listeners: {
                                afterRender: function (store, records, opts) {
                                    if (!!record && !!record.data.certType) {
                                        row2.certType.setValue(record.data.certType);
                                    }
                                }
                            }
                        }
                    ]
                }), new Ext.Panel({
                    layout: 'form',
                    border: false,
                    labelWidth: 80,
                    labelAlign: 'right',
                    items: [
                        {
                            ref: '../certNo',
                            xtype: 'textfield',
                            allowBlank: false,
                            blankText: '不能为空',
                            fieldLabel: '证件号码',
                            name: 'certNo',
                            value: (!!record) ? record.data.certNo : ''
                        }
                    ]
                }), new Ext.Panel({
                    layout: 'form',
                    border: false,
                    labelWidth: 80,
                    labelAlign: 'right',
                    items: [
                        {
                            xtype: 'combo',
                            ref: '../nation',
                            fieldLabel: '国籍',
                            emptyText: '请选择...',
                            name: 'nation',
                            displayField: 'name',
                            mode: 'local',
                            triggerAction: 'all',
                            editable: false,
                            forceSelection: true,
                            blankText: '请选择',
                            store: new Ext.data.Store({
                                autoLoad: true,
                                proxy: new Ext.data.HttpProxy({url: App.baseURL + "/commonDic/listDic"}),
                                reader: new Ext.data.JsonReader({fields: [
                                    {name: "id"},
                                    {name: "name"}
                                ]}),
                                baseParams: {type: App.dicType.gj}
                            }),
                            listeners: {
                                afterRender: function (store, records, opts) {
                                    if (!!record && !!record.data.nation) {
                                        row2.nation.setValue(record.data.nation);
                                    }
                                }
                            }
                        }
                    ]
                }) ]
            });
            var row3 = new Ext.Panel({
                border: false,
                layout: 'column',
                items: [ new Ext.Panel({
                    layout: 'form',
                    border: false,
                    labelWidth: 80,
                    labelAlign: 'right',
                    items: [
                        {
                            ref: '../mobilePhone',
                            xtype: 'textfield',
                            fieldLabel: '移动电话',
                            name: 'mobilePhone',
                            value: (!!record) ? record.data.mobilePhone : ''
                        }
                    ]
                }), new Ext.Panel({
                    layout: 'form',
                    border: false,
                    labelWidth: 80,
                    labelAlign: 'right',
                    items: [
                        {
                            ref: '../education',
                            xtype: 'combo',
                            fieldLabel: '文化程度',
                            name: 'education',
                            emptyText: '请选择...',
                            name: 'education',
                            displayField: 'name',
                            mode: 'local',
                            triggerAction: 'all',
                            editable: false,
                            forceSelection: true,
                            blankText: '请选择',
                            store: new Ext.data.Store({
                                autoLoad: true,
                                proxy: new Ext.data.HttpProxy({url: App.baseURL + "/commonDic/listDic"}),
                                reader: new Ext.data.JsonReader({fields: [
                                    {name: "id"},
                                    {name: "name"}
                                ]}),
                                baseParams: {type: App.dicType.xl},

                            }),
                            listeners: {
                                afterRender: function (store, records, opts) {
                                    if (!!record && !!record.data.education) {
                                        row3.education.setValue(record.data.education);
                                    }
                                }
                            }
                        }
                    ]
                }), new Ext.Panel({
                    layout: 'form',
                    border: false,
                    labelWidth: 80,
                    labelAlign: 'right',
                    items: [
                        {
                            ref: '../minzu',
                            xtype: 'combo',
                            fieldLabel: '民族',
                            emptyText: '请选择...',
                            name: 'minzu',
                            displayField: 'name',
                            mode: 'local',
                            triggerAction: 'all',
                            editable: false,
                            forceSelection: true,
                            blankText: '请选择',
                            selectOnFocus:'true',
                            store: new Ext.data.Store({
                                autoLoad: true,
                                proxy: new Ext.data.HttpProxy({url: App.baseURL + "/commonDic/listDic"}),
                                reader: new Ext.data.JsonReader({fields: [
                                    {name: "id"},
                                    {name: "name"}
                                ]}),
                                baseParams: {type: App.dicType.mz}
                            }),
                            listeners: {
                                afterRender: function (store, records, opts) {
                                    if (!!record && !!record.data.minzu) {
                                        row3.minzu.setValue(record.data.minzu);
                                    }
                                }
                            }
                        }
                    ]
                }) ]
            });
            var row4 = new Ext.Panel({
                border: false,
                layout: 'column',
                items: [ new Ext.Panel({
                    layout: 'form',
                    border: false,
                    labelWidth: 80,
                    labelAlign: 'right',
                    items: [
                        {
                            ref: '../homePhone',
                            xtype: 'textfield',
                            fieldLabel: '家庭电话',
                            name: 'homePhone',
                            value: (!!record) ? record.data.homePhone : ''

                        }
                    ]
                }), new Ext.Panel({
                    layout: 'form',
                    border: false,
                    labelWidth: 80,
                    labelAlign: 'right',
                    items: [
                        {
                            ref: '../hukouType',
                            xtype: 'combo',
                            fieldLabel: '户籍分类',
                            name: 'education',
                            emptyText: '请选择...',
                            name: 'hukouType',
                            displayField: 'name',
                            mode: 'local',
                            triggerAction: 'all',
                            editable: false,
                            forceSelection: true,
                            blankText: '请选择',
                            store: new Ext.data.Store({
                                autoLoad: true,
                                proxy: new Ext.data.HttpProxy({url: App.baseURL + "/commonDic/listDic"}),
                                reader: new Ext.data.JsonReader({fields: [
                                    {name: "id"},
                                    {name: "name"}
                                ]}),
                                baseParams: {type: App.dicType.hjlx}
                            }),
                            listeners: {
                                afterRender: function (store, records, opts) {
                                    if (!!record && !!record.data.hukouType) {
                                        row4.hukouType.setValue(record.data.hukouType);
                                    }
                                }
                            }
                        }
                    ]
                }), new Ext.Panel({
                    layout: 'form',
                    border: false,
                    labelWidth: 80,
                    labelAlign: 'right',
                    items: [
                        {
                            ref: '../major',
                            xtype: 'combo',
                            fieldLabel: '职业',
                            emptyText: '请选择...',
                            name: 'major',
                            displayField: 'name',
                            mode: 'local',
                            triggerAction: 'all',
                            editable: false,
                            forceSelection: true,
                            blankText: '请选择',
                            store: new Ext.data.Store({
                                autoLoad: true,
                                proxy: new Ext.data.HttpProxy({url: App.baseURL + "/commonDic/listDic"}),
                                reader: new Ext.data.JsonReader({fields: [
                                    {name: "id"},
                                    {name: "name"}
                                ]}),
                                baseParams: {type: App.dicType.zy}

                            }),
                            listeners: {
                                afterRender: function (store, records, opts) {
                                    if (!!record && !!record.data.major) {
                                        row4.major.setValue(record.data.major);
                                    }
                                }
                            }
                        }
                    ]
                }) ]
            });
            var row5 = new Ext.Panel({
                border: false,
                layout: 'column',
                items: [ new Ext.Panel({
                    layout: 'form',
                    border: false,
                    labelWidth: 80,
                    labelAlign: 'right',
                    items: [
                        {
                            ref: '../postNo',
                            xtype: 'textfield',
                            fieldLabel: '邮政编码',
                            name: 'postNo',
                            value: (!!record) ? record.data.postNo : ''
                        }
                    ]
                }), new Ext.Panel({
                    layout: 'form',
                    border: false,
                    labelWidth: 80,
                    labelAlign: 'right',
                    items: [
                        {
                            ref: '../hukouBelong',
                            xtype: 'combo',
                            fieldLabel: '户籍归属',
                            name: 'education',
                            emptyText: '请选择...',
                            name: 'hukouBelong',
                            displayField: 'name',
                            mode: 'local',
                            triggerAction: 'all',
                            editable: false,
                            forceSelection: true,
                            blankText: '请选择',
                            store: new Ext.data.Store({
                                autoLoad: true,
                                proxy: new Ext.data.HttpProxy({url: App.baseURL + "/commonDic/listDic"}),
                                reader: new Ext.data.JsonReader({fields: [
                                    {name: "id"},
                                    {name: "name"}
                                ]}),
                                baseParams: {type: App.dicType.hjgs},

                            }),
                            listeners: {
                                afterRender: function (store, records, opts) {
                                    if (!!record && !!record.data.hukouBelong) {
                                        row5.hukouBelong.setValue(record.data.hukouBelong);
                                    }
                                }
                            }
                        }
                    ]
                }), new Ext.Panel({
                    layout: 'form',
                    border: false,
                    labelWidth: 80,
                    labelAlign: 'right',
                    items: [
                        {
                            ref: '../email',
                            xtype: 'textfield',
                            fieldLabel: '电子邮件',
                            emptyText: '请选择...',
                            value: (!!record) ? record.data.email : ''
                        }
                    ]
                }) ]
            });
            var province;
            var city;
            var desctrict;
            var row6 = new Ext.Panel({
                border: false,
                layout: 'column',
                items: [ new Ext.Panel({
                    layout: 'form',
                    border: false,
                    labelWidth: 80,
                    labelAlign: 'right',
                    items: [
                        {
                            xtype: 'combo',
                            ref: '../province',
                            id:'provinceSelect',
                            fieldLabel: '户口地址',
                            triggerAction: 'all',
                            lazyRender: true,
                            mode: 'local',
                            emptyText: '请选择...',
                            editable: false,
                            store: provinceStore,
                            width : 100,
                            listeners: {
                                select: function (combo, record, index) {
                                    row6.city.clearValue();
                                    row6.destrict.clearValue();
                                    row6.villege.clearValue();
                                    row6.road.clearValue();

                                    cityStore.load({
                                        params: {
                                            'pcode': combo.value
                                        }
                                    });
                                },
                                afterRender: function (store, records, opts) {
                                    if (!!record && !!record.data.province) {
                                        row6.province.setValue(record.data.province);
                                    }
                                }
                            },
                            valueField: 'code',
                            displayField: 'text'
                        }
                    ]
                }), new Ext.Panel({
                    layout: 'form',
                    border: false,
                    labelWidth: 1,
                    labelAlign: 'right',
                    items: [
                        {
                            xtype: 'combo',
                            id : 'citySelect',
                            ref: '../city',
                            triggerAction: 'all',
                            lazyRender: true,
                            mode: 'local',
                            emptyText: '请选择...',
                            editable: false,
                            store: cityStore,
                            width : 100,
                            listeners: {
                                select: function (combo, record, index) {
                                    row6.destrict.clearValue();
                                    row6.villege.clearValue();
                                    row6.road.clearValue();
                                    destrictStore.load({
                                        params: {
                                            'pcode': combo.value
                                        }
                                    });
                                },
                                afterRender: function (store, records, opts) {
                                    if(!!record) {
                                        var city = record.data.city;
                                        if (!!city) {
                                            cityStore.load({
                                                params: {
                                                    'pcode': record.data.province
                                                },
                                                callback : function() {
                                                    row6.city.setValue(city);
                                                }
                                            });

                                        }
                                    }
                                }
                            },
                            valueField: 'code',
                            displayField: 'text'
                        }
                    ]
                }), new Ext.Panel({
                    layout: 'form',
                    border: false,
                    labelWidth: 1,
                    items: [
                        {
                            xtype: 'combo',
                            ref: '../destrict',
                            id : 'destrictSelect',
                            triggerAction: 'all',
                            lazyRender: true,
                            mode: 'local',
                            emptyText: '请选择...',
                            editable: false,
                            store: destrictStore,
                            width : 100,
                            listeners: {
                                select: function (combo, record, index) {
                                    row6.villege.clearValue();
                                    row6.road.clearValue();
                                    villegeStore.load({
                                        params: {
                                            'pcode': combo.value
                                        }
                                    });
                                },
                                afterRender: function (store, records, opts) {
                                    if(!!record) {
                                        var destrict = record.data.destrict;
                                        if (!!destrict) {
                                            console.log(Ext.getCmp('citySelect'));
                                            console.log(store);
                                            destrictStore.load({

                                                params: {
                                                    'pcode': record.data.city
                                                },
                                                callback: function () {
                                                    row6.destrict.setValue(destrict);
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            valueField: 'code',
                            displayField: 'text'
                        }
                    ]
                }), new Ext.Panel({
                    layout: 'form',
                    border: false,
                    labelWidth: 1,
                    items: [
                        {
                            xtype: 'combo',
                            ref: '../villege',
                            triggerAction: 'all',
                            lazyRender: true,
                            mode: 'local',
                            emptyText: '请选择...',
                            editable: false,
                            store: villegeStore,
                            width : 100,
                            listeners: {
                                select: function (combo, record, index) {
                                    row6.road.clearValue();
                                    roadStore.load({
                                        params: {
                                            'pcode': combo.value
                                        }
                                    });
                                },
                                afterRender: function (store, records, opts) {
                                    if(!!record) {
                                        var villege = record.data.villege;
                                        if (!!villege) {
                                            villegeStore.load({
                                                params: {
                                                    'pcode': record.data.destrict
                                                },
                                                callback: function () {
                                                    row6.villege.setValue(villege);
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            valueField: 'code',
                            displayField: 'text'
                        }
                    ]
                }), new Ext.Panel({
                    id: 'roadSelect',
                    layout: 'form',
                    border: false,
                    labelWidth: 1,
                    items: [
                        {
                            width : 100,
                            xtype: 'combo',
                            ref: '../road',
                            triggerAction: 'all',
                            lazyRender: true,
                            mode: 'local',
                            emptyText: '请选择...',
                            editable: false,
                            store: roadStore,
                            listeners: {
                                afterRender: function (store, records, opts) {
                                    if(!!record) {
                                        var road = record.data.road;
                                        if (!!road) {
                                            roadStore.load({
                                                params: {
                                                    'pcode': record.data.villege
                                                },
                                                callback: function () {
                                                    row6.road.setValue(road);
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            valueField: 'code',
                            displayField: 'text'
                        }
                    ]
                }),
                    new Ext.Panel({
                        layout: 'form',
                        border: false,
                        labelWidth: 1,
                        labelAlign: 'right',
                        items: [
                            {
                                ref: '../address',
                                xtype: 'textfield',
                                name: 'address',
                                value: (!!record) ? record.data.address : ''
                            }
                        ]
                    })]
            });
            addOrUpdateWin = new Ext.Window(
                {
                    title: title,
                    width: 850,
                    autoHeight: true,
                    iconCls: iconCls,
                    constrain: true,
                    modal: true,
                    resizable: false,
                    renderTo: tabId,
                    closeAction: 'close',
                    bodyStyle: 'background-color:white;',
                    listeners: {
                        close: function () {
                            addOrUpdateWin.destroy();
                            addOrUpdateWin = null;
                        }
                    },
                    items: [ new Ext.form.FormPanel({
                        ref: 'itemForm',
                        layout: 'form',
                        border: false,
                        labelWidth: 40,
                        labelAlign: 'right',
                        baseCls:'formMargin',
                        items: [ row1, row2, row3, row4, row5, row6 ]
                    }) ],
                    bbar: [
                        '->',
                        {
                            text: btnText,
                            iconCls: 'saveBtn',
                            handler: function () {
                                if (!addOrUpdateWin.itemForm.getForm().isValid()) {
                                    return;
                                }

                                var name = row1.name.getValue();
                                var birthday = row1.birthday.getValue();
                                var sex = row1.sex.getValue();

                                var certType = row2.certType.getValue();
                                var certNo = row2.certNo.getValue();
                                var nation = row2.nation.getValue();

                                var mobilePhone = row3.mobilePhone.getValue();
                                var education = row3.education.getValue();
                                var minzu = row3.minzu.getValue();

                                var homePhone = row4.homePhone.getValue();
                                var hukouType = row4.hukouType.getValue();
                                var major = row4.major.getValue();


                                var postNo = row5.postNo.getValue();
                                var hukouBelong = row5.hukouBelong.getValue();
                                var email = row5.email.getValue();

                                var province = row6.province.getValue();
                                var city = row6.city.getValue();
                                var destrict = row6.destrict.getValue();
                                var villege = row6.villege.getValue();
                                var road = row6.road.getValue();
                                var address = row6.address.getValue();
                                var archiveId = record ? record.data.id : 0;

                                myMask = new Ext.LoadMask(
                                    addOrUpdateWin.el, {
                                        msg: '正在保存数据...',
                                        removeMask: true
                                    });
                                myMask.show();
                                Ext.Ajax.request({
                                    url: url,
                                    method: 'POST',
                                    params: {
                                        id: archiveId,
                                        name: name,
                                        sex: sex,
                                        mobilePhone: mobilePhone,
                                        education: education,
                                        minzu: minzu,
                                        certType: certType,
                                        certNo: certNo,
                                        nation: nation,
                                        homePhone: homePhone,
                                        hukouType: hukouType,
                                        major: major,
                                        hukouBelong: hukouBelong,
                                        postNo: postNo,
                                        email: email,
                                        province: province,
                                        city: city,
                                        destrict: destrict,
                                        road: road,
                                        address: address,
                                        villege: villege
                                    },
                                    success: function (res) {
                                        myMask.hide();
                                        var ret = Ext.decode(res.responseText);
                                        if (ret.flag) {
                                            Ext.Msg.alert('提示', '操作成功');
                                            Ext.getCmp('archiveGrid').getStore().reload();
                                            addOrUpdateWin.close();
                                        } else {
                                            Ext.Msg.alert('提示', ret.msg);
                                        }
                                    },
                                    failure: function (res) {
                                        Ext.Msg.alert('提示', res.responseText);
                                        myMask.hide();
                                    }
                                });
                            }
                        },
                        '-',
                        {
                            text: '重置',
                            iconCls: 'resetBtn',
                            handler: function () {
                                addOrUpdateWin.itemForm.getForm()
                                    .reset();
                            }
                        }, '-', {
                            text: '取消',
                            iconCls: 'cancelBtn',
                            handler: function () {
                                addOrUpdateWin.close();
                            }
                        } ]
                });
        }
        addOrUpdateWin.show();
    }

    /** 输入框查询 * */
    function search() {
        var keytype = Ext.getCmp('searchCombo').getValue(), searchtext = Ext
            .get('searchText').getValue(), _store = Ext.getCmp('archiveGrid')
            .getStore();
        if (!App.regNull.test(searchtext) && searchtext != '输入关键字查找') {
            Ext.apply(_store.baseParams, {
                keyword: searchtext,
                field: keytype
            });
            _store.load();
        } else {
            Ext.apply(_store.baseParams, {
                field: '',
                keyword: ''
            });
            _store.load();
        }
    }

    function doDelete() {
        var ids = '', grid = Ext.getCmp('archiveGrid'), selects = grid.getSelectionModel().getSelections();
        if (selects.length <= 0) {
            Ext.Msg.alert('提示', '请选择记录进行删除!');
            return;
        }
        for (var i = 0; i < selects.length; i++) {
            ids += ',' + selects[i].json.id;
        }
        Ext.Msg.confirm("提示", "删除用户信息，将把用户相关信息一起删除，您确定要删除吗？", function (val) {
            if (val == 'yes') {
                Ext.Ajax.request({
                    url: App.baseURL + "/archive/delete",
                    method: 'POST',
                    params: {
                        ids: ids.substring(1)
                    },
                    success: function (response) {
                        var json = Ext.decode(response.responseText);
                        if (json.flag) {
                            Ext.Msg.alert("提示", "删除成功");
                            grid.getStore().reload();
                        } else {
                            Ext.Msg.alert("提示", "删除失败");
                        }
                    },
                    failure: function () {
                        Ext.Msg.alert('提示', '删除出错');
                    }
                });
            }
        });
    }

    /** 激活面板 * */
    function active() {
        var curPanel = Ext.getCmp('tabsPanel');
        curPanel.setActiveTab(tabId);
    }

    return {
        init: init,
        active: active
    };
})();
