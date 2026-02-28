// Chatbot Agent Screen - AI Assistant for Life Changing Journey
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigationState } from '@react-navigation/native'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'

const GREETING = `Hi! 👋 Welcome to Life Changing Journey. I'm your assistant — here to help you find what you need.

You can ask me about:
• 📅 Booking a consultation
• 🧠 Psychology & mental wellness services
• 🙏 Spiritual growth programs
• 💰 Financial guidance
• 🌀 Hypnotherapy
• 📆 Upcoming events
• 📺 Live streams`

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
]

const QUICK_REPLIES = [
  'How do I book?',
  'What services do you offer?',
  'Tell me about events',
  'How do I watch live streams?',
  'Contact details',
]

// Enhanced keyword matching with fuzzy matching and multiple keywords
function findAnswer(text, currentRoute = null) {
  const lower = text.toLowerCase().trim()
  
  // Remove common words for better matching
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were']
  const words = lower.split(/\s+/).filter(word => word.length > 2 && !stopWords.includes(word))
  
  // Context-aware matching based on current route
  const contextKeywords = {
    'Booking': ['book', 'appointment', 'schedule', 'consultation'],
    'Services': ['service', 'therapy', 'counseling', 'treatment'],
    'Events': ['event', 'workshop', 'seminar', 'meeting'],
    'Live': ['live', 'stream', 'watch', 'broadcast'],
  }
  
  // Score-based matching
  let bestMatch = null
  let bestScore = 0
  
  for (const item of FAQ) {
    let score = 0
    const questionKeywords = item.q.toLowerCase().split(/\s+/)
    
    // Exact match gets highest score
    if (lower === item.q.toLowerCase() || lower.includes(item.q.toLowerCase()) || item.q.toLowerCase().includes(lower)) {
      score = 100
    }
    
    // Word-by-word matching
    for (const word of words) {
      for (const keyword of questionKeywords) {
        if (keyword.includes(word) || word.includes(keyword)) {
          score += 20
        }
        // Partial word match
        if (word.length >= 3 && keyword.length >= 3) {
          if (keyword.includes(word.substring(0, Math.max(3, word.length - 1))) || 
              word.includes(keyword.substring(0, Math.max(3, keyword.length - 1)))) {
            score += 10
          }
        }
      }
    }
    
    // Context boost
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
  
  // Only return if score is above threshold
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

const ChatbotScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const navigationState = useNavigationState(state => state)
  const [messages, setMessages] = useState([
    { id: '0', role: 'bot', text: GREETING },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const flatRef = useRef(null)
  
  // Get current route for context
  const getCurrentRoute = () => {
    if (!navigationState) return null
    const route = navigationState.routes[navigationState.index]
    // If we're in a nested navigator, get the active route
    if (route.state) {
      const nestedRoute = route.state.routes[route.state.index]
      return nestedRoute?.name || route.name
    }
    return route.name
  }

  const scrollToBottom = () => {
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, typing])

  const sendMessage = (text) => {
    const trimmed = (text || input).trim()
    if (!trimmed) return
    setInput('')

    const userMsg = { id: Date.now().toString(), role: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setTyping(true)

    // Get current route for context
    const currentRoute = getCurrentRoute()

    setTimeout(() => {
      const lower = trimmed.toLowerCase()
      
      // Check for navigation commands
      if (lower.includes('open booking') || lower.includes('go to booking') || lower.includes('show booking') || lower.includes('take me to booking')) {
        navigation.navigate('Booking')
        const botMsg = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          text: 'Opening the Booking screen for you! 📅',
        }
        setTyping(false)
        setMessages((prev) => [...prev, botMsg])
        return
      }
      
      if (lower.includes('open events') || lower.includes('show events') || lower.includes('go to events') || lower.includes('take me to events')) {
        navigation.navigate('Events')
        const botMsg = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          text: 'Opening the Events screen! 📆',
        }
        setTyping(false)
        setMessages((prev) => [...prev, botMsg])
        return
      }
      
      if (lower.includes('open services') || lower.includes('show services') || lower.includes('go to services')) {
        navigation.navigate('Services')
        const botMsg = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          text: 'Opening the Services screen! 🧠',
        }
        setTyping(false)
        setMessages((prev) => [...prev, botMsg])
        return
      }
      
      if (lower.includes('my bookings') || lower.includes('view bookings') || lower.includes('open my bookings') || lower.includes('show my bookings')) {
        navigation.navigate('MyBookings')
        const botMsg = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          text: 'Opening your bookings! 📋',
        }
        setTyping(false)
        setMessages((prev) => [...prev, botMsg])
        return
      }
      
      if (lower.includes('open live') || lower.includes('show live') || lower.includes('go to live') || lower.includes('watch live')) {
        navigation.navigate('Live')
        const botMsg = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          text: 'Opening the Live stream screen! 📺',
        }
        setTyping(false)
        setMessages((prev) => [...prev, botMsg])
        return
      }

      // Use enhanced findAnswer with context
      const answer = findAnswer(trimmed, currentRoute) ||
        'I\'m not sure about that one. For the best help, please contact our team directly via the **Contact** screen or WhatsApp. We\'d love to assist! 😊\n\nYou can also try saying "open booking", "open events", or "open services" to navigate directly!'

      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: answer,
      }
      setTyping(false)
      setMessages((prev) => [...prev, botMsg])
    }, 900 + Math.random() * 500)
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient
        colors={Colors.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Ionicons name="sparkles" size={20} color={Colors.white} />
          </View>
          <View>
            <Text style={styles.headerTitle}>LCJ Assistant</Text>
            <Text style={styles.headerSubtitle}>Always here to help</Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Message List */}
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble msg={item} />}
          contentContainerStyle={styles.messageList}
          ListFooterComponent={typing ? <TypingIndicator /> : null}
          onContentSizeChange={scrollToBottom}
        />

        {/* Quick Replies */}
        <View style={styles.quickRepliesContainer}>
          <FlatList
            horizontal
            data={QUICK_REPLIES}
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.textStyles?.h6,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
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

export default ChatbotScreen
