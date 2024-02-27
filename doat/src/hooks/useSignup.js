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

    
    if(email !== 'kwangchuk@doat.gov.bt' && email !== 'sangay@doat.gov.bt' && email !== 'tgyelten@doat.gov.bt' && email !== 'nrinchen@doat.gov.bt'&& email !== 'tdukpa@doat.gov.bt' && email !== 'wangmo@doat.gov.bt' && email !== 'lamdon@doat.gov.bt' ){
     
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