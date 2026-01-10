# Button Migration Quick Reference Script

## How to Use This Guide

For each file, follow these steps:
1. Add Button import at top (if not already present)
2. Find all `<button` elements using grep or search
3. Replace each button following the patterns below
4. Test the page functionality
5. Mark file as complete in STATUS.md

## 🔍 Quick Search Commands

```bash
# Find all files with button elements
grep -r "<button" src/pages/**/*.tsx

# Count buttons in a specific file
grep -c "<button" src/pages/hr/KPIList.tsx

# Find buttons in a specific folder
grep -r "<button" src/pages/manager/*.tsx
```

## 📋 Step-by-Step Migration Pattern

### Step 1: Add Imports (if needed)

```typescript
// At the top of the file, add or update:
import { Button } from '../../components/common';  // Adjust path as needed
import { FiSave, FiTrash2, FiEye, FiEdit, FiPlus, FiX } from 'react-icons/fi';
```

### Step 2: Identify Button Type

Look at the button's className to determine the variant:

| Original className Pattern | Button Variant | Example |
|---------------------------|----------------|---------|
| `bg-purple-600`, `bg-blue-600` | `primary` | Action buttons |
| `bg-green-600` | `success` | Save, Confirm |
| `bg-red-600` | `danger` | Delete, Cancel |
| `bg-gray-600`, `bg-gray-200` | `secondary` | Secondary actions |
| `text-purple-600`, `hover:underline` | `link` | Text links |
| `text-gray-600`, `hover:bg-gray-100` | `ghost` | Icon buttons |

### Step 3: Apply Replacement

## 📝 Common Patterns with Examples

### Pattern A: Simple Submit/Action Button

**Before:**
```typescript
<button
  onClick={handleSubmit}
  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
>
  Submit
</button>
```

**After:**
```typescript
<Button variant="primary" onClick={handleSubmit}>
  Submit
</Button>
```

---

### Pattern B: Button with Icon

**Before:**
```typescript
<button
  onClick={handleSave}
  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
>
  <FiSave className="text-lg" />
  <span>Save</span>
</button>
```

**After:**
```typescript
<Button variant="success" icon={FiSave} onClick={handleSave}>
  Save
</Button>
```

---

### Pattern C: Delete/Danger Button

**Before:**
```typescript
<button
  onClick={handleDelete}
  className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
>
  <FiTrash2 className="mr-2" />
  Delete
</button>
```

**After:**
```typescript
<Button 
  variant="danger" 
  icon={FiTrash2} 
  size="sm"
  onClick={handleDelete}
>
  Delete
</Button>
```

---

### Pattern D: Icon-Only Button

**Before:**
```typescript
<button
  onClick={handleView}
  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
>
  <FiEye className="text-lg" />
</button>
```

**After:**
```typescript
<Button 
  variant="ghost" 
  icon={FiEye} 
  rounded 
  onClick={handleView}
  aria-label="View"
/>
```

---

### Pattern E: Link-Style Button

**Before:**
```typescript
<button
  onClick={handleView}
  className="text-purple-600 hover:text-purple-700 hover:underline font-medium text-sm"
>
  View Details
</button>
```

**After:**
```typescript
<Button 
  variant="link" 
  size="sm"
  onClick={handleView}
>
  View Details
</Button>
```

---

### Pattern F: Secondary/Cancel Button

**Before:**
```typescript
<button
  onClick={handleCancel}
  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
>
  Cancel
</button>
```

**After:**
```typescript
<Button variant="secondary" onClick={handleCancel}>
  Cancel
</Button>
```

---

### Pattern G: Loading State Button

**Before:**
```typescript
<button
  onClick={handleSave}
  disabled={saving}
  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300"
>
  {saving ? 'Saving...' : 'Save'}
</button>
```

**After:**
```typescript
<Button 
  variant="primary" 
  onClick={handleSave}
  loading={saving}
>
  Save
</Button>
```

---

### Pattern H: Full Width Button

**Before:**
```typescript
<button
  onClick={handleContinue}
  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
>
  Continue
</button>
```

**After:**
```typescript
<Button 
  variant="primary" 
  onClick={handleContinue}
  fullWidth
>
  Continue
</Button>
```

---

### Pattern I: Small Size Button

**Before:**
```typescript
<button
  onClick={handleEdit}
  className="px-3 py-1 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700"
>
  Edit
</button>
```

**After:**
```typescript
<Button 
  variant="primary" 
  size="sm"
  onClick={handleEdit}
>
  Edit
</Button>
```

---

### Pattern J: Conditional Variant (Toggle/Filter)

**Before:**
```typescript
<button
  onClick={() => setFilter('active')}
  className={`px-4 py-2 rounded-lg ${
    filter === 'active' 
      ? 'bg-purple-600 text-white' 
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }`}
>
  Active
</button>
```

**After:**
```typescript
<Button 
  variant={filter === 'active' ? 'primary' : 'secondary'}
  onClick={() => setFilter('active')}
>
  Active
</Button>
```

---

### Pattern K: Disabled Button

**Before:**
```typescript
<button
  onClick={handleSubmit}
  disabled={!isValid}
  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
>
  Submit
</button>
```

**After:**
```typescript
<Button 
  variant="primary" 
  onClick={handleSubmit}
  disabled={!isValid}
>
  Submit
</Button>
```

---

### Pattern L: Button with Right Icon

**Before:**
```typescript
<button
  onClick={handleNext}
  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg"
>
  <span>Next</span>
  <FiArrowRight />
</button>
```

**After:**
```typescript
<Button 
  variant="primary" 
  icon={FiArrowRight}
  iconPosition="right"
  onClick={handleNext}
>
  Next
</Button>
```

---

## 🚫 Buttons to KEEP as Native

### 1. Tab Navigation
```typescript
// Keep this as-is (complex border-bottom styling)
<button
  className={`py-4 px-1 border-b-2 font-medium text-sm ${
    activeTab === 'tab1'
      ? 'border-purple-500 text-purple-600'
      : 'border-transparent text-gray-500 hover:text-gray-700'
  }`}
  onClick={() => setActiveTab('tab1')}
>
  Tab 1
</button>
```

### 2. Status/Category Cards with Complex Hover States
```typescript
// Keep this as-is (complex color combinations and hover effects)
<button
  className={`p-4 rounded-lg border-2 transition-all text-left ${getCategoryColor(category)} border-current ${
    count === 0 ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
  }`}
  onClick={() => handleClick(category)}
>
  {/* Complex card content */}
</button>
```

### 3. Custom Dashed Border Quick Actions
```typescript
// Keep this as-is (custom dashed border styling)
<button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left">
  {/* Card content */}
</button>
```

---

## 🎯 File-by-File Checklist

Use this to track your progress:

### Manager Pages
- [ ] src/pages/manager/KPISetting.tsx (~15 buttons)
- [ ] src/pages/manager/KPIReview.tsx (~12 buttons)
- [ ] src/pages/manager/KPIDetails.tsx (~10 buttons)
- [ ] src/pages/manager/KPITemplates.tsx (~6 buttons)
- [ ] src/pages/manager/KPITemplateForm.tsx (~5 buttons)
- [ ] src/pages/manager/ApplyKPITemplate.tsx (~4 buttons)
- [ ] src/pages/manager/EmployeeSelection.tsx (~9 buttons)
- [ ] src/pages/manager/ReviewsList.tsx (~6 buttons)
- [ ] src/pages/manager/MeetingScheduler.tsx (~3 buttons)

### Employee Pages
- [ ] src/pages/employee/SelfRating.tsx (~12 buttons)
- [ ] src/pages/employee/KPIConfirmation.tsx (~8 buttons)
- [ ] src/pages/employee/KPIAcknowledgement.tsx (~7 buttons)
- [ ] src/pages/employee/KPIDetails.tsx (~5 buttons)
- [ ] src/pages/employee/KPIList.tsx (~2 buttons)
- [ ] src/pages/employee/Reviews.tsx (~1 button)

### HR Pages
- [ ] src/pages/hr/KPIList.tsx (~10 buttons)
- [ ] src/pages/hr/KPIDetails.tsx (~15 buttons)
- [ ] src/pages/hr/EmailTemplates.tsx (~15 buttons)
- [ ] src/pages/hr/RejectedKPIManagement.tsx (~5 buttons)

### Shared Pages
- [ ] src/pages/shared/Employees.tsx (~15 buttons)
- [ ] src/pages/shared/Profile.tsx (~10 buttons)
- [ ] src/pages/shared/EditProfile.tsx (~8 buttons)
- [ ] src/pages/shared/CompletedReviews.tsx (~6 buttons)
- [ ] src/pages/shared/KPISettingCompleted.tsx (~4 buttons)
- [ ] src/pages/shared/AcknowledgedKPIs.tsx (~4 buttons)
- [ ] src/pages/shared/Notifications.tsx (~3 buttons)

### SuperAdmin Pages
- [ ] src/pages/superadmin/UserManagement.tsx (~20 buttons)
- [ ] src/pages/superadmin/SuperAdminDashboard.tsx (~5 buttons)
- [ ] src/pages/superadmin/CompanyManagement.tsx (~6 buttons)
- [ ] src/pages/superadmin/AssignHrToCompany.tsx (~4 buttons)

### Other
- [ ] src/pages/CompanyOnboarding.tsx (~15 buttons)
- [ ] src/pages/CompanySelection.tsx (~2 buttons)
- [ ] src/components/PasswordChangeModal.tsx (~4 buttons)
- [ ] src/components/SignatureField.tsx (~3 buttons)
- [ ] src/components/TextModal.tsx (~3 buttons)

---

## ⚡ Quick Tips

1. **Use Multi-Replace**: If a file has multiple similar buttons, use the multi_replace_string_in_file tool
2. **Check Imports**: Make sure icon imports are added if using icons
3. **Preserve Logic**: Keep all onClick handlers, disabled states, and conditional rendering
4. **Test Immediately**: After migrating a file, test the page to ensure functionality
5. **Watch for Sizes**: `px-3 py-1` → `size="sm"`, `px-4 py-2` → default/`size="md"`

## 🔧 Troubleshooting

### Issue: Button too big/small
**Solution**: Add `size` prop: `size="xs|sm|md|lg|xl"`

### Issue: Icon not showing
**Solution**: Check icon is imported: `import { FiIconName } from 'react-icons/fi'`

### Issue: Button full width when it shouldn't be
**Solution**: Button is inline by default. Check for `fullWidth` prop

### Issue: Loading state not working
**Solution**: Use `loading={state}` not `disabled={state}`

### Issue: Custom colors needed
**Solution**: Use `className` prop to add custom Tailwind classes

---

## 📈 Progress Tracking

After migrating each file, update the STATUS.md file with:
- File path
- Number of buttons migrated
- Any special notes or issues
- Checmark the file in the checklist above

---

**Remember**: The goal is consistency and maintainability. Every button migrated makes the codebase better! 🚀

