// Authentication context – Firebase Auth + Firestore (same insert pattern as bookings/events)
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  getUserProfileFromFirestore,
  isAdmin as checkFirebaseAdmin,
  registerWithEmailAndPassword,
  signInWithEmail,
  signOutFirebase,
  subscribeToAuthState,
  updateUserProfileInFirestore,
} from '../services/firebase'
import { isSupabaseConfigured, supabase } from '../services/supabaseClient'

const AuthContext = createContext({})

const DEFAULT_ADMIN_EMAIL = 'life.changing@admin.com'
const DEFAULT_ADMIN_PASSWORD = 'Password@??'
const DEMO_ADMIN_STORAGE_KEY = 'life_changing_journey_demo_admin'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(false)
  const [adminLoading, setAdminLoading] = useState(false)
  const enableAuth = process.env.EXPO_PUBLIC_ENABLE_AUTH === 'true'

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

  // Firebase Auth state + restore demo admin from storage
  useEffect(() => {
    const restoreDemoAdmin = async () => {
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
            return true
          }
        }
      } catch (_) {}
      return false
    }

    const unsub = subscribeToAuthState(async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfileFromFirestore(firebaseUser.uid)
        setSession({ user: firebaseUser })
        setUser({
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          user_metadata: {
            email: firebaseUser.email,
            full_name: profile?.full_name ?? '',
          },
        })
      } else {
        const restored = await restoreDemoAdmin()
        if (!restored) {
          if (enableAuth && isSupabaseConfigured) {
            const { data: { session: sbSession } } = await supabase.auth.getSession()
            setSession(sbSession)
            setUser(sbSession?.user ?? null)
          } else {
            setSession(null)
            setUser(null)
          }
        }
      }
      setLoading(false)
    })

    if (!enableAuth && !user) {
      restoreDemoAdmin().then((restored) => {
        if (!restored) setLoading(false)
      })
    }

    return () => unsub()
  }, [])

  // Sign up – Firebase Auth + Firestore users (same insert pattern as createBooking/addEvent)
  const signUp = async (email, password, fullName) => {
    try {
      setLoading(true)
      const data = await registerWithEmailAndPassword(
        (email || '').trim().toLowerCase(),
        password,
        (fullName || '').trim()
      )
      setSession(data.session)
      setUser(data.user)
      return { data, error: null }
    } catch (error) {
      const message = error?.message || 'Could not create account.'
      return { data: null, error: { ...error, message } }
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

  // Sign in – Firebase Auth; default admin uses demo session
  const signIn = async (email, password) => {
    const trimmedEmail = (email || '').trim().toLowerCase()
    const isDefaultAdmin =
      trimmedEmail === DEFAULT_ADMIN_EMAIL.toLowerCase() && password === DEFAULT_ADMIN_PASSWORD

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

    try {
      setLoading(true)
      const data = await signInWithEmail(trimmedEmail || email, password)
      const profile = await getUserProfileFromFirestore(data.user.uid)
      setSession(data.session)
      setUser({
        id: data.user.uid,
        uid: data.user.uid,
        email: data.user.email,
        user_metadata: {
          email: data.user.email,
          full_name: profile?.full_name ?? '',
        },
      })
      return { data: { user: data.user }, error: null }
    } catch (error) {
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: trimmedEmail,
            password,
          })
          if (!error && data?.user) {
            setSession(data.session)
            setUser(data.user)
            return { data, error: null }
          }
        } catch (_) {}
      }
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

  const signOut = async () => {
    setLoading(true)
    try {
      await AsyncStorage.removeItem(DEMO_ADMIN_STORAGE_KEY)
      try {
        await signOutFirebase()
      } catch (_) {}
      if (enableAuth && isSupabaseConfigured) {
        await supabase.auth.signOut()
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

  const updateProfile = async (updates) => {
    try {
      if (!user?.id) return { data: null, error: new Error('No user logged in') }
      setLoading(true)
      const uid = user.uid || user.id
      await updateUserProfileInFirestore(uid, updates)
      return { data: { ...user.user_metadata, ...updates }, error: null }
    } catch (error) {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.from('profiles').update(updates).eq('id', user.id)
        if (!error) return { data, error: null }
      }
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const getUserProfile = async () => {
    try {
      if (!user?.id) return { data: null, error: new Error('No user logged in') }
      const uid = user.uid || user.id
      const profile = await getUserProfileFromFirestore(uid)
      if (profile) return { data: profile, error: null }
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        return { data, error }
      }
      return { data: user.user_metadata || {}, error: null }
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
