let KendoGridHelper = undefined;

(function() {
    KendoGridHelper = kendo.Class.extend({
        init: function (element) {
            
        },
        multiCheckFilter: {
            sort: function(grid, field, direction) {
                let header      = grid.thead.find("[data-field=" + field + "]");
                let multiCheck  = header.data("kendoFilterMultiCheck");
                let checkSource = multiCheck.checkSource;
                
                multiCheck.container.empty();
                
                checkSource.sort({field: field, dir: direction});
                checkSource.data(checkSource.view().toJSON());
                
                multiCheck.createCheckBoxes();
            }
        }
    });
})();