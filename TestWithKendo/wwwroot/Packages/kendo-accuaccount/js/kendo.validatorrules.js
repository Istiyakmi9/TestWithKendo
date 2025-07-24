var KendoValidatorRules = undefined;

(function () {
    var dateParseFormats = ["MM/dd/yyyy", "MM-dd-yyyy", "MM/dd/yy", "MM-dd-yy", "M/d/yy", "M-d-yy"];

    var ValidatorRules = kendo.Class.extend({
        date: function (e) {
            if (!e.is("[data-type=date]")) {
                return true;
            }

            if (!e.attr("required") && !e.val()) {
                return true;
            }
    
            var currentDate = kendo.parseDate(e.val(), dateParseFormats);
    
            if (!currentDate) {
                return false;
            }
    
            return true;
        },
        mindate: function (e) {
            if (!e.is("[data-type=date]")) {
                return true;
            }

            if (!e.attr("required") && !e.val()) {
                return true;
            }

            var currentDate = kendo.parseDate(e.val(), dateParseFormats);
            var minDate = kendo.parseDate("1/1/1753", dateParseFormats);
    
            if (currentDate && currentDate < minDate) {
                return false;
            }
    
            return true;
        },
        maxdate: function (e) {
            if (!e.is("[data-type=date]")) {
                return true;
            }

            if (!e.attr("required") && !e.val()) {
                return true;
            }

            var currentDate = kendo.parseDate(e.val(), dateParseFormats);
            var maxDate = kendo.parseDate("12/31/9999", dateParseFormats);

            if (currentDate && currentDate > maxDate) {
                return false;
            }
    
            return true;
        }
    });

    KendoValidatorRules = new ValidatorRules();
})();