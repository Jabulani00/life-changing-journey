// Authentication context for managing user state
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { isAdmin as checkFirebaseAdmin } from '../services/firebase'
import { supabase } from '../services/supabaseClient'

const AuthContext = createContext({})

// Default admin credentials – work without Supabase (demo admin session)
const DEFAULT_ADMIN_EMAIL = 'life.changing@admin.com'
const DEFAULT_ADMIN_PASSWORD = 'Password@??'
const DEMO_ADMIN_STORAGE_KEY = 'life_changing_journey_demo_admin'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(false)
  const [adminLoading, setAdminLoading] = useState(false)
  // Login is optional by default (users can browse without signing in). Set EXPO_PUBLIC_ENABLE_AUTH=true to require login.
  const enableAuth = process.env.EXPO_PUBLIC_ENABLE_AUTH === 'true'

  // Resolve admin role from Firebase config when user changes
  useEffect(() => {
    const email = user?.email ?? user?.user_metadata?.email
    if (!email) {
      setAdmin(false)
      setAdminLoading(false)
      return
    }
    setAdminLoading(true)
    checkFirebaseAdmin(email)
      .then(setAdmin)
      .catch(() => setAdmin(false))
      .finally(() => setAdminLoading(false))
  }, [user])

  useEffect(() => {
    const getInitialSession = async () => {
      // Restore demo admin session if previously used (works with or without enableAuth)
      try {
        const stored = await AsyncStorage.getItem(DEMO_ADMIN_STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed?.email === DEFAULT_ADMIN_EMAIL) {
            setSession({ isDemoAdmin: true })
            setUser({
              id: 'demo-admin',
              email: DEFAULT_ADMIN_EMAIL,
              user_metadata: { email: DEFAULT_ADMIN_EMAIL },
            })
            setLoading(false)
            return
          }
        }
      } catch (_) {}

      if (!enableAuth) {
        setSession(null)
        // Don't set user – show login screen so user can use default admin or continue as guest
        setUser(null)
        setLoading(false)
        return
      }
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

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

  const setDemoAdminSession = async () => {
    const demoUser = {
      id: 'demo-admin',
      email: DEFAULT_ADMIN_EMAIL,
      user_metadata: { email: DEFAULT_ADMIN_EMAIL },
    }
    await AsyncStorage.setItem(
      DEMO_ADMIN_STORAGE_KEY,
      JSON.stringify({ email: DEFAULT_ADMIN_EMAIL })
    )
    setSession({ isDemoAdmin: true })
    setUser(demoUser)
    setAdmin(true)
  }

  // Sign in – default admin always works (demo session if Supabase not set up or fails)
  const signIn = async (email, password) => {
    const trimmedEmail = (email || '').trim().toLowerCase()
    const isDefaultAdmin =
      trimmedEmail === DEFAULT_ADMIN_EMAIL.toLowerCase() && password === DEFAULT_ADMIN_PASSWORD

    if (!enableAuth) {
      if (isDefaultAdmin) {
        setLoading(true)
        try {
          await setDemoAdminSession()
          setLoading(false)
          return { data: { user: { email: DEFAULT_ADMIN_EMAIL } }, error: null }
        } catch (e) {
          setLoading(false)
          return { data: null, error: e }
        }
      }
      return {
        data: null,
        error: new Error(
          'Use default admin (life.changing@admin.com / Password@??) or tap Continue as guest.'
        ),
      }
    }

    if (isDefaultAdmin) {
      setLoading(true)
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: DEFAULT_ADMIN_EMAIL,
          password: DEFAULT_ADMIN_PASSWORD,
        })
        if (!error && data?.user) {
          setLoading(false)
          return { data, error: null }
        }
        // Supabase failed (e.g. user not created) – use demo admin so login still works
        await setDemoAdminSession()
        setLoading(false)
        return { data: { user: { email: DEFAULT_ADMIN_EMAIL } }, error: null }
      } catch (_) {
        try {
          await setDemoAdminSession()
          setLoading(false)
          return { data: { user: { email: DEFAULT_ADMIN_EMAIL } }, error: null }
        } catch (e) {
          setLoading(false)
          return { data: null, error: e }
        }
      }
    }

    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail || email,
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

  // Continue as guest (when auth is not required)
  const signInAsGuest = () => {
    setSession(null)
    setUser({ id: 'anonymous-user', role: 'guest', isAnonymous: true })
  }

  // Sign out function
  const signOut = async () => {
    setLoading(true)
    try {
      await AsyncStorage.removeItem(DEMO_ADMIN_STORAGE_KEY)
      if (enableAuth) {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
      }
      setSession(null)
      setUser(null)
      setAdmin(false)
      return { error: null }
    } catch (error) {
      setSession(null)
      setUser(null)
      setAdmin(false)
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
    admin,
    adminLoading,
    signUp,
    signIn,
    signInAsGuest,
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
