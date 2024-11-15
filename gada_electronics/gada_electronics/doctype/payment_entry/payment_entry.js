frappe.ui.form.on("Payment Entry", {
	// When Party Type changes, adjust the link field for Party
	party_type: function (frm) {
		if (frm.doc.party_type === "Customer") {
			frm.set_value("party", null);
			frm.fields_dict.party.get_query = function () {
				return { filters: { party_type: "Customer" } };
			};
		} else if (frm.doc.party_type === "Supplier") {
			frm.set_value("party", null);
			frm.fields_dict.party.get_query = function () {
				return { filters: { party_type: "Supplier" } };
			};
		}
		frm.refresh_field("party");
	},
});
