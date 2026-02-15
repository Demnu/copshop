# GOV.UK Design System Components

Reusable React components following the official [GOV.UK Design System](https://design-system.service.gov.uk/).

## Installation

The components use the official `govuk-frontend` package:

```bash
npm install govuk-frontend
```

## Components

### GovUKButton

Button component with GOV.UK styling and variants.

```tsx
import { GovUKButton } from '@/components/govuk'

// Primary button (default)
<GovUKButton onClick={handleClick}>Save</GovUKButton>

// Secondary button
<GovUKButton variant="secondary">Cancel</GovUKButton>

// Warning button
<GovUKButton variant="warning">Delete</GovUKButton>

// Submit button
<GovUKButton type="submit" form="my-form">Submit</GovUKButton>
```

### GovUKFormGroup

Form wrapper with label and optional hint text.

```tsx
import { GovUKFormGroup, GovUKInput } from '@/components/govuk'
;<GovUKFormGroup
  label="First name"
  htmlFor="first-name"
  hint="Enter your legal first name"
>
  <GovUKInput id="first-name" name="firstName" />
</GovUKFormGroup>
```

### GovUKInput

Text input with GOV.UK styling and width variants.

```tsx
import { GovUKInput } from '@/components/govuk'

// Full width (default)
<GovUKInput id="name" type="text" value={name} onChange={handleChange} />

// Fixed width
<GovUKInput id="postcode" width="10" />

// Available widths: '2', '3', '4', '5', '10', '20', '30', 'full'
```

### GovUKSelect

Dropdown select with GOV.UK styling. Can be used with options prop or children.

```tsx
import { GovUKSelect } from '@/components/govuk'

// Simple usage with options array
<GovUKSelect
  value={organizationId}
  onChange={handleChange}
  options={[
    { value: 1, label: 'Option 1' },
    { value: 2, label: 'Option 2' },
    { value: 3, label: 'Option 3', disabled: true }
  ]}
  placeholder="Select an option"
/>

// With children for complex rendering (option groups, etc.)
<GovUKSelect value={selected} onChange={handleChange}>
  <option value="">Select an option</option>
  <optgroup label="Group 1">
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
  </optgroup>
</GovUKSelect>
```

### GovUKSummaryList

Key-value pairs in GOV.UK summary list format.

```tsx
import { GovUKSummaryList } from '@/components/govuk'

const rows = [
  { key: 'Name', value: 'John Smith' },
  { key: 'Email', value: 'john@example.com' },
  { key: 'Status', value: <GovUKTag color="green">Active</GovUKTag> },
]

<GovUKSummaryList rows={rows} />
```

### GovUKTag

Status badge/tag with color variants.

```tsx
import { GovUKTag } from '@/components/govuk'

<GovUKTag color="green">Confirmed</GovUKTag>
<GovUKTag color="yellow">Pending</GovUKTag>
<GovUKTag color="red">Rejected</GovUKTag>
<GovUKTag color="grey">Draft</GovUKTag>
<GovUKTag color="blue">New</GovUKTag>

// Available colors: grey, green, red, yellow, blue, purple, pink, orange
```

### GovUKBackLink

Navigation back link with GOV.UK styling.

```tsx
import { GovUKBackLink } from '@/components/govuk'
;<GovUKBackLink href="/previous-page">Back</GovUKBackLink>
```

## Example Usage

```tsx
import {
  GovUKButton,
  GovUKFormGroup,
  GovUKInput,
  GovUKSelect,
  GovUKSummaryList,
  GovUKTag,
} from '@/components/govuk'

function MyForm() {
  return (
    <form>
      <GovUKFormGroup label="Full name" htmlFor="name">
        <GovUKInput id="name" name="name" />
      </GovUKFormGroup>

      <GovUKFormGroup label="Status" htmlFor="status">
        <GovUKSelect id="status" name="status">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </GovUKSelect>
      </GovUKFormGroup>

      <GovUKButton type="submit">Save</GovUKButton>
      <GovUKButton variant="secondary">Cancel</GovUKButton>
    </form>
  )
}
```

## Design System Reference

For full design patterns and guidance, see the [official GOV.UK Design System](https://design-system.service.gov.uk/).
