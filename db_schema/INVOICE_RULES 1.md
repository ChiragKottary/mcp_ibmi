# Business Logic for Invoice Creation

This document outlines the business rules that govern the creation of invoices from sales orders, based on an analysis of the RPG programs `FO602R` and `FO603R`. The primary focus is on the conditions that will **block** an order from being selected for invoicing.

The core logic for selecting orders is contained within the `oppord` subroutine in `FO602R` and `oppord9` in `FO603R`. An order must pass all the following checks to be processed.

## Order Status and Header Rules

1.  **Order Already Being Processed**
    *   **Logic:** An order is skipped if it is already flagged as being under treatment.
    *   **File:** `FOHELF` (Order Header File)
    *   **Field:** `FOKODE`
    *   **Condition:** The process will not select an order if `FOKODE` is not equal to `*ZERO`. This indicates the order is locked by another process.

2.  **Incorrect Order Type**
    *   **Logic:** The order's type must match the type selected by the user for the batch job.
    *   **File:** `FOHELF` (Order Header File)
    *   **Field:** `FOOTYP`
    *   **Condition:** The order's `FOOTYP` must match the `d0foty` (in `FO602R`) or be present in the `oty` array (in `FO603R`) of selected order types.

3.  **Order Has No Lines**
    *   **Logic:** An order cannot be invoiced if it contains no order lines. These empty orders are automatically deleted.
    *   **File:** `FODTFP` (Order Detail File)
    *   **Condition:** The system checks if any records exist in `FODTFP` for the given order number (`FONUMM`) and suffix (`FOSUFF`). If no lines are found, the order is deleted via program `FO410R` and skipped.

## Configuration and Authorization Rules

4.  **Invoice Blocking via Info Code**
    *   **Logic:** Orders can be explicitly blocked from invoicing based on a configurable "info code".
    *   **Files:**
        *   `FOHELF` (Order Header File)
        *   `VINF` (Order Info Code File)
    *   **Fields:**
        *   `FOITYP` (from `FOHELF`)
        *   `VAIFAK` (from `VINF`)
    *   **Condition:** If an order has an `FOITYP` value, the system looks up this code in the `VINF` file. If the corresponding `VAIFAK` flag is set to `'1'`, the order is blocked from invoicing. This check is only performed when the batch job is for actual invoicing (`vaoakk = 3`).

5.  **User Authorization**
    *   **Logic:** The user running the batch job must have the necessary permissions to create invoices.
    *   **File:** `FUSER` (User File)
    *   **Field:** `FBKO08`
    *   **Condition:** The system checks the profile of the current user (`l_user`). If the `FBKO08` flag is not `'1'`, the user is not authorized, and the order is skipped. This check is also only performed when the batch job is for invoicing (`vaoakk = 3`).

## Financial and Transactional Rules

6.  **Unpaid Deposit**
    *   **Logic:** Orders that require a deposit cannot be invoiced until the full deposit amount has been paid.
    *   **File:** `SDEPF` (Deposit File)
    *   **Fields:**
        *   `SKDEPO` (Deposit amount required)
        *   `SKDEPB` (Deposit amount paid)
    *   **Condition:** The system checks the `SDEPF` file for the order. If a record exists and the paid amount `SKDEPB` is less than the required amount `SKDEPO`, the order is blocked.

7.  **Alternative Invoicing / Card Transactions**
    *   **Logic:** Orders associated with specific alternative payment methods (like card transactions) are handled by a separate process and are excluded from the standard invoice run.
    *   **File:** `FNTRLF` (Card Transaction File)
    *   **Condition:** The system checks if a record for the order exists in the `FNTRLF` file. If a record is found, the order is skipped. This check is bypassed only when the selection method (`d0svar`) is specifically for this type of transaction (value `5`).

## Special Conditions (Program-Specific)

8.  **Packing Slip Reprinting (`FO602R`)**
    *   **Logic:** Prevents a packing slip that has already been generated from being printed again.
    *   **File:** `FOHELF` (Order Header File)
    *   **Field:** `FOPAKS`
    *   **Condition:** If the `FOPAKS` flag is `'1'` (indicating the packing slip has been created) and the user is running the process to generate packing slips (`vaoakk = 2`), the order is skipped. Note: This check is commented out in the newer `FO603R` program.

9.  **Mixed Order Type Invoicing (`FO603R`)**
    *   **Logic:** The newer `FO603R` program, which allows for combining different order types in one run, enforces consistency among the selected types.
    *   **File:** `VOTYF` (Order Type File)
    *   **Fields:** `VAOOKO` (Affects Stock), `VAOSTA` (Affects Statistics)
    *   **Condition:** The process will fail if the user selects a mix of order types where some affect stock (`VAOOKO = 1`) and others do not, or where some affect statistics (`VAOSTA = 1`) and others do not. All selected "next order types" (`nty`) must be consistent in how they impact stock and statistics.

## Subprogram Calls Affecting Logic

Beyond direct file checks, several external subprograms are called that play a significant role in the workflow.

1.  **`CO402R` (Read General Configuration)**
    *   **Trigger:** Called during the initialization of `FO602R`.
    *   **Logic:** It checks for the system parameter `SAMLEFAKTURERE_DEBET_KREDIT` (Invoice Debit/Credit Together).
    *   **Impact:** This call acts as a **major logical gateway**. If the parameter is active, the system immediately calls `FO603R` to use the newer, combined invoicing workflow. If not, it proceeds with the standard `FO602R` logic.

2.  **`FO410R` (Delete Order)**
    *   **Trigger:** Called from `oppord`/`oppord9` if an order is found to have no detail lines.
    *   **Logic:** This program's purpose is to delete the sales order from the system.
    *   **Impact:** This is a **destructive filtering step**. Instead of merely blocking the order from the current batch, it removes the order permanently. The reason for deletion is logged as "MANGLER VARELINJER" (MISSING ORDER LINES).

3.  **`FO709R` (Log Order Processing)**
    *   **Trigger:** Called from `oppord`/`oppord9` just before the order header (`FOHELF`) is updated to mark it for processing.
    *   **Logic:** This program is likely used for auditing or creating a history log. It records that the specific order is being included in the invoicing run.
    *   **Impact:** This call does not appear to have blocking logic. It is part of the state management, ensuring there is a trace of when the order was processed.

4.  **`FO605R` (Execute Invoicing/Printing)**
    *   **Trigger:** Called from `FO603R` after all orders have been selected and validated.
    *   **Logic:** This program is the next step in the chain. It takes the list of validated orders and begins the actual invoice generation or printing process.
    *   **Impact:** While it doesn't affect the *selection* of orders within `FO603R`, it represents the handoff to the next major business function. Any failures or business rules within `FO605R` would occur *after* the selection process documented here is complete.
