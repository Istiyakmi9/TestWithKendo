// kendo.ui.Dashboard
// 
// Configuration
//    autoBind
//    template
//    widgetList : array
//    widgetList.content
//    widgetList.content.name
//    widgetList.content.template
//    widgetList.title
//    widgetList.title.template
//    widgetList.title.text
//    widgetList.cssClass
//    widgetList.popout
//    widgetList.popout.appendTo
//    widgetList.popout.cssClass
//    widgetList.popout.template
//    dataSizeXField
//    dataSizeYField
//    dataRowField
//    dataColField
//    widgetFailedTemplate
//    widgetMisconfiguredTemplate
//
// Fields
//
//    element   
//
// Methods
//
//     addWidget
//     dataItem
//     edit
//     endEdit
//     nextPosition
//     refresh
//     refreshWidget
//     setWidgetState
//     save
//
// Events
//
//     change
//         e.action
//             add
//             itemchange
//             remove
//             resize
//     dataBinding
//     dataBound
//     drag
//     save

(function($, kendo, undefined) {
    var CHANGE       = "change",
        DATABINDING  = "dataBinding",
        DATABOUND    = "dataBound",
        DRAG         = "drag",
        ITEMCHANGE   = "itemChange",
        RESIZE       = "resize",
        SAVE         = "save",
        WIDGET_X     = "data-gs-x",
        WIDGET_Y     = "data-gs-y",
        WIDGET_W     = "data-gs-width",
        WIDGET_H     = "data-gs-height";

    var Dashboard = kendo.ui.Widget.extend({  
        init: function(element, options) {
            var that = this;

            kendo.ui.Widget.fn.init.call(that, element, options);
            
            that._templates();

            that._widgetList();

            that._gridstack();
            
            that._dataSource();

            kendo.notify(that);
        },
        events: [
            CHANGE,
            DATABINDING,
            DATABOUND,
            DRAG,
            ITEMCHANGE,
            SAVE
        ],
        options: {
            name: "Dashboard",
            autoBind: true,
            template: "",
            widgetList: [],
            dataSizeXField: "",
            dataSizeYField: "",
            dataRowField: "",
            dataColField: "",
            widgetFailedTemplate: "",
            widgetMisconfiguredTemplate: ""
        },
        _templates: function() {
            var options = this.options;

            this.template                    = kendo.template(options.template || "<div class='grid-stack grid-stack-8'></div>");
            this.widgetFailedTemplate        = kendo.template(options.widgetFailedTemplate || "");
            this.widgetMisconfiguredTemplate = kendo.template(options.widgetMisconfiguredTemplate || "");
        },
        _dataSource: function() {
            var that = this;

            if (that.dataSource && that._refreshHandler) {
                that.dataSource.unbind(CHANGE, that._refreshHandler);
            } 
            else {
                that._refreshHandler = $.proxy(that._refresh, that);
            }

            that.dataSource = kendo.data.DataSource.create(that.options.dataSource);

            that.dataSource.bind(CHANGE, that._refreshHandler);

            if (that.options.autoBind) {
                that.dataSource.fetch();
            }
        },
        addWidget: function(dataItem) {
            var nextPosition = this.nextPosition(dataItem.sizeX, dataItem.sizeY);

            if (!nextPosition) {
                return false;
            }
            else {
                dataItem.positionX = nextPosition.col;
                dataItem.positionY = nextPosition.row;
                dataItem.sizeX     = nextPosition.size_x;
                dataItem.sizeY     = nextPosition.size_y;
            }

            this.dataSource.add(dataItem);

            return true;
        },
        dataItem: function(element) {
            var uid = element.attr(kendo.attr('uid'));
            
            return this.dataSource.getByUid(uid);
        },
        edit: function() {
            var that = this;

            $(that.element).addClass("k-state-edit");

            var items = that.items();

            $.each(items, function(i, item) {
                $(item).addClass("k-state-edit");
            });

            that._gridstack.enable();
        },
        endEdit: function() {
            var that = this;

            $(that.element).removeClass("k-state-edit");

            var items = that.items();

            $.each(items, function(i, item) {
                $(item).removeClass("k-state-edit");

                if ($(that.element).hasClass("k-state-ready") && !$(that.element).hasClass("k-state-edit")) {
                    $(that.element).removeClass("k-state-ready");
                }
            });
 
            that._gridstack.disable();
        },
        items: function() {
            return $(this.element).find(".k-dashboard-widget");
        },
        nextPosition: function(sizeX, sizeY) {
            var position = this._gridstack.willItFit(0, 0, sizeX, sizeY, true);

            if (!position) {
                return false;
            }

            return {
                positionX: position.col,
                positionY: position.row,
                sizeX: position.size_x,
                sizeY: position.size_y
            };
        },
        refresh: function () {
            this._refresh({action:undefined});
        },
        refreshWidget: function(dataItem) {
            var that = this;

            that._refreshWidget(dataItem)
                .done(function (widget) {
                    that.trigger(ITEMCHANGE, { item: widget, data:  dataItem });
                });
        },
        save: function() {
            var that  = this;
            var items = that.items();

            $.each(items, function(i, item){
               var widget       = $(item).data("widget");

               widget.positionX = parseInt($(item).attr(WIDGET_X)) + 1;
               widget.positionY = parseInt($(item).attr(WIDGET_Y)) + 1;
               widget.sizeX     = parseInt($(item).attr(WIDGET_W));
               widget.sizeY     = parseInt($(item).attr(WIDGET_H));
            });

            that.trigger(SAVE);
        },
        setDataSource: function(dataSource) {
            this.options.dataSource = dataSource;
            this._dataSource();
        },
        setWidgetState: function (dataItem, state, message) {
            var widget = this._getWidget(dataItem);

            switch (state) {
                case "normal":
                    widget.removeClass("k-state-failed");
                    widget.removeClass("k-state-misconfigured");
                    widget.addClass("k-state-normal");
                    break;
                case "misconfigured":
                    widget.removeClass("k-state-normal");
                    widget.removeClass("k-state-failed");
                    widget.addClass("k-state-misconfigured");
                    break;
                case "error":
                    widget.removeClass("k-state-normal");
                    widget.removeClass("k-state-misconfigured");
                    widget.addClass("k-state-failed");
                    console.log(message);
                    break;
            }
        },
        widget: function (dataItem) {
            return this._getWidget(dataItem);
        },
        _addWidget: function(dataItem) {
            var that = this;
            
            var widgetOption = that.widgetList.find(function(option) {
                return dataItem.widget === option.name;
            });

            if (!widgetOption) {
                widgetOption = {
                    name: dataItem.widget
                };
            }
            
            if (widgetOption) {
                var isEdit    = $(that.element).hasClass("k-state-edit");
                var widgetDOM = that._renderItem(widgetOption.name, widgetOption.title, widgetOption.content, widgetOption.edit, dataItem, widgetOption.commands, widgetOption.popout);
                var widget;

                if (dataItem.positionX && dataItem.positionY) {
                    widget = $(that._gridstack.addWidget(widgetDOM, {x: dataItem.positionX - 1, y: dataItem.positionY - 1, width: dataItem.sizeX, height: dataItem.sizeY, noResize: !isEdit, noMove: !isEdit }));
                }
                else {
                    widget = $(that._gridstack.addWidget(widgetDOM, {x: 0, y: 0, width: dataItem.sizeX, height: dataItem.sizeY, autoPosition: true, noResize: !isEdit, noMove: !isEdit}));
                }
           
                widget.data("widget", dataItem);

                if (isEdit) {
                    widget.addClass("k-state-edit");
                }

                if (widgetOption.cssClass) {
                    $(widget).addClass(widgetOption.cssClass);
                }

                $(widget).addClass("k-state-ready");
                
                $(widget).find(".k-dashboard-widget-header .k-dashboard-widget-command.remove").on("click", function() {
                     that.dataSource.remove(dataItem);
                });
    
                $(widget).find(".k-dashboard-widget-header .k-dashboard-widget-command.refresh").on("click", function() {
                    if (dataItem.refresh && widgetOption.content.template) {
                        dataItem.refresh();
                    }
                    else {
                        that.refreshWidget(dataItem);
                    }
                });

                $(widget).find(".k-dashboard-widget-header .k-dashboard-widget-command.expand[title='Popout']").on("click", function () {
                    that._popoutDataItem(dataItem, widgetOption.content, widgetOption.popout);
                });

                // If no template is specified, we assume this is a url
                if (widgetOption.content && !widgetOption.content.template) {
                    return that._renderAjax(dataItem, widget, widgetOption.content);
                }

                if (!widgetOption.content) {
                    that.setWidgetState(dataItem, "error", kendo.format("Widget '{0}' is not recognized.", widgetOption.name));
                }
               
                return $.Deferred().resolve(widget).promise();
            }
        },
        _getWidget: function (dataItem) {
            var widget;

            $.each(this.items(), function(i, item) {
                if ($(item).data("uid") == dataItem.uid) {
                    widget = $(item);
                    return false;
                }     
            });

            if (!widget) {
                return null;
            }

            return widget;
        },
        _getWidgetBody: function (widget) {
            return widget.find(".k-dashboard-widget-body");
        },
        _gridstack: function() {
            var that        = this;
            var html        = that.template({});
            var gridElement = $(html);

            $(that.element).html(gridElement);

            that._gridstack = GridStack.init({
                disableOneColumnMode: true,
                float: true,
                cellHeight: 100,
                maxRow: 8,
                maxCol: 8,
                column: 8,
                row: 8,
                verticalMargin: 0,
                handleClass: "k-dashboard-widget-header"
            }, $(gridElement));

            that._gridstack.disable();
            that._gridstack.on("dragstart", $.proxy(that._gridstack_drag, that));
            that._gridstack.on("dragstop", $.proxy(that._gridstack_drag, that));
            that._gridstack.on("resizestart", $.proxy(that._gridstack_resize, that));
            that._gridstack.on("resizestop", $.proxy(that._gridstack_resize, that));
        },
        _gridstack_drag: function(e, ui, scope) {
            var widget   = $(ui.element);
            var dataItem = this.dataItem(widget);

            this.trigger(CHANGE, { action: "drag", widget: widget.eq(0), data: dataItem });
        },
        _gridstack_resize: function(e, ui, scope) {
            var widget   = $(ui.element);
            var dataItem = this.dataItem(widget);

            this.trigger(CHANGE, { action: "resize", item: widget.eq(0), data: dataItem });
        },
        _popoutDataItem: function(dataItem, content, popoutOptions) {
            var that     = this; 

            var template = popoutOptions.template ? kendo.template($("#" + popoutOptions.template).html()) 
                                                  : kendo.template($("#" + content.template).html());

            var html     = template(dataItem);           
            var element  = $("<div></div>");
            var options  = this._popoutOptions(element, dataItem, popoutOptions);
            var popout   = element.kendoWindow(options)
                                  .data("kendoWindow");

            $(popout.wrapper).addClass("dashboard-popout");

            if (popoutOptions.cssClass) {
                $(popout.wrapper).addClass(popoutOptions.cssClass);
            }

            popout.content(html);

            if (!popoutOptions.appendTo) {
                popout.center();
            }

            that.bind(DATABOUND, function () {
                popout.close();
            });
            
            popout.open();
        },
        _popoutOptions: function (element, dataItem, popoutOptions) {
            var that    = this;
            var options = {
                title: dataItem.widget,
                modal: false,
                animation: {
                    close: false
                },
                open: function() {
                    kendo.bind(element, dataItem);
                    that.trigger("popoutOpen", {modal: options.modal, dataItem: dataItem});
                },
                close: function() {
                    this.destroy();
                    that.trigger("popoutClose", {modal: options.modal, dataItem: dataItem});
                }
            };

            if (popoutOptions.appendTo == null) {
                options.modal     = true;
                options.resizable = true;
                options.draggable = true;
                options.actions   = ["Maximize", "Close"];
                
                if (popoutOptions.width) {
                    options.width = popoutOptions.width;
                }

                if (popoutOptions.height) {
                    options.height = popoutOptions.height;
                }
            }
            else if (popoutOptions.appendTo) {
                var width  = "calc(100% - 24px)";
                
                options.scrollable = false;
                options.resizable  = false;
                options.draggable  = false;
                options.appendTo   = popoutOptions.appendTo;
                options.width      = width;
                options.actions    = ["Close"];
            }

            return options;
        },
        _refresh: function(e) {
            var that = this;

            // NOTE: This is required by kendo custom widgets to unbind anything already bound prior to
            //       DOM recreation and binding again, but I found that in some controls like Kendo TreeView
            //       they do not call it at all, but make use of itemChange. This seems to resolve issues
            //       when items are added dynamically and prevents binding from happening too many items across
            //       different items, but does not appear typical for a UI component.
            // that.trigger(DATABINDING);

            switch (e.action) {
                case undefined:
                    that._gridstack.removeAll();

                    // NOTE: Only called for the initial binding when the data source is initially
                    //       changed, then ITEMCHANGE handles future binding concerns.
                    that.trigger(DATABOUND);

                    $.each(that.dataSource !== null ? that.dataSource.view() : [], function(i, dataItem) {
                        that._addWidget(dataItem)
                            .done(function (widget) {
                                that.trigger(ITEMCHANGE, { item: widget.eq(0), data: dataItem });
                            });
                    });

                    break;
                case "add":
                    $.each(e.items, function(i, dataItem) {
                        that._addWidget(dataItem)
                            .done(function (widget) {
                                that.trigger(ITEMCHANGE, { item: widget.eq(0), data: dataItem });
                            });
                    });
                    break;
                case "remove":
                    $.each(e.items, function(i, dataItem) {
                        var widget = that._getWidget(dataItem);

                        that.trigger(ITEMCHANGE, { item: widget.eq(0), data: dataItem });
                        
                        that._removeWidget(dataItem);  
                    });
                    break;
            }
        },
        _refreshWidget: function(dataItem) {
            var that   = this;
            var widget = that._getWidget(dataItem);

            var widgetOption = that.widgetList.find(function(option) {
                return dataItem.widget === option.name;
            });

            if (!widgetOption.content.template) {
                return that._renderAjax(dataItem, widget, widgetOption.content);           
            }

            return $.Deferred().resolve(widget).promise();
        },
        _removeWidget: function(dataItem) {
            var that = this;
            var removedWidget;

            $.each(this.items(), function(i, widget) {
                var widgetData = $(widget).data("widget");

                if (dataItem === widgetData) {
                    kendo.unbind(widget);
                    that._gridstack.removeWidget($(widget));
                    removedWidget = widget;
                    return false;
                }
            });

            return $(removedWidget);
        },
        _renderItem: function(name, title, content, edit, data, commands, popoutOptions) {
            var item      = "";

            item += "<div class='k-dashboard-widget k-state-normal grid-stack-item' data-uid='#:uid#'>";
            item += "    <div class='k-dashboard-widget-content grid-stack-item-content'>";
            item += "        <div class='k-dashboard-widget-header clearfix'>";
            item += "            <span class='pull-left'>";

            if (title && title.template) {
                item += kendo.template($("#" + title.template).html())(data);
            }
            else if (title && title.text) {
                item += title.text;
            }
            else {
                item += name;
            }

            item += "            </span>";
            item += "            <div class='pull-right'>";
            item += "                <span class='k-dashboard-widget-commands'>";

            if (commands || popoutOptions) {
                item += this._renderItemCommands(name, commands, data, content, popoutOptions);
            }

            item += "                    <span class='k-dashboard-widget-command refresh fas fa-sync fa-fw' title='Refresh'></span>";
            item += "                </span>";
            item += "                <span class='k-dashboard-widget-command remove fas fa-times-circle fa-fw' title='Remove'></span>";
            item += "            </div>";
            item += "        </div>";
            item += "        <div class='k-dashboard-widget-body'>";
            item += "            <div class='k-state-normal'>";
 
            if (content && content.template) {
                item += kendo.template($("#" + content.template).html() || "")(data);
            }

            item += "            </div>";
                                 
            item += "            <div class='k-state-failed'>";
            item +=                  this.widgetFailedTemplate(data);
            item += "            </div>";
                                 
            item += "            <div class='k-state-misconfigured'>";
            item +=                  this.widgetMisconfiguredTemplate(data);
            item += "            </div>";

            if (edit && edit.template) {
                item += "        <div class='k-state-edit'>";
                item += "            <h3>Widget Options</h3>";
                item +=              kendo.template($("#" + edit.template).html())(data);
                item += "        </div>";
            }

            item += "        </div>";
            item += "    </div>";
            item += "</div>";

            return kendo.template(item)(data);
        },
        _renderItemCommand: function (command) {
            var that = this;
            var item = $("<span class='k-dashboard-widget-command'></span>");

            if (command.click) {
                item.attr("data-bind", kendo.format("click: {0}", command.click));
            }
            
            if (command.iconClass) {
                item.addClass(command.iconClass);
            }
            
            if (command.title) {
                item.attr("title", command.title);
            }

            return item[0].outerHTML;
        },
        _renderItemCommands: function (name, commands, dataItem, content, popoutOptions) {
            var that = this;
            var html = "";

            if (popoutOptions) {
                if (!content.template) {
                    throw kendo.format("Popout options are not supported for widget {0} with ajax content.", name);
                }

                html += that._renderItemCommand({
                    title: "Popout",
                    iconClass: "expand fas fa-expand-alt fa-fw"
                });
            }

            $.each(commands, function (i, command) {
                html += that._renderItemCommand(command, dataItem);
            });

            return html;
        },
        _renderAjax: function(dataItem, widget, uri) {
            var that = this;
            var body = $(widget).find(".k-dashboard-widget-body .k-state-normal");

            kendo.ui.progress($(body), true);

            var promise = $.Deferred();
            var get = $.get({
                url: uri,
                cache: false,
                success: function(e) {
                    that.template = e;
                
                    var html    = that.template;
                    var content = $(html);
                
                    body.html(content);

                    that.setWidgetState(dataItem, "normal");

                    promise.resolve(widget);
                }
            });  

            get.fail(function(e) {
                kendo.ui.progress($(body), false);
                that.setWidgetState(dataItem, "error", e.responseText);
            });

            return promise.promise();
        },
        _widgetList: function() {
            var options = this.options;

            this.widgetList = options.widgetList || [];
        }
    });

    kendo.ui.plugin(Dashboard);

    $.fn.extend({
        Dashboard: function (options) {
            this.kendoDashboard(options);
        }
    });
})(window.kendo.jQuery, window.kendo);