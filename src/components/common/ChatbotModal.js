// Chatbot Modal - Overlay widget like live chat (similar to Altron screenshot)
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useRef, useState } from 'react'
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '../../context/AuthContext'
import { createBooking } from '../../services/firebase'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'
import { staticData } from '../../utils/staticData'

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window')
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.7 // 70% of screen height
const MINIMIZED_HEIGHT = 60 // Minimized header height

const GREETING = `Hi! 👋 Welcome to Life Changing Journey. I'm your assistant — here to help you find what you need.

You can ask me about:
• 📅 Booking a consultation
• 🧠 Psychology & mental wellness services
• 🙏 Spiritual growth programs
• 💰 Financial guidance
• 🌀 Hypnotherapy
• 📆 Upcoming events
• 📺 Live streams`

const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die', 'no reason to live',
  'harm myself', 'self harm', 'take my life', 'not worth living', 'give up on life',
  "can't go on", 'cant go on', 'thinking of dying', 'end it all', 'better off dead',
  'hurt myself', 'don\'t want to live', 'dont want to live', 'no way out',
]
const CRISIS_RESPONSE = `I hear you, and I'm really glad you reached out. 💙

What you're feeling matters, and you don't have to face this alone.

🆘 Please call the SA Suicide Crisis Line right now:
📞 0800 567 567 (free, 24/7)

Or go to your nearest emergency room if you're in immediate danger.

Our team at Life Changing Journey has psychologists who can help. Would you like us to contact you urgently? You can also say "open contact" to reach us directly.`

function isCrisis(text) {
  const lower = (text || '').toLowerCase().trim()
  return CRISIS_KEYWORDS.some((phrase) => lower.includes(phrase))
}

const BOOKING_TIMES = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

function generateAvailableDates() {
  const dates = []
  const today = new Date()
  for (let i = 1; i <= 30; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    if (d.getDay() !== 0) {
      dates.push({
        label: `${d.toLocaleDateString('en-US', { weekday: 'short' })}, ${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'short' })}`,
        dateStr: `${d.toLocaleDateString('en-US', { weekday: 'short' })}, ${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'short' })}`,
      })
    }
  }
  return dates.slice(0, 14)
}

const FAQ = [
  { q: 'book booking appointment schedule consultation', a: 'To book a consultation, tap the **Booking** tab at the bottom of the screen. You can choose your service type, pick a date and time, and confirm your booking. Or just say "open booking" and I\'ll take you there! 📅' },
  { q: 'cancel reschedule change modify booking', a: 'To cancel or reschedule a booking, please contact us directly via WhatsApp or phone. You can find our contact details on the **Contact** screen.' },
  { q: 'psychology mental wellness counseling therapy counselling', a: 'Our Psychology Services offer individual counselling, trauma therapy, grief support, and African Psychology-based approaches. You can view full details on the Services screen.' },
  { q: 'spiritual growth faith prayer meditation', a: 'Our Spiritual Growth program includes spiritual direction, prayer and meditation, faith integration, and life purpose coaching. Browse the Services screen for more details.' },
  { q: 'financial guidance loan credit money finance', a: 'Tshabalala Financial provides NCR-registered credit and loan services with a community-focused approach. Visit the Financial Guidance service page to learn more.' },
  { q: 'hypno hypnotherapy hypnosis', a: 'Hypnotherapy sessions are available for anxiety, stress, phobias, and habit change. Visit the Hypnotherapy service page or book directly from the Booking tab.' },
  { q: 'event events workshop seminar meeting', a: 'Upcoming workshops and events are listed on the **Events** screen. Tap Events from the Home screen or say "open events" and I\'ll take you there! 📆' },
  { q: 'live stream watch broadcast youtube facebook', a: 'You can watch our YouTube or Facebook Live streams directly inside the app. Tap the **Live** button on the Home screen or say "open live" to access the streaming page.' },
  { q: 'contact phone email whatsapp reach', a: 'You can reach us via the **Contact** screen. We\'re available via phone, WhatsApp, and email. Tap Contact from the Services or Home screen.' },
  { q: 'price cost pricing fee charge how much', a: 'Pricing varies by service. Please contact us directly for a quote via the Contact screen, or book a free initial consultation to discuss your needs.' },
  { q: 'location address where durban', a: 'We are based in Durban, South Africa, and offer both in-person and online sessions. Contact us to find out which option suits you best.' },
  { q: 'hours time open available', a: 'Our office hours are generally Monday to Friday, 8:00 AM to 5:00 PM. Contact us to confirm availability for your preferred time.' },
  { q: 'hello hi hey greetings', a: 'Hello! 😊 How can I help you today? You can ask about bookings, services, events, or anything else related to Life Changing Journey.' },
  { q: 'help support assistance', a: 'Sure! Here\'s what I can help you with:\n• Booking a consultation\n• Learning about our services\n• Finding upcoming events\n• Accessing live streams\n• Contacting our team\n\nJust type your question or say "open booking", "open events", etc. to navigate!' },
  { q: 'nyezi foundation npo education', a: 'The Nyezi Vuyani Foundation is our NPO dedicated to supporting rural communities through educational programs and youth empowerment. Visit the Integrated Services page for more.' },
  { q: 'track my booking view bookings appointments', a: 'You can track your bookings and view upcoming or past consultations in **My Bookings**, accessible from your Profile screen. Or say "open my bookings" and I\'ll take you there! 📋' },
  { q: 'price cost pricing fee charge how much psychology therapy session', a: 'Pricing varies by service and session type. Psychology and therapy sessions have different rates; contact us via the Contact screen for current pricing, or book a free initial consultation to discuss your needs and get a quote.' },
  { q: 'online in-person virtual video call zoom session', a: 'We offer both in-person sessions in Durban and online sessions (video call). When you book, you can choose "In-person (Durban)" or "Online session". Many of our psychology and hypnotherapy sessions are available online.' },
  { q: 'how long session duration length appointment', a: 'Session length varies by service — typically 50–60 minutes for psychology and counselling, and 60–90 minutes for hypnotherapy. Your practitioner will confirm duration when you book.' },
  { q: 'first session what to expect first time first appointment', a: 'Your first session is usually an intake or assessment: we get to know you, understand your goals, and plan next steps. It\'s a safe, confidential space. You can ask any questions before committing to further sessions.' },
  { q: 'cancel cancellation reschedule policy refund', a: 'To cancel or reschedule a booking, please contact us directly via WhatsApp or phone (see the Contact screen). We ask for notice where possible so we can offer your slot to someone else.' },
  { q: 'language zulu isizulu afrikaans english', a: 'We serve clients in English and can accommodate isiZulu and other languages where possible. Let us know your preference when you book or contact us.' },
  { q: 'struggling need help not okay feeling low depressed anxious', a: 'It takes courage to reach out. We\'re here for you. You can book a consultation with our psychology team, or say "open contact" to reach us directly. If you\'re in crisis, please call the SA Suicide Crisis Line: 0800 567 567 (24/7).' },
  { q: 'nyezi foundation npo donation donate education youth', a: 'The Nyezi Vuyani Foundation is our NPO supporting rural communities through education and youth empowerment. Visit the Integrated Services page for more, or contact us if you\'d like to donate or get involved.' },
  { q: 'tshabalala omkhulu consulting uber bolt psira sace registration fingerprint', a: 'Tshabalala Omkhulu Consulting offers integrated services: UBER/Bolt/InDrive registration, PSIRA and SACE registration, fingerprint clearance, PDP applications, and more. Visit the Integrated Services or Consulting service page for details.' },
  { q: 'reviews testimonials credentials qualified psychologist', a: 'Our psychologists and practitioners are qualified and registered. You can read more about our team and services on the Services screen. We\'re happy to discuss credentials when you book or contact us.' },
  { q: 'financial loan credit tshabalala omhle ncr', a: 'Tshabalala Omhle Financial Group offers NCR-registered loans and credit (NCRCP20083), including personal loans, soft loans, and business financing. Visit the Financial Guidance service page or contact them directly.' },
  { q: 'hypnotherapy hypnosis habit stress anxiety phobia', a: 'Hypnotherapy is available for stress, anxiety, phobias, habit change, and personal transformation. Sessions are run by our clinical hypnotherapist. Book via the Booking tab or say "I want to book" and I\'ll guide you through.' },
]

// Enhanced keyword matching
function findAnswer(text, currentRoute = null) {
  const lower = text.toLowerCase().trim()
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were']
  const words = lower.split(/\s+/).filter(word => word.length > 2 && !stopWords.includes(word))
  
  const contextKeywords = {
    'Booking': ['book', 'appointment', 'schedule', 'consultation'],
    'Services': ['service', 'therapy', 'counseling', 'treatment'],
    'Events': ['event', 'workshop', 'seminar', 'meeting'],
    'Live': ['live', 'stream', 'watch', 'broadcast'],
  }
  
  let bestMatch = null
  let bestScore = 0
  
  for (const item of FAQ) {
    let score = 0
    const questionKeywords = item.q.toLowerCase().split(/\s+/)
    
    if (lower === item.q.toLowerCase() || lower.includes(item.q.toLowerCase()) || item.q.toLowerCase().includes(lower)) {
      score = 100
    }
    
    for (const word of words) {
      for (const keyword of questionKeywords) {
        if (keyword.includes(word) || word.includes(keyword)) {
          score += 20
        }
        if (word.length >= 3 && keyword.length >= 3) {
          if (keyword.includes(word.substring(0, Math.max(3, word.length - 1))) || 
              word.includes(keyword.substring(0, Math.max(3, keyword.length - 1)))) {
            score += 10
          }
        }
      }
    }
    
    if (currentRoute && contextKeywords[currentRoute]) {
      for (const keyword of contextKeywords[currentRoute]) {
        if (lower.includes(keyword)) {
          for (const qKeyword of questionKeywords) {
            if (qKeyword.includes(keyword) || keyword.includes(qKeyword)) {
              score += 15
            }
          }
        }
      }
    }
    
    if (score > bestScore) {
      bestScore = score
      bestMatch = item
    }
  }
  
  return bestScore >= 20 ? bestMatch?.a : null
}

const TypingIndicator = () => (
  <View style={styles.botBubbleWrap}>
    <View style={[styles.bubble, styles.botBubble, { paddingVertical: 14, paddingHorizontal: 18 }]}>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: 4,
              backgroundColor: Colors.primary,
              opacity: 0.6,
            }}
          />
        ))}
      </View>
    </View>
  </View>
)

const MessageBubble = ({ msg }) => {
  const isUser = msg.role === 'user'
  return (
    <View style={isUser ? styles.userBubbleWrap : styles.botBubbleWrap}>
      {!isUser && (
        <View style={styles.botAvatar}>
          <Ionicons name="sparkles" size={14} color={Colors.white} />
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={[styles.bubbleText, isUser ? styles.userText : styles.botText]}>
          {msg.text}
        </Text>
      </View>
    </View>
  )
}

const INITIAL_BOOKING_STATE = {
  step: 0,
  service: null,
  firstName: '',
  surname: '',
  phone: '',
  email: '',
  date: '',
  time: '',
  sessionType: '',
  notes: '',
}

const ChatbotModal = ({ visible, onClose }) => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    { id: '0', role: 'bot', text: GREETING },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [bookingState, setBookingState] = useState(INITIAL_BOOKING_STATE)
  const flatRef = useRef(null)
  const slideAnim = useRef(new Animated.Value(MODAL_HEIGHT)).current // Start off-screen
  const availableDates = React.useMemo(() => generateAvailableDates(), [])

  // Animate modal in/out
  useEffect(() => {
    if (visible) {
      // Slide up to visible
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      // Slide down off-screen
      Animated.timing(slideAnim, {
        toValue: MODAL_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [visible])

  // Handle minimize/maximize
  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: isMinimized ? MODAL_HEIGHT - MINIMIZED_HEIGHT : 0,
        duration: 250,
        useNativeDriver: true,
      }).start()
    }
  }, [isMinimized, visible])

  const getCurrentRoute = () => {
    try {
      const state = navigation.getState()
      if (!state) return null
      const route = state.routes[state.index]
      if (route.state) {
        const nestedRoute = route.state.routes[route.state.index]
        return nestedRoute?.name || route.name
      }
      return route.name
    } catch (error) {
      return null
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100)
  }

  const resetBooking = () => setBookingState(INITIAL_BOOKING_STATE)

  const handleBookingFlow = async (trimmed) => {
    const lower = trimmed.toLowerCase()
    const cancelPhrases = ['cancel booking', 'cancel']
    if (bookingState.step >= 1 && cancelPhrases.some((p) => lower.includes(p))) {
      resetBooking()
      return { handled: true, botText: 'Booking cancelled. How can I help you today?' }
    }

    const { step, service, firstName, surname, phone, email, date, time, sessionType, notes } = bookingState

    if (step === 1) {
      const match = staticData.services.find(
        (s) => s.title.toLowerCase() === trimmed.toLowerCase() || trimmed.toLowerCase().includes(s.title.toLowerCase())
      )
      if (match) {
        setBookingState((prev) => ({ ...prev, step: 2, service: { id: match.id, title: match.title } }))
        return { handled: true, botText: `Great choice — ${match.title}. What is your first name?` }
      }
      return { handled: true, botText: 'Please choose one of the services above, or say "Cancel booking" to cancel.' }
    }

    if (step === 2) {
      setBookingState((prev) => ({ ...prev, step: 3, firstName: trimmed }))
      return { handled: true, botText: 'And your surname?' }
    }

    if (step === 3) {
      setBookingState((prev) => ({ ...prev, step: 4, surname: trimmed }))
      return { handled: true, botText: 'Your phone number?' }
    }

    if (step === 4) {
      const digits = trimmed.replace(/\D/g, '')
      if (digits.length < 10) {
        return { handled: true, botText: 'Please enter a valid phone number (at least 10 digits).' }
      }
      setBookingState((prev) => ({ ...prev, step: 5, phone: trimmed.trim() }))
      const prefill = user?.email ?? user?.user_metadata?.email ?? ''
      const askEmail = prefill
        ? `Your email? (We have ${prefill} — type it again or something else if different)`
        : 'Your email address?'
      return { handled: true, botText: askEmail }
    }

    if (step === 5) {
      if (!trimmed.includes('@') || trimmed.length < 5) {
        return { handled: true, botText: 'Please enter a valid email address.' }
      }
      setBookingState((prev) => ({ ...prev, step: 6, email: trimmed.trim() }))
      return { handled: true, botText: 'Which date works for you? (Tap one of the options below)' }
    }

    if (step === 6) {
      const dateMatch = availableDates.find(
        (d) => d.label.toLowerCase() === trimmed.toLowerCase() || d.dateStr.toLowerCase() === trimmed.toLowerCase()
      )
      if (dateMatch) {
        setBookingState((prev) => ({ ...prev, step: 7, date: dateMatch.dateStr }))
        return { handled: true, botText: 'What time works for you? (Tap a time below)' }
      }
      return { handled: true, botText: 'Please tap one of the date options below.' }
    }

    if (step === 7) {
      const timeMatch = BOOKING_TIMES.find((t) => trimmed.includes(t) || t === trimmed.trim())
      if (timeMatch) {
        setBookingState((prev) => ({ ...prev, step: 8, time: timeMatch }))
        return { handled: true, botText: 'In-person (Durban) or online session? (Tap one below)' }
      }
      return { handled: true, botText: 'Please tap one of the time options below.' }
    }

    if (step === 8) {
      if (lower.includes('in-person') || lower.includes('durban')) {
        setBookingState((prev) => ({ ...prev, step: 9, sessionType: 'In-person' }))
        return { handled: true, botText: 'Any notes for the practitioner? (optional — or tap "Skip (no notes)")' }
      }
      if (lower.includes('online')) {
        setBookingState((prev) => ({ ...prev, step: 9, sessionType: 'Online' }))
        return { handled: true, botText: 'Any notes for the practitioner? (optional — or tap "Skip (no notes)")' }
      }
      return { handled: true, botText: 'Please choose "In-person (Durban)" or "Online session".' }
    }

    if (step === 9) {
      const notesValue = lower.includes('skip') || lower.includes('no notes') ? '' : trimmed
      setBookingState((prev) => ({ ...prev, step: 10, notes: notesValue }))
      const summary = `Please confirm:\n• ${service?.title}\n• ${firstName} ${surname}\n• ${phone}\n• ${email}\n• ${date} at ${time}\n• ${sessionType || '(session type)'}\n${notesValue ? `• Notes: ${notesValue}` : ''}\n\nTap "Confirm Booking ✓" to submit, or "Cancel" to cancel.`
      return { handled: true, botText: summary }
    }

    if (step === 10) {
      if (lower.includes('confirm') || trimmed.includes('✓')) {
        const userId = user?.id ?? user?.user?.id ?? 'guest'
        const userEmail = bookingState.email || (user?.email ?? user?.user_metadata?.email ?? '')
        try {
          await createBooking({
            userId,
            userEmail,
            name: bookingState.firstName,
            surname: bookingState.surname,
            phone: bookingState.phone,
            email: bookingState.email,
            serviceId: bookingState.service?.id,
            serviceTitle: bookingState.service?.title,
            date: bookingState.date,
            time: bookingState.time,
            status: 'pending',
            notes: bookingState.notes || null,
          })
          resetBooking()
          return {
            handled: true,
            botText: 'Booking confirmed! Our team will be in touch to confirm. You can also view it under My Bookings. Say "open my bookings" to go there.',
          }
        } catch (e) {
          const msg = e?.message || 'Something went wrong. Please try again or contact us directly.'
          return { handled: true, botText: `We couldn't save your booking: ${msg}` }
        }
      }
      if (lower.includes('cancel')) {
        resetBooking()
        return { handled: true, botText: 'Booking cancelled. How can I help you today?' }
      }
      return { handled: true, botText: 'Tap "Confirm Booking ✓" to submit or "Cancel" to cancel.' }
    }

    return { handled: false }
  }

  const getContextualChips = () => {
    const { step } = bookingState
    if (step === 0) {
      return ['How do I book?', 'What services do you offer?', 'Tell me about events', 'How do I watch live streams?', 'Contact details']
    }
    if (step === 1) {
      return staticData.services.map((s) => s.title)
    }
    if (step >= 2 && step <= 5) {
      return ['Cancel booking']
    }
    if (step === 6) {
      return availableDates.map((d) => d.label)
    }
    if (step === 7) {
      return [...BOOKING_TIMES]
    }
    if (step === 8) {
      return ['In-person (Durban)', 'Online session']
    }
    if (step === 9) {
      return ['Skip (no notes)', 'Cancel booking']
    }
    if (step === 10) {
      return ['Confirm Booking ✓', 'Cancel']
    }
    return ['How do I book?', 'Contact details']
  }

  useEffect(() => {
    if (visible && !isMinimized) {
      scrollToBottom()
    }
  }, [messages, typing, visible, isMinimized])

  const sendMessage = (text) => {
    const trimmed = (text || input).trim()
    if (!trimmed) return
    setInput('')
    if (isMinimized) setIsMinimized(false)

    const userMsg = { id: Date.now().toString(), role: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setTyping(true)

    const lower = trimmed.toLowerCase()
    const currentRoute = getCurrentRoute()
    const currentStep = bookingState.step

    // 1. Crisis — instant response, no delay
    if (isCrisis(trimmed)) {
      setTyping(false)
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'bot', text: CRISIS_RESPONSE }])
      return
    }

    const delay = 900 + Math.random() * 500
    setTimeout(async () => {
      // 2. Already in booking flow — handle next step
      if (currentStep > 0) {
        const result = await handleBookingFlow(trimmed)
        if (result.handled) {
          setTyping(false)
          setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'bot', text: result.botText }])
          return
        }
      }

      // 3. Start booking flow when user says they want to book (step 0)
      const bookIntent = /book|appointment|schedule|consultation|i want to book|id like to book/.test(lower)
      if (currentStep === 0 && bookIntent) {
        setBookingState((prev) => ({ ...INITIAL_BOOKING_STATE, step: 1 }))
        setTyping(false)
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: 'bot', text: 'Which service are you booking for? (Tap one of the options below)' },
        ])
        return
      }

      // 4. Navigation commands
      if (lower.includes('open booking') || lower.includes('go to booking') || lower.includes('show booking') || lower.includes('take me to booking')) {
        navigation.navigate('Booking')
        setTyping(false)
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'bot', text: 'Opening the Booking screen for you! 📅' }])
        return
      }
      if (lower.includes('open events') || lower.includes('show events') || lower.includes('go to events') || lower.includes('take me to events')) {
        navigation.navigate('Events')
        setTyping(false)
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'bot', text: 'Opening the Events screen! 📆' }])
        return
      }
      if (lower.includes('open services') || lower.includes('show services') || lower.includes('go to services')) {
        navigation.navigate('Services')
        setTyping(false)
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'bot', text: 'Opening the Services screen! 🧠' }])
        return
      }
      if (lower.includes('my bookings') || lower.includes('view bookings') || lower.includes('open my bookings') || lower.includes('show my bookings')) {
        navigation.navigate('MyBookings')
        setTyping(false)
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'bot', text: 'Opening your bookings! 📋' }])
        return
      }
      if (lower.includes('open live') || lower.includes('show live') || lower.includes('go to live') || lower.includes('watch live')) {
        navigation.navigate('Live')
        setTyping(false)
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'bot', text: 'Opening the Live stream screen! 📺' }])
        return
      }

      // 5. FAQ or fallback
      const answer =
        findAnswer(trimmed, currentRoute) ||
        'I\'m not sure about that one. For the best help, please contact our team directly via the **Contact** screen or WhatsApp. We\'d love to assist! 😊\n\nYou can also try saying "open booking", "open events", or "open services" to navigate directly!'
      setTyping(false)
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'bot', text: answer }])
    }, delay)
  }

  if (!visible) return null

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
              height: isMinimized ? MINIMIZED_HEIGHT : MODAL_HEIGHT,
            },
          ]}
        >
          {/* Header */}
          <TouchableOpacity
            style={styles.header}
            onPress={() => setIsMinimized(!isMinimized)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={Colors.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              <View style={styles.headerContent}>
                <View style={styles.headerLeft}>
                  <Image
                    source={require('../../../assets/chatbot.png')}
                    style={styles.headerIcon}
                    resizeMode="contain"
                  />
                  <View>
                    <Text style={styles.headerTitle}>LCJ Assistant</Text>
                    {!isMinimized && (
                      <Text style={styles.headerSubtitle}>Always here to help</Text>
                    )}
                  </View>
                </View>
                <View style={styles.headerActions}>
                  <TouchableOpacity
                    onPress={() => setIsMinimized(!isMinimized)}
                    style={styles.headerButton}
                  >
                    <Ionicons
                      name={isMinimized ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color={Colors.white}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.headerButton}
                  >
                    <Ionicons name="close" size={20} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {!isMinimized && (
            <View style={styles.chatWrapper}>
              {/* Message List */}
              <FlatList
                ref={flatRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <MessageBubble msg={item} />}
                contentContainerStyle={styles.messageList}
                ListFooterComponent={typing ? <TypingIndicator /> : null}
                onContentSizeChange={() => {
                  setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100)
                }}
                keyboardShouldPersistTaps="handled"
                style={styles.messageListContainer}
              />

              {/* Quick Replies */}
              <View style={styles.quickRepliesContainer}>
                <FlatList
                  horizontal
                  data={getContextualChips()}
                  keyExtractor={(item) => item}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.quickReply}
                      onPress={() => sendMessage(item)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.quickReplyText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>

              {/* Input Bar */}
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
              >
                <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor={Colors.textMuted || '#9CA3AF'}
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={() => sendMessage()}
                    returnKeyType="send"
                    multiline={false}
                  />
                  <TouchableOpacity
                    style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
                    onPress={() => sendMessage()}
                    disabled={!input.trim()}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="send" size={18} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 16,
    flexDirection: 'column',
  },
  header: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  headerGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerIcon: {
    width: 32,
    height: 32,
    marginRight: 0,
  },
  headerTitle: {
    ...Typography.textStyles?.h6,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatWrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  messageListContainer: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  botBubbleWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    gap: 8,
  },
  userBubbleWrap: {
    flexDirection: 'row-reverse',
    marginBottom: 12,
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  botText: {
    color: '#1F2937',
  },
  userText: {
    color: '#FFFFFF',
  },
  quickRepliesContainer: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    flexShrink: 0,
  },
  quickReply: {
    backgroundColor: Colors.primary + '15',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  quickReplyText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '500',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 10,
    minHeight: 60,
    flexShrink: 0,
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#D1D5DB',
  },
})

export default ChatbotModal
