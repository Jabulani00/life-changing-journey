// Authentication context for managing user state
import React, { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../services/supabaseClient'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const enableAuth = process.env.EXPO_PUBLIC_ENABLE_AUTH === 'true'

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      if (!enableAuth) {
        // Anonymous demo user for content browsing without signup
        setSession(null)
        setUser({ id: 'anonymous-user', role: 'guest', isAnonymous: true })
        setLoading(false)
        return
      }
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    if (enableAuth) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
        }
      )
      return () => subscription?.unsubscribe()
    }
    return () => {}
  }, [])

  // Sign up function
  const signUp = async (email, password, fullName) => {
  if (!enableAuth) return { data: null, error: new Error('Auth disabled') }
  try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: fullName,
              created_at: new Date().toISOString(),
            }
          ])

        if (profileError) {
          console.warn('Profile creation error:', profileError)
        }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  // Sign in function
  const signIn = async (email, password) => {
  if (!enableAuth) return { data: null, error: new Error('Auth disabled') }
  try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  // Sign out function
  const signOut = async () => {
  if (!enableAuth) return { error: new Error('Auth disabled') }
  try {
      setLoading(true)
      
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error
      
      // Clear local storage
      await AsyncStorage.clear()
      
      return { error: null }
    } catch (error) {
      return { error }
    } finally {
      setLoading(false)
    }
  }

  // Reset password function
  const resetPassword = async (email) => {
  if (!enableAuth) return { data: null, error: new Error('Auth disabled') }
  try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email)
      
      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Update user profile
  const updateProfile = async (updates) => {
  if (!enableAuth) return { data: null, error: new Error('Auth disabled') }
  try {
      setLoading(true)
      
      if (!user) throw new Error('No user logged in')

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  // Get user profile
  const getUserProfile = async () => {
    try {
      if (!enableAuth) return { data: null, error: new Error('Auth disabled') }
      if (!user) return { data: null, error: new Error('No user logged in') }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    getUserProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}
