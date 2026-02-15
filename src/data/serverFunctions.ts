import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getPoliceOfficerById } from './policeOfficers/getPoliceOfficerById'
import { getOrganizationById } from './organizations/getOrganizationById'

// Simple greeting server function for demos
export const getGreeting = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ name: z.string() }))
  .handler(async (ctx): Promise<{ message: string }> => {
    return { message: `Hello, ${ctx.data.name}! (from server)` }
  })

// Send complaint about a police officer to their organization
export const sendOfficerComplaint = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      officerId: z.number(),
      complainantName: z.string().min(1),
      complainantEmail: z.string().email(),
      complaintMessage: z.string().min(10),
    }),
  )
  .handler(async (ctx): Promise<{ success: boolean; message: string }> => {
    const { officerId, complainantName, complainantEmail, complaintMessage } =
      ctx.data

    // Get the officer details
    const officer = await getPoliceOfficerById({ data: { officerId } })
    if (!officer) {
      throw new Error('Police officer not found')
    }

    // Get the organization details
    if (!officer.organizationId) {
      throw new Error('Officer is not associated with an organization')
    }

    const organization = await getOrganizationById({
      data: { organizationId: officer.organizationId },
    })
    if (!organization) {
      throw new Error('Organization not found')
    }

    if (!organization.email) {
      throw new Error('Organization does not have an email address configured')
    }

    // In a real app, you would send an actual email here using nodemailer, SendGrid, etc.
    // For now, we'll just log it as a concept
    const emailContent = {
      to: organization.email,
      subject: `Complaint about Officer ${officer.badgeNumber || `${officer.firstName} ${officer.lastName}`}`,
      body: `
New Complaint Received

Officer Information:
- Name: ${officer.firstName} ${officer.lastName}
- Badge Number: ${officer.badgeNumber || 'N/A'}
- Rank: ${officer.rank || 'N/A'}
- Organization: ${organization.name}

Complainant Information:
- Name: ${complainantName}
- Email: ${complainantEmail}

Complaint:
${complaintMessage}

---
This complaint was submitted via CopShop on ${new Date().toLocaleString()}
      `,
    }

    // TODO: Replace with actual email sending
    console.log('📧 Email would be sent:', emailContent)

    return {
      success: true,
      message: `Complaint sent to ${organization.name} at ${organization.email}`,
    }
  })
