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
        }
      }}
    />
  )
}