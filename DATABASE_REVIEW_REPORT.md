# CEPA e-Permitting System - Database Review Report

**Review Date:** December 31, 2024  
**Total Tables:** 53  
**Database:** Supabase (PostgreSQL)

---

## Executive Summary

The database is **generally well-structured** for a permit management system, with proper relationships between core entities. However, there are several issues that need attention:

1. **Duplicate/Redundant Tables** - Some tables serve overlapping purposes
2. **Unused Tables** - Several tables have 0 records and no code references
3. **Missing Foreign Key Constraints** - Some relationships are implicit but not enforced
4. **Overly Large Tables** - `permit_applications` has 121 columns (too many)

---

## 📊 Table Usage Summary

### Tables WITH Data (Actively Used)

| Table | Records | Purpose | Status |
|-------|---------|---------|--------|
| `profiles` | 13 | User profiles/roles | ✅ Core |
| `entities` | 13 | Companies/organizations | ✅ Core |
| `prescribed_activities` | 81 | Activity definitions | ✅ Core |
| `activity_fee_mapping` | 160 | Links activities to fees | ✅ Core |
| `fee_structures` | 25 | Fee calculation rules | ✅ Core |
| `intent_registrations` | 10 | Intent to develop submissions | ✅ Core |
| `permit_applications` | 2 | Main permit applications | ✅ Core |
| `invoices` | 4 | Payment invoices | ✅ Core |
| `documents` | 6 | Uploaded documents | ✅ Core |
| `audit_logs` | 193 | Detailed action logging | ✅ Core |
| `audit_log` | 38 | Trigger-based change log | ⚠️ Redundant |
| `manager_notifications` | 25 | Manager alerts | ✅ Active |
| `permit_type_fields` | 34 | Dynamic form fields | ✅ Active |
| `project_aois` | 27 | Map areas of interest | ✅ Active |
| `activity_document_requirements` | 22 | Document rules | ✅ Active |
| `industrial_sectors` | 15 | Industry categories | ✅ Active |
| `document_templates` | 13 | Letter templates | ✅ Active |
| `gis_data` | 5 | Geographic boundaries | ✅ Active |
| `permit_types` | 4 | Permit categories | ✅ Active |
| `fee_calculation_methods` | 4 | Fee formulas | ✅ Active |
| `required_documents` | 4 | Base document list | ✅ Active |
| `activity_levels` | 3 | Level 1/2/3 definitions | ✅ Active |
| `base_document_requirements` | 3 | Core document rules | ✅ Active |
| `notifications` | 3 | User notifications | ✅ Active |
| `intent_registration_drafts` | 2 | Saved drafts | ✅ Active |
| `inspections` | 1 | Site inspections | ✅ Active |
| `compliance_tasks` | 1 | Compliance work items | ✅ Active |
| `revenue_item_codes` | 1 | Revenue codes | ✅ Active |

### Tables WITHOUT Data (Empty but Used in Code)

| Table | Records | Used in Code? | Status |
|-------|---------|---------------|--------|
| `financial_transactions` | 0 | ✅ Yes (9 files) | ✅ Keep - Ready for use |
| `permit_activities` | 0 | ✅ Yes (7 files) | ✅ Keep - Ready for use |
| `compliance_assessments` | 0 | ✅ Yes | ✅ Keep - Ready for use |
| `compliance_reports` | 0 | ✅ Yes | ✅ Keep - Ready for use |
| `fee_payments` | 0 | ✅ Yes | ✅ Keep - Ready for use |
| `application_required_docs` | 0 | ✅ Yes | ✅ Keep - Ready for use |
| `directorate_approvals` | 0 | ✅ Yes | ✅ Keep - Ready for use |
| `directorate_notifications` | 0 | ✅ Yes | ✅ Keep - Ready for use |
| `director_approvals` | 0 | ✅ Yes | ✅ Keep - Ready for use |
| `approval_stages` | 0 | ✅ Yes | ✅ Keep - Ready for use |
| `application_workflow_state` | 0 | ✅ Yes | ✅ Keep - Ready for use |
| `permit_amendments` | 0 | ✅ Yes | ✅ Keep - Ready for use |
| `permit_renewals` | 0 | ✅ Yes | ✅ Keep - Ready for use |
| `permit_transfers` | 0 | ✅ Yes | ✅ Keep - Ready for use |
| `permit_surrenders` | 0 | ✅ Yes | ✅ Keep - Ready for use |
| `permit_amalgamations` | 0 | ✅ Yes | ✅ Keep - Ready for use |
| `registry_tasks` | 0 | ✅ Yes | ✅ Keep - Ready for use |
| `revenue_tasks` | 0 | ✅ Yes | ✅ Keep - Ready for use |
| `fee_calculation_audit` | 0 | ✅ Yes | ✅ Keep - Ready for use |
| `registry_audit_trail` | 0 | ✅ Yes | ✅ Keep - Ready for use |
| `system_metrics` | 0 | ✅ Yes | ✅ Keep - Ready for use |

### ⚠️ Tables That MAY BE Safely Deleted

| Table | Records | Used in Code? | Recommendation |
|-------|---------|---------------|----------------|
| `activity_document_mapping` | 0 | ❌ Only in types.ts | 🗑️ **Can Delete** - Superseded by `activity_document_requirements` |
| `unified_notifications` | 0 | ❌ Only in types.ts | 🗑️ **Can Delete** - Not used, overlaps with existing notification tables |
| `workflow_fees` | 0 | ❌ Only in types.ts | 🗑️ **Can Delete** - Not used, `invoices` table handles fees |
| `workflow_transitions` | 0 | ❌ Only in types.ts | 🗑️ **Can Delete** - Not used, `approval_stages` tracks workflow |

### ⚠️ Redundant Tables (Duplicates)

| Table Pair | Issue | Recommendation |
|------------|-------|----------------|
| `audit_log` + `audit_logs` | Both log actions, different structure | ⚠️ Consider merging - keep `audit_logs` (more detailed) |

---

## 🔗 Relationship Analysis

### Core Relationships (Properly Structured)

```
profiles (users)
    ↓
entities (companies) ─────────────────────────────┐
    ↓                                              │
intent_registrations ──→ prescribed_activities    │
    ↓                                              │
permit_applications ←─────────────────────────────┘
    ↓
├── invoices
├── documents  
├── inspections
├── compliance_assessments
├── permit_amendments/renewals/transfers/surrenders
└── application_workflow_state
         ↓
    approval_stages
```

### Fee Structure Relationships (Properly Structured)

```
prescribed_activities
    ↓
activity_fee_mapping
    ↓
fee_structures ──→ fee_calculation_methods
```

### Missing/Weak Relationships

| Issue | Tables Affected | Impact |
|-------|-----------------|--------|
| No FK on `permit_applications.activity_id` | `permit_applications` → `prescribed_activities` | Data integrity risk |
| No FK on `invoices.permit_id` | `invoices` → `permit_applications` | Already exists ✅ |

---

## 🚨 Issues Found

### 1. **`permit_applications` Table is Too Large (121 Columns)**

This table has become a "god table" with too many responsibilities:
- Basic application info
- All permit type-specific fields (air, water, waste, mining, etc.)
- Location data
- Status tracking
- Fee information

**Recommendation:** Consider breaking into:
- `permit_applications` (core fields only)
- `permit_application_details` (type-specific JSON or separate tables)
- `permit_locations` (geographic data)

### 2. **Duplicate Audit Tables**

- `audit_log` - Appears to be trigger-based (38 records)
- `audit_logs` - Application-level logging (193 records)

**Recommendation:** Keep `audit_logs`, remove `audit_log` trigger or merge.

### 3. **Multiple Notification Tables**

- `notifications` - General user notifications
- `manager_notifications` - Manager-specific
- `directorate_notifications` - Directorate-specific
- `unified_notifications` - Not used

**Recommendation:** These are actually properly separated by role. Delete `unified_notifications`.

### 4. **Unused Workflow Tables**

- `workflow_fees` - Not implemented
- `workflow_transitions` - Not implemented

**Recommendation:** Delete if the current `approval_stages` approach is sufficient.

---

## ✅ What's Working Well

1. **User/Role Management** - `profiles` table properly tracks user types and staff positions
2. **Entity Management** - Clean separation of users and their organizations
3. **Fee Calculation** - Well-designed `fee_structures` + `activity_fee_mapping` system
4. **Document Requirements** - `activity_document_requirements` properly links to activities
5. **GIS Data** - `gis_data` and `project_aois` properly store geographic information
6. **Audit Trail** - `audit_logs` captures all important actions

---

## 📋 Action Items

### Safe to Delete Now
These tables can be safely deleted with no code impact:

```sql
-- Tables not used anywhere in the application
DROP TABLE IF EXISTS activity_document_mapping;
DROP TABLE IF EXISTS unified_notifications;
DROP TABLE IF EXISTS workflow_fees;
DROP TABLE IF EXISTS workflow_transitions;
```

### Requires Code Changes First
- `audit_log` - Remove the trigger first, then delete the table

### Consider for Future
- Refactor `permit_applications` into smaller tables
- Merge notification tables if they become hard to maintain

---

## Summary

| Category | Count |
|----------|-------|
| Total Tables | 53 |
| Actively Used | 28 |
| Ready for Future Use | 21 |
| **Safe to Delete** | **4** |
| Redundant (needs review) | 1 |

**Overall Assessment:** The database is **80% well-structured**. The main concerns are the oversized `permit_applications` table and 4-5 unused tables that can be cleaned up.
