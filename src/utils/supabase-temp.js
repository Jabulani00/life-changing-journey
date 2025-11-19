// Temporary Supabase Configuration - For Development Testing
import { createClient } from '@supabase/supabase-js'

// Temporary configuration for testing - replace with real values
const supabaseUrl = 'https://demo.supabase.co'  // Temporary URL for testing
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTQ4ODM2MywiZXhwIjoxOTYxMDY0MzYzfQ.demo'  // Temporary key

// Create Supabase client with error handling
let supabase = null

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // Disable for development
    },
  })
} catch (error) {
  console.error('❌ Failed to create Supabase client:', error)
  
  // Create a mock client for development
  supabase = {
    auth: {
      signUp: () => Promise.resolve({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
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
      if (!supabase) {
        return false
      }
      
      const { data, error } = await supabase.from('test').select('*').limit(1)
      
      if (error && error.code !== 'PGRST116') {
        return false
      }
      
      return true
    } catch (err) {
      return false
    }
  },

  // Auth helpers with error handling
  async signUp(email, password, metadata = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      })
      return { data, error }
    } catch (err) {
      return { data: null, error: { message: 'Demo mode - Authentication not available' } }
    }
  },

  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { data, error }
    } catch (err) {
      return { data: null, error: { message: 'Demo mode - Authentication not available' } }
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (err) {
      return { error: null }
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      return { user, error }
    } catch (err) {
      return { user: null, error: null }
    }
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    try {
      return supabase.auth.onAuthStateChange(callback)
    } catch (err) {
      return { data: { subscription: { unsubscribe: () => {} } } }
    }
  }
}

// Export the client
export { supabase }
export default supabase
