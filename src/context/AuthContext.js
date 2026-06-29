// Authentication context – Firebase Auth + Firestore (same insert pattern as bookings/events)
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
  getUserProfileFromFirestore,
  isAdmin as checkFirebaseAdmin,
  registerWithEmailAndPassword,
  reauthenticateUser,
  deleteAccountViaFunction,
  resetPasswordWithEmail,
  signInWithEmail,
  signOutFirebase,
  subscribeToAuthState,
  updateUserProfileInFirestore,
} from '../services/firebase'
import {
  getEffectivePlanId,
  mapPlanToEntitlements,
  subscribeMembership,
} from '../services/membershipService'
import { isSupabaseConfigured, supabase } from '../services/supabaseClient'

const AuthContext = createContext({})

const DEFAULT_ADMIN_EMAIL = 'life.changing@admin.com'
const DEFAULT_ADMIN_PASSWORD = 'Password@??'
const DEMO_ADMIN_STORAGE_KEY = 'life_changing_journey_demo_admin'

const isProductionBuild =
  process.env.EXPO_PUBLIC_ENV === 'production' ||
  (typeof __DEV__ !== 'undefined' && !__DEV__)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(false)
  const [adminLoading, setAdminLoading] = useState(false)
  const [membership, setMembership] = useState(null)
  const membershipUnsubRef = useRef(null)
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

  // Real-time membership subscription
  useEffect(() => {
    const uid = user?.uid || (user?.id !== 'demo-admin' ? user?.id : null)
    if (membershipUnsubRef.current) {
      membershipUnsubRef.current()
      membershipUnsubRef.current = null
    }
    if (!uid) {
      setMembership(null)
      return
    }
    membershipUnsubRef.current = subscribeMembership(
      uid,
      (data) => setMembership(data),
      () => setMembership(null)
    )
    return () => {
      if (membershipUnsubRef.current) {
        membershipUnsubRef.current()
        membershipUnsubRef.current = null
      }
    }
  }, [user?.uid, user?.id])

  // Firebase Auth state + restore demo admin from storage
  useEffect(() => {
    const restoreDemoAdmin = async () => {
      if (isProductionBuild) return false
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
      !isProductionBuild &&
      trimmedEmail === DEFAULT_ADMIN_EMAIL.toLowerCase() &&
      password === DEFAULT_ADMIN_PASSWORD

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
      setMembership(null)
      return { error: null }
    } catch (error) {
      setSession(null)
      setUser(null)
      setAdmin(false)
      setMembership(null)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email) => {
    const trimmed = (email || '').trim().toLowerCase()
    if (!trimmed) return { data: null, error: new Error('Email is required') }
    try {
      await resetPasswordWithEmail(trimmed)
      return { data: {}, error: null }
    } catch (error) {
      if (enableAuth && isSupabaseConfigured) {
        try {
          const { data, error: sbError } = await supabase.auth.resetPasswordForEmail(trimmed)
          if (!sbError) return { data, error: null }
        } catch (_) {}
      }
      return { data: null, error: { message: error?.message || 'Could not send reset email' } }
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

  const canDeleteAccount =
    user &&
    !user.isAnonymous &&
    user.id !== 'anonymous-user' &&
    user.id !== 'demo-admin' &&
    !session?.isDemoAdmin &&
    (user.uid || (user.id && user.id !== 'demo-admin'))

  const deleteAccount = async (password) => {
    if (!canDeleteAccount) {
      return { data: null, error: new Error('This account cannot be deleted from the app.') }
    }
    if (!password?.trim()) {
      return { data: null, error: new Error('Password is required to confirm account deletion.') }
    }
    try {
      setLoading(true)
      await reauthenticateUser(password)
      const data = await deleteAccountViaFunction()
      if (enableAuth && isSupabaseConfigured) {
        await supabase.auth.signOut().catch(() => {})
      }
      await AsyncStorage.removeItem(DEMO_ADMIN_STORAGE_KEY)
      setSession(null)
      setUser(null)
      setAdmin(false)
      setMembership(null)
      try {
        await signOutFirebase()
      } catch (_) {}
      return { data, error: null }
    } catch (error) {
      const message =
        error?.message ||
        error?.details ||
        'Could not delete your account. Please try again or contact support.'
      return { data: null, error: { ...error, message } }
    } finally {
      setLoading(false)
    }
  }

  const effectivePlanId = getEffectivePlanId(membership)
  const entitlements = mapPlanToEntitlements(effectivePlanId)

  const value = {
    user,
    session,
    loading,
    admin,
    adminLoading,
    membership,
    effectivePlanId,
    entitlements,
    signUp,
    signIn,
    signInAsGuest,
    signOut,
    resetPassword,
    updateProfile,
    getUserProfile,
    deleteAccount,
    canDeleteAccount,
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
