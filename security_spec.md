# Security Specification: Gilgit-Baltistan Mountain Store

## 1. Data Invariants

- **Users**: A user document at `/users/{userId}` can only be created by an authenticated user matching `request.auth.uid == userId`. Role escalation to `admin` is blocked unless the user matches the verified root admin email (`ibrargd44@gmail.com`). Normal customers cannot alter their role.
- **Categories & Subcategories**: Only verified administrators can create, update, or delete categories and subcategories. Public storefront users have read-only access.
- **Products**: Only administrators can create, update, change prices, change inventory/stock, or delete products. Public customers can read products only if `active == true`, preventing drafts and deactivated items from leaking.
- **Orders**: Customers can only create orders where `customerId == request.auth.uid`. Customers can only read orders where `customerId == request.auth.uid`. Customers are strictly forbidden from modifying or deleting existing orders. Only administrators can view all orders and update `status`.
- **Settings & Banners**: Storefront settings and promotional banners are publicly readable, but write access is exclusively reserved for administrators.

## 2. The "Dirty Dozen" Payloads

1. **Unauthorized Product Price Modification**: An unauthenticated user attempts an update on `/products/p1` changing `price` from 1500 to 1. Expected: PERMISSION_DENIED.
2. **Customer Role Escalation**: A customer attempts to update `/users/{uid}` with `{ "role": "admin" }`. Expected: PERMISSION_DENIED.
3. **Cross-Customer Order Inspection**: Customer A (`uid_A`) attempts to read `/orders/order_B` belonging to Customer B. Expected: PERMISSION_DENIED.
4. **Order Status Manipulation**: Customer attempts to update `/orders/order_1` setting `status: "Delivered"` or clearing `total`. Expected: PERMISSION_DENIED.
5. **Malicious Category Deletion**: Non-admin attempts `DELETE` on `/categories/dry-fruits`. Expected: PERMISSION_DENIED.
6. **Inactive Product Scraping**: Unauthenticated user queries `/products` where `active == false`. Expected: PERMISSION_DENIED.
7. **Store Settings Tampering**: Non-admin attempts to overwrite `/settings/main` with fake bank account details or delivery fee. Expected: PERMISSION_DENIED.
8. **Banner Injection**: Non-admin attempts to create a phishing banner in `/banners`. Expected: PERMISSION_DENIED.
9. **Fake Order Customer ID Injection**: Authenticated user (`uid_A`) submits an order with `customerId: "uid_B"`. Expected: PERMISSION_DENIED.
10. **Product Creation by Customer**: Customer attempts to inject a spam product into `/products`. Expected: PERMISSION_DENIED.
11. **Subcategory Hijacking**: Non-admin modifies `categoryId` on a subcategory. Expected: PERMISSION_DENIED.
12. **PII Extraction on Users**: Authenticated user attempts a blanket read on `/users` collection without admin rights. Expected: PERMISSION_DENIED.
