// Copyright (c) 2024, me and contributors
// For license information, please see license.txt

frappe.ui.form.on("Sales Invoice", {
	// When the form is loaded or refreshed, calculate the totals
	onload: function (frm) {
		calculate_totals(frm);
	},

	refresh: function (frm) {
		calculate_totals(frm);
	},

	// Trigger calculation when an item is added or removed in the items table
	items_add: function (frm) {
		calculate_totals(frm);
	},

	items_remove: function (frm) {
		calculate_totals(frm);
	},

	// Trigger recalculation when quantity or rate changes in the items grid
	items: {
		quantity: function (frm, cdt, cdn) {
			calculate_totals(frm);
		},
		rate: function (frm, cdt, cdn) {
			calculate_totals(frm);
		},
	},
});

// Function to calculate totals (Quantity * Rate) for Sales Invoice
function calculate_totals(frm) {
	let total_quantity = 0;
	let total_amount = 0;

	// Loop through each item and calculate the totals
	frm.doc.items.forEach(function (row) {
		// Ensure we calculate amount if it is not already calculated
		row.amount = (row.quantity || 0) * (row.rate || 0);

		// Sum up the quantities and amounts
		total_quantity += row.quantity || 0;
		total_amount += row.amount || 0;
	});

	// Set the total quantity and total amount in the form fields
	frm.set_value("total_quantity", total_quantity);
	frm.set_value("total_amount", total_amount);

	// Refresh the fields in the form
	frm.refresh_fields();
}
