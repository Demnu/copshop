import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { GovUKPageContainer, GovUKPageHeader } from '@/components/govuk'
import { useStealthMode } from '@/contexts/StealthModeContext'
import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'

export const Route = createFileRoute('/')({ component: HomePage })

const inspiringPeople = [
  {
    name: 'Julian Assange',
    description: 'Founder of WikiLeaks, transparency advocate',
    quotes: [
      'If wars can be started by lies, peace can be started by truth.',
      'Capable, generous men do not create victims, they nurture victims.',
      'The overwhelming majority of information is classified to protect political security, not national security.',
      'Courage is contagious.',
      'The goal is to use Afghanistan to wash money out of the tax bases of the US and Europe through Afghanistan and back into the hands of a transnational security elite.',
    ],
  },
  {
    name: 'Fidel Castro',
    description: 'Cuban revolutionary and politician',
    quotes: [
      'A revolution is not a bed of roses. A revolution is a struggle between the future and the past.',
      'I began revolution with 82 men. If I had to do it again, I do it with 10 or 15 and absolute faith. It does not matter how small you are if you have faith and plan of action.',
      'Condemn me, it does not matter. History will absolve me.',
      'I am a Marxist-Leninist and I will be one until the last day of my life.',
      'We do not have a choice between the government and the people; the government must be an instrument of the people.',
    ],
  },
  {
    name: 'Paulo Freire',
    description: 'Educator and philosopher of critical pedagogy',
    quotes: [
      'There is no such thing as a neutral educational process.',
      "Washing one's hands of the conflict between the powerful and the powerless means to side with the powerful, not to be neutral.",
      'The oppressed, having internalized the image of the oppressor and adopted his guidelines, are fearful of freedom.',
      'Education either functions as an instrument which is used to facilitate integration of the younger generation into the logic of the present system and bring about conformity or it becomes the practice of freedom.',
      'Knowledge emerges only through invention and re-invention, through the restless, impatient, continuing, hopeful inquiry human beings pursue in the world, with the world, and with each other.',
    ],
  },
]

function HomePage() {
  const { stealthMode } = useStealthMode()

  // Pick a random quote from each person on page load
  const selectedQuotes = useMemo(() => {
    return inspiringPeople.map((person) => ({
      ...person,
      selectedQuote:
        person.quotes[Math.floor(Math.random() * person.quotes.length)],
    }))
  }, [])

  if (stealthMode) {
    return <></>
  }

  return (
    <GovUKPageContainer>
      <GovUKPageHeader
        title="Truth Seekers"
        caption="Visionaries who challenged systems and fought for justice"
      />

      <div className="govuk-grid-row">
        {selectedQuotes.map((person) => (
          <div key={person.name} className="govuk-grid-column-one-third">
            <div className="govuk-!-margin-bottom-6">
              <div
                style={{
                  border: '1px solid #b1b4b6',
                  padding: '20px',
                  backgroundColor: '#f3f2f1',
                  minHeight: '300px',
                }}
              >
                <h2 className="govuk-heading-m govuk-!-margin-bottom-2">
                  {person.name}
                </h2>
                <p
                  className="govuk-body-s"
                  style={{ color: '#505a5f', marginBottom: '15px' }}
                >
                  {person.description}
                </p>
                <hr
                  className="govuk-section-break govuk-section-break--m govuk-section-break--visible"
                  style={{ marginBottom: '15px' }}
                />
                <blockquote
                  style={{
                    borderLeft: '4px solid #1d70b8',
                    paddingLeft: '15px',
                    margin: '0',
                    fontStyle: 'italic',
                  }}
                >
                  <p className="govuk-body" style={{ marginBottom: '0' }}>
                    "{person.selectedQuote}"
                  </p>
                </blockquote>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GovUKPageContainer>
  )
}
