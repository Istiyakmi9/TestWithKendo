(function ($, kendo, undefined) {

    kendo.data.ObservableGridColumn = kendo.data.ObservableObject.extend({
       init: function(field) {
           kendo.data.ObservableObject.fn.init.call(this, this);
    
           this.set("field", field);
       },
       expandedField: undefined,
       field: undefined,
       title: undefined,
       hidden: false,
       format: undefined,
       filterable: false,
       template: undefined,
       width: 150
    });

    // One-way binding for kendo.ui.Grid
    // autoBind must be turned off on the grid if this binding is used
    // because it calls setOptions which destroys and recreates the grid,
    kendo.data.binders.widget.grid.columns = kendo.data.Binder.extend({
        init: function (widget, bindings, options) {
            kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);

            this._options();

            this._columnResize  = $.proxy(this.columnResize, this);
            this._columnShow    = $.proxy(this.columnShow, this);
            this._columnHide    = $.proxy(this.columnHide, this);
            this._columnReorder = $.proxy(this.columnReorder, this);
            this._columnChange  = $.proxy(this.columnChange, this);
            
            widget.bind("columnResize", this._columnResize);
            widget.bind("columnShow", this._columnShow);
            widget.bind("columnHide", this._columnHide);
            widget.bind("columnReorder", this._columnReorder);

            this.widget      = widget;
            this._initChange = false;
        },
        change: function (e, action) {
            this._initChange = true;

            var that    = this;
            var grid    = $(that.element).data("kendoGrid");
            var binding = that.bindings["columns"];

            if (binding.source.columns) {                
                switch (action) {
                    case "reorder":
                        if (that.columnFill) {
                            that._moveColumnFill();
                        }
                        break;
                }

                var columns = that._cloneArray(grid.columns);
                
                if (binding.get() instanceof kendo.data.ObservableArray) {
                    columns = new kendo.data.ObservableArray(columns);
                }

                if (action === "reorder") {
                    that._moveArrayItem(columns, e.oldIndex, e.newIndex);
                }

                if (this.columnFill) {
                    that._removeColumnFill(columns);
                }

                binding.source.set("columns", columns);
            }

            this._initChange = false;
        },
        columnChange: function (e) {
            if (e.action === "itemchange") {
                this.change(e);
            }
        },
        columnFill: false,
        columnResize: function (e) {
            this.change(e);
        },
        columnShow: function (e) {
            this.change(e);
        },
        columnHide: function (e) {
            this.change(e);
        },
        columnReorder: function (e) {
            this.change(e, "reorder");
        },
        destroy: function() {
            this.widget.unbind("columnResize", this._columnResize);
            this.widget.unbind("columnShow", this._columnShow);
            this.widget.unbind("columnHide", this._columnHide);
            this.widget.unbind("columnReorder", this._columnReorder);
        },
        refresh: function () {
            if (this._initChange) {
                return;
            }

            var grid         = $(this.element).data("kendoGrid");
            var binding      = this.bindings["columns"];
            var value        = binding.get();
            var columns      = (value instanceof kendo.data.ObservableArray) ? value.toJSON() : value;

            if (this.columnFill) {
                this._addColumnFill(columns);
            }
            
            if (grid._refreshOptions !== undefined && grid._refreshOptions === false) {
                grid._refreshOptions = true;

                grid.setOptions({columns: columns});
                
                grid._refreshOptions = false;
            }

            if (grid._refreshOptions === undefined) {
                grid.setOptions({columns: columns});
                grid._refreshOptions = false;
            }
        },
        _cloneArray: function (arr) {
            var columns = [];

            $.each(arr, function (i, column) {
                columns.push({
                    field: column.field,
                    hidden: column.hidden,
                    template: column.template,
                    filterable: column.filterable,
                    format: column.format,
                    width: column.width,
                    title: column.title
                });
            });

            return columns;
        },
        _moveArrayItem: function(arr, fromIndex, toIndex) {
           var element = arr[fromIndex];
           arr.splice(fromIndex, 1);
           arr.splice(toIndex, 0, element);
        },
        _moveColumnFill: function () {
            var grid  = $(this.element).data("kendoGrid");
            
            var emptyColumn;

            $.each(grid.columns, function (i, column) {
                if (column.field === "") {
                    emptyColumn = column;
                }
            });

            setTimeout(function () {
                grid.reorderColumn(grid.columns.length - 1, emptyColumn);
            }, 0);
        },
        _options: function () {
            this.columnFill = $(this.element).data("columnFill") === true;
        },
        _addColumnFill: function (columns) {            
            // Add empty column to avoid KendoUI Grid column width side effects.
            // See Kendo Reference https://docs.telerik.com/kendo-ui/web/grid/appearance#column-widths
            var lastColumn = new kendo.data.ObservableGridColumn("");
            
            lastColumn.width = undefined;
            
            columns.push(lastColumn.toJSON());
        },
        _removeColumnFill: function (columns) {
            $.each(columns, function (i, column) {
                if (column.field === "") {
                    columns.splice(i, 1);
                    return false;
                }
            });
            return true;
        }
    });
})(window.kendo.jQuery, window.kendo);