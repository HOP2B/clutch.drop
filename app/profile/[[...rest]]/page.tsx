import { UserProfile } from '@clerk/nextjs'

export default function ProfilePage() {
  return (
    <UserProfile
      appearance={{
        variables: {
          colorBackground: '#0a091a',
          colorInputBackground: '#1a1a2e',
          colorInputText: '#ffffff',
          colorText: '#ffffff',
          colorPrimary: '#6366f1',
          colorDanger: '#ef4444',
          colorSuccess: '#22c55e',
          colorWarning: '#eab308'
        },
        elements: {
          footer: {
            display: 'none'
          },
          card: {
            backgroundColor: '#0a091a',
            border: '1px solid #1a1a2e'
          },
          header: {
            backgroundColor: '#0a091a'
          },
          navbar: {
            backgroundColor: '#0a091a'
          },
          navbarButton: {
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#1a1a2e'
            }
          },
          section: {
            backgroundColor: '#0a091a'
          },
          sectionTitle: {
            color: '#ffffff'
          },
          sectionDescription: {
            color: '#cccccc'
          },
          rootBox: {
            backgroundColor: '#0a091a'
          },
          profilePage: {
            backgroundColor: '#0a091a'
          },
          main: {
            backgroundColor: '#0a091a'
          },
          userProfileCard: {
            backgroundColor: '#0a091a'
          },
          userButtonPopoverCard: {
            backgroundColor: '#0a091a'
          },
          accordionItem: {
            backgroundColor: '#0a091a',
            borderBottom: '1px solid #1a1a2e'
          },
          accordionTriggerButton: {
            color: '#ffffff',
            backgroundColor: '#0a091a'
          },
          formFieldLabel: {
            color: '#ffffff'
          },
          formFieldValue: {
            color: '#ffffff'
          },
          identityCard: {
            backgroundColor: '#0a091a'
          },
          badge: {
            backgroundColor: '#1a1a2e',
            color: '#ffffff'
          }
        }
      }}
    />
  )
}