import { PianoNoteTester } from '@/pages/PianoNoteTester/PianoNoteTester'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/piano-note-tester/')({
  component: PianoNoteTesterPage,
  head: () => ({
    meta: [
      {
        title: 'Piano Note Tester - CopShop',
      },
      {
        name: 'description',
        content:
          'Test your piano note recognition skills with the C Major scale.',
      },
    ],
  }),
})

function PianoNoteTesterPage() {
  return <PianoNoteTester />
}
