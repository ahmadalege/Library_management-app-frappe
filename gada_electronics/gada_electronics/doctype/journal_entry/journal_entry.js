// Copyright (c) 2024, me and contributors
// For license information, please see license.txt

frappe.ui.form.on("Journal Entry", {
	// When the form is loaded, we calculate the totals and difference
	onload: function (frm) {
		calculate_totals(frm);
	},

	// When a row in the accounting entries table is added or changed, recalculate totals
	accounting_entries_on_form_rendered: function (frm) {
		frm.fields_dict["accounts"].grid.get_field("debit").$input.on("change", function () {
			calculate_totals(frm);
		});

		frm.fields_dict["accounts"].grid.get_field("credit").$input.on("change", function () {
			calculate_totals(frm);
		});
	},

	// Trigger when an Accounting Entry is updated
	refresh: function (frm) {
		// Instead of using grid.on, use field-level change listeners.
		frm.fields_dict["accounts"].grid.get_field("debit").$input.on("change", function () {
			calculate_totals(frm);
		});

		frm.fields_dict["accounts"].grid.get_field("credit").$input.on("change", function () {
			calculate_totals(frm);
		});
	},
});

// Function to calculate the totals and the difference (Debit - Credit)
function calculate_totals(frm) {
	let total_debit = 0;
	let total_credit = 0;

	// Loop through all the accounting entries and sum up debits and credits
	$.each(frm.doc.accounts || [], function (i, row) {
		total_debit += row.debit || 0;
		total_credit += row.credit || 0;
	});

	// Set the values for Total Debit and Total Credit
	frm.set_value("total_debit", total_debit);
	frm.set_value("total_credit", total_credit);

	// Set the difference (Debit - Credit)
	let difference = total_debit - total_credit;
	frm.set_value("difference", difference);
}
