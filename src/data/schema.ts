import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { relations } from 'drizzle-orm'

// Enums
export const UserRole = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  CONTRIBUTOR: 'contributor',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export const PoliceOfficerVerificationStatus = {
  CONFIRMED: 'confirmed',
  SUSPECTED: 'suspected',
  UNVERIFIED: 'unverified',
} as const

export type PoliceOfficerVerificationStatus =
  (typeof PoliceOfficerVerificationStatus)[keyof typeof PoliceOfficerVerificationStatus]

export const EventStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  UNDER_REVIEW: 'under_review',
  VERIFIED: 'verified',
} as const

export type EventStatus = (typeof EventStatus)[keyof typeof EventStatus]

export const MediaType = {
  MP4: 'mp4',
  PNG: 'png',
  JPG: 'jpg',
  JPEG: 'jpeg',
  GIF: 'gif',
  WEBM: 'webm',
} as const

export type MediaType = (typeof MediaType)[keyof typeof MediaType]

export const BehaviourCategory = {
  USE_OF_FORCE: 'use_of_force',
  MISCONDUCT: 'misconduct',
  EXCESSIVE_FORCE: 'excessive_force',
  VERBAL_ABUSE: 'verbal_abuse',
  RACIAL_PROFILING: 'racial_profiling',
  FALSE_ARREST: 'false_arrest',
  EXEMPLARY: 'exemplary',
  OTHER: 'other',
} as const

export type BehaviourCategory =
  (typeof BehaviourCategory)[keyof typeof BehaviourCategory]

export const BehaviourSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const

export type BehaviourSeverity =
  (typeof BehaviourSeverity)[keyof typeof BehaviourSeverity]

export const BehaviourStatus = {
  PENDING_REVIEW: 'pending_review',
  VERIFIED: 'verified',
  DISPUTED: 'disputed',
  DISMISSED: 'dismissed',
} as const

export type BehaviourStatus =
  (typeof BehaviourStatus)[keyof typeof BehaviourStatus]

// Users
export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: text('username').unique(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role', { enum: ['admin', 'moderator', 'contributor'] })
    .notNull()
    .default('contributor'),
  avatar: text('avatar'), // File path to avatar image
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const usersRelations = relations(users, ({ many }) => ({
  events: many(events),
  media: many(media),
  behaviours: many(policeOfficerBehaviours),
}))

// Organizations (Police Departments)
export const organizations = sqliteTable('organizations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  address: text('address'),
  email: text('email'),
  contactNumber: text('contact_number'),
  latitude: text('latitude'),
  longitude: text('longitude'),
})

export const organizationsRelations = relations(organizations, ({ many }) => ({
  policeOfficers: many(policeOfficers),
}))

// Police Officers
export const policeOfficers = sqliteTable('police_officers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name'),
  lastName: text('last_name'),
  badgeNumber: text('badge_number'),
  rank: text('rank'),
  organizationId: integer('organization_id').references(() => organizations.id),
  verificationStatus: text('verification_status', {
    enum: ['confirmed', 'suspected', 'unverified'],
  })
    .notNull()
    .default('unverified'),
  estimatedDob: text('estimated_dob'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const policeOfficersRelations = relations(
  policeOfficers,
  ({ one, many }) => ({
    organization: one(organizations, {
      fields: [policeOfficers.organizationId],
      references: [organizations.id],
    }),
    atEvents: many(policeOfficerAtEvent),
    inMedia: many(policeOfficerInMedia),
    behaviours: many(policeOfficerBehaviours),
  }),
)

// Events
export const events = sqliteTable('events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(),
  startTime: text('start_time'),
  endTime: text('end_time'),
  eventType: text('event_type').notNull(), // e.g., "Protest", "Arrest", "Traffic Stop"
  description: text('description'), // Markdown
  location: text('location'), // General location description
  address: text('address'),
  city: text('city'),
  state: text('state'),
  latitude: text('latitude'),
  longitude: text('longitude'),
  outcome: text('outcome'), // What happened
  status: text('status', {
    enum: ['draft', 'published', 'under_review', 'verified'],
  })
    .notNull()
    .default('draft'),
  createdById: text('created_by_id').references(() => users.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

export const eventsRelations = relations(events, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [events.createdById],
    references: [users.id],
  }),
  media: many(media),
  policeOfficers: many(policeOfficerAtEvent),
  behaviours: many(policeOfficerBehaviours),
}))

// Sources
export const sources = sqliteTable('sources', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  type: text('type').notNull(), // e.g., "News Article", "Social Media", "Witness"
  url: text('url'),
  description: text('description'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const sourcesRelations = relations(sources, ({ many }) => ({
  eventAttendances: many(policeOfficerAtEvent),
}))

// Media
export const media = sqliteTable('media', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  eventId: integer('event_id').references(() => events.id),
  title: text('title').notNull(),
  description: text('description'), // Markdown
  type: text('type', {
    enum: ['mp4', 'png', 'jpg', 'jpeg', 'gif', 'webm'],
  }).notNull(),
  link: text('link').notNull(), // File path or URL
  date: text('date'),
  startLocation: text('start_location'), // Lat/long JSON
  endLocation: text('end_location'), // Lat/long JSON
  pathLocations: text('path_locations'), // JSON array of lat/longs for tracking movement
  duration: integer('duration'), // In seconds for video files
  uploadedById: text('uploaded_by_id').references(() => users.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const mediaRelations = relations(media, ({ one, many }) => ({
  event: one(events, {
    fields: [media.eventId],
    references: [events.id],
  }),
  uploadedBy: one(users, {
    fields: [media.uploadedById],
    references: [users.id],
  }),
  policeOfficers: many(policeOfficerInMedia),
  behaviours: many(policeOfficerBehaviours),
}))

// Police Officer at Event (Junction Table)
export const policeOfficerAtEvent = sqliteTable('police_officer_at_event', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  policeOfficerId: integer('police_officer_id')
    .notNull()
    .references(() => policeOfficers.id),
  eventId: integer('event_id')
    .notNull()
    .references(() => events.id),
  sourceId: integer('source_id').references(() => sources.id),
  attendees: text('attendees'), // JSON array of sources/witnesses
  notes: text('notes'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const policeOfficerAtEventRelations = relations(
  policeOfficerAtEvent,
  ({ one }) => ({
    policeOfficer: one(policeOfficers, {
      fields: [policeOfficerAtEvent.policeOfficerId],
      references: [policeOfficers.id],
    }),
    event: one(events, {
      fields: [policeOfficerAtEvent.eventId],
      references: [events.id],
    }),
    source: one(sources, {
      fields: [policeOfficerAtEvent.sourceId],
      references: [sources.id],
    }),
  }),
)

// Police Officer in Media (Junction Table)
export const policeOfficerInMedia = sqliteTable('police_officer_in_media', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  policeOfficerId: integer('police_officer_id')
    .notNull()
    .references(() => policeOfficers.id),
  mediaId: integer('media_id')
    .notNull()
    .references(() => media.id),
  timestamp: text('timestamp'), // When in the video/media
  description: text('description'), // What they're doing in this media
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const policeOfficerInMediaRelations = relations(
  policeOfficerInMedia,
  ({ one }) => ({
    policeOfficer: one(policeOfficers, {
      fields: [policeOfficerInMedia.policeOfficerId],
      references: [policeOfficers.id],
    }),
    media: one(media, {
      fields: [policeOfficerInMedia.mediaId],
      references: [media.id],
    }),
  }),
)

// Police Officer Behaviour
export const policeOfficerBehaviours = sqliteTable(
  'police_officer_behaviours',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    policeOfficerId: integer('police_officer_id')
      .notNull()
      .references(() => policeOfficers.id),
    eventId: integer('event_id').references(() => events.id),
    mediaId: integer('media_id').references(() => media.id),
    description: text('description').notNull(), // Markdown
    category: text('category', {
      enum: [
        'use_of_force',
        'misconduct',
        'excessive_force',
        'verbal_abuse',
        'racial_profiling',
        'false_arrest',
        'exemplary',
        'other',
      ],
    }).notNull(),
    severity: text('severity', { enum: ['low', 'medium', 'high', 'critical'] })
      .notNull()
      .default('medium'),
    status: text('status', {
      enum: ['pending_review', 'verified', 'disputed', 'dismissed'],
    })
      .notNull()
      .default('pending_review'),
    timestamp: text('timestamp'), // When the behaviour occurred
    authorId: text('author_id').references(() => users.id),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  },
)

export const policeOfficerBehavioursRelations = relations(
  policeOfficerBehaviours,
  ({ one }) => ({
    policeOfficer: one(policeOfficers, {
      fields: [policeOfficerBehaviours.policeOfficerId],
      references: [policeOfficers.id],
    }),
    event: one(events, {
      fields: [policeOfficerBehaviours.eventId],
      references: [events.id],
    }),
    media: one(media, {
      fields: [policeOfficerBehaviours.mediaId],
      references: [media.id],
    }),
    author: one(users, {
      fields: [policeOfficerBehaviours.authorId],
      references: [users.id],
    }),
  }),
)

// TypeScript types inferred from schema
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Organization = typeof organizations.$inferSelect
export type NewOrganization = typeof organizations.$inferInsert

export type PoliceOfficer = typeof policeOfficers.$inferSelect
export type NewPoliceOfficer = typeof policeOfficers.$inferInsert

export type Event = typeof events.$inferSelect
export type NewEvent = typeof events.$inferInsert

export type Source = typeof sources.$inferSelect
export type NewSource = typeof sources.$inferInsert

export type Media = typeof media.$inferSelect
export type NewMedia = typeof media.$inferInsert

export type PoliceOfficerAtEvent = typeof policeOfficerAtEvent.$inferSelect
export type NewPoliceOfficerAtEvent = typeof policeOfficerAtEvent.$inferInsert

export type PoliceOfficerInMedia = typeof policeOfficerInMedia.$inferSelect
export type NewPoliceOfficerInMedia = typeof policeOfficerInMedia.$inferInsert

export type PoliceOfficerBehaviour = typeof policeOfficerBehaviours.$inferSelect
export type NewPoliceOfficerBehaviour =
  typeof policeOfficerBehaviours.$inferInsert
