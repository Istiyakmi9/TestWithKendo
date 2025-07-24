(function ($, kendo) {
    var ConfiguredDatePicker = kendo.ui.DatePicker.extend({
        init: function (element, options) {
            kendo.ui.DatePicker.fn.init.call(this, element, {
                culture: "en-US",
                format: "MM/dd/yyyy",
                parseFormats: ["MM-dd-yyyy", "MM/dd/yy", "MM-dd-yy", "M/d/yy", "M-d-yy"],
                min: "1/1/1753",
                max: "12/31/9999"
            });

            kendo.ui.DatePicker.fn.setOptions.call(this, options);
        },
        options: {
            name: "ConfiguredDatePicker"
        }
    });

    kendo.ui.plugin(ConfiguredDatePicker);

    $.fn.extend({
        ConfiguredDatePicker: function (options) {
            this.kendoConfiguredDatePicker(options);
        }
	});
})(window.jQuery, window.kendo);