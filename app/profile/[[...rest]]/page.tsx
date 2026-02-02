import { UserProfile } from '@clerk/nextjs'

export default function ProfilePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a091a' }}>
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
            }
          }
        }}
      />
    </div>
  )
}