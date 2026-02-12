import { createServerFn } from '@tanstack/react-start'

// Server function to get users
export const getPoliceOfficer = createServerFn({
  method: 'GET',
}).handler(async () => {
  // In a real app, you'd fetch from a database
  return [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  ]
})
