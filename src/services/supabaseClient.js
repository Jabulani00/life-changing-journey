// Supabase client configuration
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { staticData } from '../utils/staticData'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

// Avoid crashing Metro if env not yet loaded; warn instead
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. Auth calls will fail until provided.')
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'public-anon-key', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// NOTE: Database schema uses 'appointments' table. Frontend initially referenced 'bookings'.
// For backward compatibility we point booking helpers at the appointments table
// and also expose semantic appointment* method names.
const APPOINTMENTS_TABLE = 'appointments'

// Helper utilities for common operations
export const supabaseHelpers = {
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: userData },
    })
    return { data, error }
  },
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  },
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error }
  },
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error }
  },
  async getProfile(userId) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    return { data, error }
  },
  async updateProfile(userId, updates) {
    const { data, error } = await supabase.from('profiles').upsert({ id: userId, ...updates, updated_at: new Date() });
    return { data, error }
  },
  async getServices() {
    try {
      const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: true });
      if (error || !data || data.length === 0) {
        return { data: staticData.services, error }
      }
      return { data, error }
    } catch (e) {
      return { data: staticData.services, error: e }
    }
  },
  async getServicesByCategory(category) {
    try {
      const { data, error } = await supabase.from('services').select('*').eq('category', category).order('created_at', { ascending: true });
      if (error || !data || data.length === 0) {
        return { data: staticData.services.filter(s => s.category === category), error }
      }
      return { data, error }
    } catch (e) {
      return { data: staticData.services.filter(s => s.category === category), error: e }
    }
  },
  // Booking / Appointment helpers (legacy names retained)
  async createBooking(bookingData) {
    const { data, error } = await supabase.from(APPOINTMENTS_TABLE).insert([bookingData]);
    return { data, error }
  },
  async getUserBookings(userId) {
    const { data, error } = await supabase
      .from(APPOINTMENTS_TABLE)
      .select(`*, services ( name, description, price, duration )`)
      .eq('user_id', userId)
      .order('appointment_date', { ascending: true });
    return { data, error }
  },
  async updateBookingStatus(bookingId, status) {
    const { data, error } = await supabase
      .from(APPOINTMENTS_TABLE)
      .update({ status })
      .eq('id', bookingId);
    return { data, error }
  },
  // New semantic names
  async createAppointment(dataObj) { return this.createBooking(dataObj) },
  async getUserAppointments(userId) { return this.getUserBookings(userId) },
  async updateAppointmentStatus(id, status) { return this.updateBookingStatus(id, status) },
  async createDonation(donationData) {
    const { data, error } = await supabase.from('donations').insert([donationData]);
    return { data, error }
  },
  async getResources() {
    try {
      const { data, error } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
      if (error || !data || data.length === 0) {
        return { data: staticData.resources, error }
      }
      return { data, error }
    } catch (e) {
      return { data: staticData.resources, error: e }
    }
  },
  async getResourcesByCategory(category) {
    try {
      const { data, error } = await supabase.from('resources').select('*').eq('category', category).order('created_at', { ascending: false });
      if (error || !data || data.length === 0) {
        return { data: staticData.resources.filter(r => r.category === category), error }
      }
      return { data, error }
    } catch (e) {
      return { data: staticData.resources.filter(r => r.category === category), error: e }
    }
  },
  async getTestimonials() {
    // Attempt remote if table exists; fallback to static
    try {
      const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      if (error || !data || data.length === 0) {
        return { data: staticData.testimonials, error }
      }
      return { data, error }
    } catch (e) {
      return { data: staticData.testimonials, error: e }
    }
  },
  async getUpcomingAppointments(userId) {
    // Map static sample appointments to approximate remote shape
    const mapped = staticData.upcomingAppointments.map(a => ({
      id: a.id,
      service_id: a.service_id,
      appointment_date: a.appointment_date,
      status: a.status,
      notes: a.notes,
      services: a.services,
      user_id: userId || 'demo-user'
    }))
    try {
      const { data, error } = await supabase
        .from(APPOINTMENTS_TABLE)
        .select('*, services ( name, description, price, duration )')
        .eq('user_id', userId)
        .order('appointment_date', { ascending: true })
      if (error || !data || data.length === 0) {
        return { data: mapped, error }
      }
      return { data, error }
    } catch (e) {
      return { data: mapped, error: e }
    }
  }
}
