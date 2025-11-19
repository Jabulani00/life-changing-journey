// Error boundary for catching render errors in Life Changing Journey App
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../styles/colors';
import { Typography } from '../styles/typography';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.errorCard}>
            <Text style={styles.title}>Something went wrong</Text>
            
            <Text style={styles.errorMessage}>
              {this.state.error?.toString() || 'An unexpected error occurred'}
            </Text>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={this.resetError}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  errorCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(1, 38, 48, 0.1)',
    elevation: 4,
  },
  title: {
    ...Typography.textStyles.h2,
    color: Colors.error,
    marginBottom: 16,
    fontFamily: 'Poppins_600',
  },
  errorMessage: {
    ...Typography.textStyles.body,
    color: Colors.text,
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'Poppins_400',
  },
  button: {
    backgroundColor: Colors.brandAccent,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  buttonText: {
    ...Typography.textStyles.button,
    color: Colors.white,
    fontFamily: 'Poppins_600',
  }
});

export default ErrorBoundary;
