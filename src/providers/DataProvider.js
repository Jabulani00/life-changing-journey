import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { staticData } from '../utils/staticData';

// Create context
const DataContext = createContext({
  services: [],
  testimonials: [],
  resources: [],
  appointments: [],
  demoMode: true,
  refreshData: () => {},
  isLoading: true,
});

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  // State for data
  const [services, setServices] = useState(staticData.services);
  const [testimonials, setTestimonials] = useState(staticData.testimonials);
  const [resources, setResources] = useState(staticData.resources);
  const [appointments, setAppointments] = useState([]);
  const [demoMode, setDemoMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Load data from Supabase or use static data if offline
  const loadData = async () => {
    // For directory gateway mode, always use static data
    setDemoMode(true);
    setIsLoading(false);
    
    // Future: Enable this when backend is ready
    /*
    setIsLoading(true);
    try {
      // Load services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true);
      
      if (servicesData && servicesData.length > 0) {
        setServices(servicesData);
        setDemoMode(false);
      } else {
        // Using static services data
      }
      
      // Load testimonials
      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true);
      
      if (testimonialsData && testimonialsData.length > 0) {
        setTestimonials(testimonialsData);
      } else {
        // Using static testimonials data
      }
      
      // Load resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select('*')
        .eq('is_public', true);
      
      if (resourcesData && resourcesData.length > 0) {
        setResources(resourcesData);
      } else {
        // Using static resources data
      }
      
    } catch (error) {
      console.error('Error loading data:', error);
      setDemoMode(true);
    } finally {
      setIsLoading(false);
    }
    */
  };

  // Load user appointments if authenticated
  const loadUserAppointments = async (userId) => {
    if (!userId || userId === 'guest') return;
    
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, services(*)')
        .eq('user_id', userId)
        .order('appointment_date', { ascending: true });
      
      if (data) {
        setAppointments(data);
      } else {
        console.error('Error loading appointments:', error);
      }
    } catch (error) {
      console.error('Error in appointment fetch:', error);
    }
  };

  // Initial data load
  useEffect(() => {
    loadData();
  }, []);

  // Context value
  const value = {
    services,
    testimonials,
    resources,
    appointments,
    demoMode,
    refreshData: loadData,
    loadUserAppointments,
    isLoading,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};