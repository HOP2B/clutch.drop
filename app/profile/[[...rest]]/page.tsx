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
          colorPrimary: '#6366f1'
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
          }
        }
      }}
    />
  )
}