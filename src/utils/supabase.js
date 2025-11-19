// Supabase Configuration - Life Changing Journey
import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
// Make sure to update your .env file with actual values from https://app.supabase.com/project/YOUR_PROJECT/settings/api
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTQ4ODM2MywiZXhwIjoxOTYxMDY0MzYzfQ.demo'

// Validate configuration
// Running in demo mode if not configured

// Create Supabase client with error handling
let supabase = null

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // Disable for mobile development
    },
  })
} catch (error) {
  // Creating mock Supabase client for demo mode
  
  // Create a mock client for development when Supabase is not configured
  supabase = {
    auth: {
      signUp: () => Promise.resolve({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: (callback) => {
        // Return a mock subscription
        return {
          data: {
            subscription: {
              unsubscribe: () => {}
            }
          }
        }
      }
    },
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
      update: () => Promise.resolve({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
      delete: () => Promise.resolve({ data: null, error: { message: 'Demo mode - Supabase not configured' } })
    })
  }
}

// Helper functions for common operations
export const supabaseHelpers = {
  // Test connection
  async testConnection() {
    try {
      const { data, error } = await supabase.from('test').select('*').limit(1)
      if (error && error.code !== 'PGRST116') { // PGRST116 is "table not found" which is ok for testing
        console.error('Supabase connection error:', error)
        return false
      }
      return true
    } catch (err) {
      console.error('❌ Supabase connection failed:', err)
      return false
    }
  },

  // Auth helpers
  async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Export default client
export default supabase
