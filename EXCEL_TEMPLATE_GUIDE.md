# Excel Template Guide for Employee Upload

This guide explains the Excel file structure required for bulk employee uploads during company onboarding and in the HR/Manager Employees page.

## File Format
- **Supported formats**: `.xlsx` (Excel 2007+) or `.xls` (Excel 97-2003)
- **Maximum file size**: 10MB
- **First row**: Must contain column headers

## Column Structure

The Excel file must have the following columns (in any order, but these exact column names):

| Column Name | Required | Description | Example |
|------------|----------|-------------|---------|
| **Name** | ✅ Yes | Employee's full name | "John Doe" |
| **Payroll Number** | ✅ Yes | Unique payroll identifier (must be unique per company) | "EMP-2024-001" |
| **National ID** | ✅ Yes | National identification number | "1234567890" |
| **Department** | ❌ No | Department name (must match a department created during onboarding) | "Sales & Marketing" |
| **Position** | ❌ No | Job title/position | "Sales Executive" |
| **Employment Date** | ❌ No | Date of employment (format: YYYY-MM-DD or MM/DD/YYYY) | "2024-01-15" or "01/15/2024" |
| **Manager Email** | ❌ No | Email address of the assigned manager (must match a manager email from onboarding) | "manager@company.com" |

## Column Name Variations

The system accepts these variations for column names (case-insensitive):

- **Name**: `Name`, `name`, `NAME`, `Employee Name`, `Full Name`
- **Payroll Number**: `Payroll Number`, `payroll_number`, `PayrollNumber`, `Payroll #`
- **National ID**: `National ID`, `national_id`, `NationalID`, `National Identification`
- **Department**: `Department`, `department`, `Dept`, `Department Name`
- **Position**: `Position`, `position`, `Job Title`, `Title`
- **Employment Date**: `Employment Date`, `employment_date`, `EmploymentDate`, `Hire Date`, `Start Date`
- **Manager Email**: `Manager Email`, `manager_email`, `ManagerEmail`, `Manager's Email`

## Example Excel File

```
| Name          | Payroll Number | National ID | Department        | Position        | Employment Date | Manager Email          |
|---------------|----------------|-------------|-------------------|-----------------|-----------------|------------------------|
| John Doe      | EMP-2024-001   | 1234567890  | Sales & Marketing | Sales Executive | 2024-01-15      | manager@company.com    |
| Jane Smith    | EMP-2024-002   | 0987654321  | Customer Success | CS Lead         | 2024-02-01      | manager@company.com    |
| Bob Johnson   | EMP-2024-003   | 1122334455  | Engineering       | Developer       | 2024-03-10      |                        |
```

## Important Notes

1. **Required Fields**: Name, Payroll Number, and National ID are mandatory. Rows missing any of these will be skipped.

2. **Duplicate Payroll Numbers**: If a payroll number already exists in the company, that row will be skipped.

3. **Department Matching**: 
   - Department names must exactly match (case-sensitive) the departments created during onboarding
   - If department doesn't match, employee will be created without department assignment
   - Employees can be assigned to departments later through the Employees page

4. **Manager Assignment**:
   - Manager Email must match exactly (case-sensitive) an email from a manager created during onboarding
   - If manager email doesn't match, employee will be created without a manager
   - If department is specified and has a manager assigned, that manager will be automatically assigned
   - Employees can be assigned to managers later through the Employees page

5. **Date Format**: 
   - Preferred: `YYYY-MM-DD` (e.g., 2024-01-15)
   - Also accepted: `MM/DD/YYYY` (e.g., 01/15/2024)
   - Invalid dates will be ignored

6. **Row Processing**:
   - Empty rows are automatically skipped
   - Rows with missing required fields are skipped (with error message)
   - Processing stops on errors, but valid rows before the error are imported

## Upload Locations

### 1. During Company Onboarding
- **Location**: Step 4 of Company Onboarding wizard
- **Access**: Super Admin only
- **Context**: Upload employees while setting up a new company
- **Note**: Departments and managers must be created in Steps 1 and 3 before employees can be assigned to them

### 2. HR/Manager Employees Page
- **Location**: `/employees` or `/hr/employees` or `/manager/employees`
- **Access**: HR, Manager, or Super Admin
- **Context**: Add employees to an existing company
- **Note**: Departments and managers must already exist in the company

## Sample Excel Template

You can create an Excel file with the following structure:

```
Row 1 (Headers):
Name | Payroll Number | National ID | Department | Position | Employment Date | Manager Email

Row 2 (Example):
John Doe | EMP-001 | 123456789 | Sales | Sales Executive | 2024-01-15 | john.manager@company.com

Row 3 (Example):
Jane Smith | EMP-002 | 987654321 | Marketing | Marketing Manager | 2024-02-01 | jane.manager@company.com
```

## Troubleshooting

### Common Issues:

1. **"Excel file is empty"**
   - Ensure the file has at least one data row (besides headers)
   - Check that the file is not corrupted

2. **"Missing required fields"**
   - Verify all rows have Name, Payroll Number, and National ID
   - Check for empty cells in required columns

3. **"Employee already exists"**
   - Payroll number must be unique per company
   - Check for duplicates in your Excel file
   - Verify the employee doesn't already exist in the system

4. **"Department not found"**
   - Department name must exactly match (including spaces and capitalization)
   - Create the department first if it doesn't exist
   - Check for typos in department names

5. **"Manager not assigned"**
   - Manager email must exactly match a manager's email
   - Verify the manager exists in the system
   - Check for typos in email addresses

## Best Practices

1. **Prepare your data**: Clean and validate data before uploading
2. **Use consistent naming**: Keep department names consistent
3. **Verify emails**: Ensure manager emails are correct
4. **Test with small files**: Start with a few rows to test the format
5. **Keep backups**: Save your Excel file before uploading
6. **Review results**: Check the import summary for skipped rows and errors

