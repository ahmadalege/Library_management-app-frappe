// Copyright (c) 2024, me and contributors
// For license information, please see license.txt

frappe.ui.form.on("Purchase Invoice", {
	//When the from is loaded or refreshed, calculate the totals
	onload: function (frm) {
		calculate_totals(frm);
	},

	refresh: function (frm) {
		calculate_totals(frm);
	},

	//Trigger calculations when an item is added or removed from th eitems table
	items_add: function (frm) {
		calculate_totals(frm);
	},

	items_remove: function (frm) {
		calculate_totals(frm);
	},

	//Trigger recalculation when quantity or rate changes in the items grid
	items: {
		quantity: function (frm, cdt, cdn) {
			calculate_totals(frm);
		},
		rate: function (frm, cdt, cdn) {
			calculate_totals(frm);
		},
	},
});

//Function to calculate totals (Quantity * Rate) for Purchase Invoice
function calculate_totals(frm) {
	let total_quantity = 0,
		total_amount = 0;

	//Loop through each item and calculate the totals
	frm.doc.items.forEach(function (row) {
		//Ensure we calculate the amount if it is not already calculated
		row.amount = (row.quantity || 0) * (row.rate || 0);

		//sum up the quantities and amounts
		total_quantity += row.quantity || 0;
		total_amount += row.amount || 0;
	});

	//Set the total quantity and total amount in the frorm fields
	frm.set_value("total_quantity", total_quantity);
	frm.set_value("total_amount", total_amount);

	//Refresh the fields in the form
	frm.refresh_fields();
}
