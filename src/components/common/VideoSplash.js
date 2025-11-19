// Video-based splash/loader shown on app launch
import React from 'react'
import { View, StyleSheet, Pressable, ActivityIndicator, Platform } from 'react-native'
import { Colors } from '../../styles/colors'
let VideoView = null
let useVideoPlayer = null
let Asset = null
try {
  // Prefer expo-video (new API)
  const videoMod = require('expo-video')
  VideoView = videoMod.VideoView
  useVideoPlayer = videoMod.useVideoPlayer
  Asset = require('expo-asset').Asset
} catch (e) {
  VideoView = null
  useVideoPlayer = null
  Asset = null
}

const VideoSplash = ({ source, onFinish, backgroundColor = '#000', minimumMs = 1200, poster }) => {
  const [finished, setFinished] = React.useState(false)
  const [fallback, setFallback] = React.useState(!VideoView || !useVideoPlayer || !source)
  const [started, setStarted] = React.useState(false)
  const [resolvedSrc, setResolvedSrc] = React.useState(null)

  React.useEffect(() => {
    const t = setTimeout(() => setFinished(true), minimumMs)
    return () => clearTimeout(t)
  }, [minimumMs])

  const complete = React.useCallback(() => {
    if (finished && typeof onFinish === 'function') {
      onFinish()
    } else {
      // ensure minimum duration
      const t = setTimeout(() => typeof onFinish === 'function' && onFinish(), Math.max(0, 200))
      return () => clearTimeout(t)
    }
  }, [finished, onFinish])

  // Watchdog: if video fails to start within 2500ms, dismiss to avoid a black screen
  React.useEffect(() => {
    const watchdog = setTimeout(() => {
      if (!started) {
        complete()
      }
    }, Math.max(minimumMs, 2500))
    return () => clearTimeout(watchdog)
  }, [started, minimumMs, complete])

  // Resolve module asset -> URI (especially needed on web)
  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        if (!source) {
          setResolvedSrc(null)
          return
        }
        if (typeof source === 'number' && Asset) {
          const assetArr = await Asset.loadAsync(source)
          const a = Array.isArray(assetArr) ? assetArr[0] : assetArr
          const uri = a?.localUri || a?.uri
          if (mounted) setResolvedSrc(uri ? { uri } : null)
        } else {
          setResolvedSrc(source)
        }
      } catch (err) {
        setResolvedSrc(null)
        setFallback(true)
      }
    })()
    return () => { mounted = false }
  }, [source])

  if (fallback) {
    return (
      <Pressable onPress={complete} style={({ pressed }) => [styles.container, { backgroundColor, opacity: pressed ? 0.92 : 1 }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </Pressable>
    )
  }

  const player = useVideoPlayer(resolvedSrc || source, (player) => {
    player.play();
    player.muted = true;
    player.loop = false;
  })

  React.useEffect(() => {
    if (!player) return;

    const subscription = player.addListener('playingChange', (event) => {
      if (event.isPlaying && !started) {
        setStarted(true);
      }
    });

    const statusSubscription = player.addListener('statusChange', (event) => {
      if (event.status === 'readyToPlay' && event.oldStatus === 'loading') {
        setStarted(true);
      }
    });

    return () => {
      subscription.remove();
      statusSubscription.remove();
    };
  }, [player, started]);

  // Listen for video end
  React.useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      if (player.currentTime >= player.duration && player.duration > 0) {
        complete();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [player, complete]);

  return (
    <Pressable onPress={complete} style={({ pressed }) => [styles.container, { backgroundColor, opacity: pressed ? 0.98 : 1 }]}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        contentFit={Platform.OS === 'web' ? 'contain' : 'cover'}
        nativeControls={false}
        poster={poster}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
})

export default VideoSplash
