# Component Guide

This guide documents the key components in the QR Code-Based Instructional System.

## Property Components

### PropertyList

The `PropertyList` component displays a grid of properties with sorting and filtering capabilities.

**Props**:
- `properties`: Array of property objects
- `onDelete`: Function to handle property deletion
- `onCreate`: Function to handle property creation

**Features**:
- Search filtering
- Multi-field sorting
- Responsive grid layout
- Loading states
- Error handling
- Empty state handling

**Example**:
```jsx
<PropertyList
  properties={properties}
  onDelete={handleDelete}
  onCreate={handleCreate}
/>
```

### PropertyCard

The `PropertyCard` component displays a single property with its details and actions.

**Props**:
- `property`: Property object
- `onDelete`: Function to handle property deletion

**Features**:
- Property type icons
- Item count display
- Address display
- Creation/update dates
- Edit/Delete actions
- Loading states for actions

**Example**:
```jsx
<PropertyCard
  property={{
    id: '123',
    name: 'Downtown Apartment',
    description: 'Modern 2-bedroom apartment',
    property_type: 'apartment',
    item_count: 5,
    created_at: '2025-01-01',
    updated_at: '2025-01-02'
  }}
  onDelete={handleDelete}
/>
``` 