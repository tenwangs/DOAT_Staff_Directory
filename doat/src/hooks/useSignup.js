import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const signup = async (email, password) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch('/api/user/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password })
    })
    const json = await response.json()

    //restrict user other than tenzinwangs777@gmail.com and 02180090.cst@run.edu.bt to login 
    if(email !== 'tenzinwangs777@gmail.com' && email !== '02180090.cst@rub.edu.bt' && email !== '02200165.cst@rub.edu.bt'){
     
      setTimeout(() => {
        window.location.reload()
      }, 2000)
      return setError('You are not authorized to sign up. Please contact the admin.')
      

    }

    

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(json))

      // update the auth context
      dispatch({type: 'LOGIN', payload: json})

      // update loading state
      setIsLoading(false)
      //redirect to login page
      window.location.href = '/signup'
    }
  }

  return { signup, isLoading, error }
}