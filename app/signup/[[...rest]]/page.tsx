import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <SignUp
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
  )
}