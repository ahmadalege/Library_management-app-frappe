import frappe

def make_gl_entries(doc, method):
    gl_entries = []
    
    if doc.doctype == "Sales Invoice" or doc.doctype == "Purchase Invoice":
        # Logic for Sales Invoice and Purchase Invoice (same as before)
        for item in doc.items:
            gl_entries.append({
                "posting_date": doc.posting_date,
                "account": doc.debit_to if doc.doctype == "Sales Invoice" else doc.credit_to,
                "party": doc.customer if doc.doctype == "Sales Invoice" else doc.supplier,
                "debit": item.amount if doc.doctype == "Sales Invoice" else 0,
                "credit": item.amount if doc.doctype == "Purchase Invoice" else 0,
                "voucher_type": doc.doctype,
                "voucher_number": doc.name,
                "is_cancelled": 0
            })
    
    elif doc.doctype == "Payment Entry":
        # Logic for Payment Entry
        gl_entries.append({
            "posting_date": doc.posting_date,
            "account": doc.account_paid_from,
            "party": doc.party,
            "debit": doc.amount if doc.payment_type == "Receive" else 0,
            "credit": doc.amount if doc.payment_type == "Pay" else 0,
            "voucher_type": doc.doctype,
            "voucher_number": doc.name,
            "is_cancelled": 0
        })
    
    elif doc.doctype == "Journal Entry":
        # Logic for Journal Entry
        for entry in doc.accounts:
            gl_entries.append({
                "posting_date": doc.posting_date,
                "account": entry.account,
                "party": entry.party,
                "debit": entry.debit,
                "credit": entry.credit,
                "voucher_type": doc.doctype,
                "voucher_number": doc.name,
                "is_cancelled": 0,
                "description": entry.description
            })
    
    # Insert each GL Entry individually
    for entry in gl_entries:
        frappe.get_doc({
            "doctype": "GL Entry",
            **entry
        }).insert(ignore_permissions=True)

def cancel_gl_entries(doc, method):
    # Cancel related GL Entries when the document is canceled
    frappe.db.sql("""
        UPDATE `tabGL Entry`
        SET is_cancelled = 1
        WHERE voucher_type = %s AND voucher_number = %s
    """, (doc.doctype, doc.name))
    frappe.db.commit()
