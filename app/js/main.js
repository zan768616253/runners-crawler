var ws = new WebSocket('ws://127.0.0.1:' + port);

ws.onopen = function () {
    console && console.info && console.info('websocket建立连接成功');
};

ws.onmessage = function (e) {
    var data = $.parseJSON(e.data);
    $("#LogList").prepend('<li class="' + data.color + '">' + data.info + '</li>');
    /// 停止执行
    data.status === 0 && setTimeout(function () {
        exec.stop();
    }, 600);
};

var tip = function (info) {
    return dialog({
        title: '操作提示',
        content: info
    });
}

var exec = {};

/// 添加/编辑弹窗
exec.modal = function (_data) {
    var self = $(this);
    var levelitem = function () {
        return {
            selector: ko.observable(),
            attr: ko.observable()
        };
    };
    dialog({
        title: _data ? "编辑配置" : "新增配置",
        width: 700,
        height: 356,
        padding: '5px 0',
        content: '<div id="AddConfig" class="config-wrap" data-bind="template:{name:\'AddTpl\'}"></div>',
        onshow: function () {
            var self = this;
            var data = _data || {};
            this.viewmodel = {
                configName: ko.observable(data.configName),
                url: ko.observable(data.url),
                type: ko.observable(data.type),
                page: ko.observable(data.page + ''),
                from: ko.observable(data.from || 1),
                to: ko.observable(data.to || 1),
                charset: ko.observable(data.charset),
                saveDir: ko.observable(data.saveDir),
                imageFn: ko.observable(data.imageFn),
                levels: ko.observableArray(data.levels),
                remove: function (index) {
                    self.viewmodel.levels.splice(index, 1);
                }
            };
            !_data && this.viewmodel.levels.push(levelitem());
            ko.cleanNode(document.getElementById("AddConfig"));
            ko.applyBindings(this.viewmodel, document.getElementById("AddConfig"));

            var bubble = dialog({
                align: 'top left'
            });

            var events = {
                mouseenter: function (event) {
                    var tipinfo = $(this).data('tip');
                    if (tipinfo) {
                        bubble.content(tipinfo);
                        bubble.show(event.target);
                    }
                },
                mouseout: function () {
                    bubble.close();
                }
            };
            $("#AddConfig input:text").on(events);
            $("#AddConfig").find('ul.config-add').delegate("li input", events);
        },
        button: [
            {
                value: '增加层级',
                callback: function () {
                    this.viewmodel.levels.push(levelitem());
                    return false;
                }
            },
            {
                value: '保存配置',
                callback: function () {
                    var dd = this;
                    var data = validation(ko.toJS(this.viewmodel));
                    clearTimeout(this.f);
                    if (typeof data === 'string') {
                        this.statusbar('<span class="am-text-danger">' + data + '</span>');
                        this.f = setTimeout(function () {
                            dd.statusbar('');
                        }, 2500);
                    } else {
                        delete data.remove;
                        $.ajax({
                            type: "post",
                            url: "/config/add",
                            data: data,
                            success: function (json) {
                                if (json.status) {
                                    var configname = $.trim(data.configName);
                                    dd.close().remove();
                                    if (_data) {
                                        var cc = self.children();
                                        cc.first().text(configname);
                                        cc.last().attr("data-name", configname);
                                    } else {
                                        $('#ConfigList').prepend('<li><span>' + configname + '</span><div class="nc-item-btns" data-name="' + configname + '"><button class="am-btn am-btn-xs am-btn-success" tag="start">爬取</button><button class="am-btn am-btn-xs am-btn-primary" tag="edit">修改</button><button class="am-btn am-btn-xs am-btn-warning" tag="delete">删除</button></div></li>');
                                    }
                                } else {
                                    self.statusbar('<span class="am-text-danger">' + json.info + '</span>');
                                }
                            }
                        });
                    }
                    return false;
                }
            },
            {
                value: '关闭',
                callback: function () {
                    this.close();
                }
            }
        ]
    }).showModal();;
}

