import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <SignIn
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
          socialButtonsIconButton: {
            color: '#ffffff',
            backgroundColor: '#6366f1',
            border: '1px solid #6366f1',
            boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.1), 0 2px 4px -1px rgba(99, 102, 241, 0.06)'
          },
          socialButtonsBlockButton: {
            color: '#ffffff',
            backgroundColor: '#6366f1',
            border: '1px solid #6366f1',
            boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.1), 0 2px 4px -1px rgba(99, 102, 241, 0.06)'
          },
          formButtonPrimary: {
            border: '1px solid #6366f1',
            boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.1), 0 2px 4px -1px rgba(99, 102, 241, 0.06)'
          },
          formFieldInputShowPasswordButton: {
            backgroundColor: '#6366f1'
          },
          formFieldInput: {
            '&:focus': {
              borderColor: '#6366f1',
              boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.2)'
            }
          },
          headerTitle: {
            color: '#ffffff',
            textShadow: 'none'
          },
          headerSubtitle: {
            color: '#ffffff',
            textShadow: 'none'
          }
        }
      }}
    />
  )
}