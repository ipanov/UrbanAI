import OAuthLoginPage from './components/OAuthLoginPage'
import './App.css'

function App() {
  const handleOAuthLogin = (provider: 'microsoft' | 'google' | 'facebook') => {
    console.log('OAuth login with:', provider)
    // Implement OAuth login logic here
  }

  const handleGuestAccess = () => {
    console.log('Guest access requested')
    // Implement guest access logic here
  }

  return (
    <div className="App">
      <OAuthLoginPage 
        onOAuthLogin={handleOAuthLogin}
        onGuestAccess={handleGuestAccess}
      />
    </div>
  )
}

export default App
