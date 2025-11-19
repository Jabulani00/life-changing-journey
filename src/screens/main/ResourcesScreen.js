// Connect Screen - Life Changing Journey social links hub (renamed from Resources)
import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput, Linking, Image } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'
import { staticData } from '../../utils/staticData'
import { fetchYouTubeChannelVideos, fetchYouTubeVideosByHandle } from '../../utils/networkUtils'

const ResourcesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('social') // 'social' | 'podcasts'

  const links = [
    { id: 'facebook', title: 'Facebook', icon: 'logo-facebook', color: '#1877F2', url: 'https://www.facebook.com/share/1B7sqUfweq/' },
    { id: 'instagram', title: 'Instagram', icon: 'logo-instagram', color: '#E1306C', url: 'https://www.instagram.com/lifechanging_journey?igsh=ZjF5ZjBoZWU1NXQx' },
    { id: 'youtube', title: 'YouTube', icon: 'logo-youtube', color: '#FF0000', url: 'https://www.youtube.com/@lifechangingjourney-h4j' },
    { id: 'tiktok', title: 'TikTok', icon: 'logo-tiktok', color: '#000000', url: 'https://www.tiktok.com/@lifechangingjourney' },
    { id: 'website', title: 'Website', icon: 'globe-outline', color: Colors.primary, url: 'https://lifechangingjourney.co.za' },
    { id: 'whatsapp', title: 'WhatsApp', icon: 'logo-whatsapp', color: '#25D366', url: 'https://wa.me/27310350208' },
  ]

  const filteredLinks = links.filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()))

  // Simple podcast model for display
  const podcast = {
    title: 'Life Changing Journey Podcast',
    host: 'Vuyani Nyezi',
    subscribers: 425,
    videos: 38,
    channelUrl: 'https://www.youtube.com/@lifechangingjourney-h4j',
    latestEpisode: {
      title: 'Kungenzeka Inkinga Isengqondweni',
      date: '2025-09-21',
      summary: 'thola usizo kusanesikhathi. Ukuqonda izinkinga zengqondo... ',
      videoUrl: 'https://www.youtube.com/@lifechangingjourney-h4j/videos'
    },
  }

  const [videos, setVideos] = useState([])
  const [loadingVideos, setLoadingVideos] = useState(true)
  React.useEffect(() => {
    const channelId = 'UC1ZDnejClU8G4J8gNwHoByQ'
    const handle = '@lifechangingjourney-h4j'
    let cancelled = false
    setLoadingVideos(true)
    ;(async () => {
      try {
        // Try handle first (more robust if channelId changes)
        const byHandle = await fetchYouTubeVideosByHandle(handle, 6)
        if (!cancelled && Array.isArray(byHandle) && byHandle.length) {
          setVideos(byHandle)
          setLoadingVideos(false)
          return
        }
        // Fallback to channel id
        const byChannel = await fetchYouTubeChannelVideos(channelId, 6)
        if (!cancelled) {
          setVideos(byChannel)
          setLoadingVideos(false)
        }
      } catch (error) {
        // Silently handle error - show fallback UI
        if (!cancelled) {
          setVideos([])
          setLoadingVideos(false)
        }
      }
    })()
    return () => { cancelled = true }
  }, [])

  const LinkButton = ({ link }) => (
    <TouchableOpacity
      style={{
        width: '48%',
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.lightGray,
        shadowColor: Colors.shadow.light,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
      }}
      onPress={() => Linking.openURL(link.url)}
      activeOpacity={0.9}
    >
      <View style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: link.color + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <Ionicons name={link.icon} size={20} color={link.color} />
      </View>
        <Text style={{
          ...Typography.textStyles.captionBold,
        color: Colors.textPrimary,
        }}>
        {link.title}
        </Text>
    </TouchableOpacity>
  )

  const FeaturedSection = () => {
    const featuredResources = staticData.resources.filter(r => r.featured).slice(0, 3)
    
    return (
      <View style={{ marginBottom: 24 }}>
        <Text style={{
          ...Typography.textStyles.h5,
          color: Colors.textPrimary,
          marginBottom: 16,
        }}>
          Featured Resources
        </Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4 }}
        >
          {featuredResources.map((resource) => (
            <View key={resource.id} style={{ width: 280, marginRight: 16 }}>
              <ResourceCard 
                resource={resource}
                variant="featured"
                onPress={() => {
                  // Handle resource access
                }}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    )
  }

  const StatsCard = ({ icon, count, label, color }) => (
    <View style={{
      backgroundColor: Colors.surface,
      borderRadius: 16,
      padding: 16,
      flex: 1,
      alignItems: 'center',
      marginHorizontal: 4,
      shadowColor: Colors.shadow.light,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }}>
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: color + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={{
        ...Typography.textStyles.h4,
        color: Colors.textPrimary,
        marginBottom: 4,
      }}>
        {count}
      </Text>
      <Text style={{
        ...Typography.textStyles.caption,
        color: Colors.textSecondary,
        textAlign: 'center',
      }}>
        {label}
      </Text>
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style="light" />
      
      {/* Header */}
      <LinearGradient
        colors={Colors.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: 50,
          paddingBottom: 24,
          paddingHorizontal: 16,
        }}
      >
        <Text style={{
          ...Typography.textStyles.h2,
          color: Colors.white,
          marginBottom: 8,
        }}>
          Connect & Follow
        </Text>
        <Text style={{
          ...Typography.textStyles.bodySmall,
          color: Colors.white,
          opacity: 0.9,
          marginBottom: 16,
        }}>
          Follow our social media and listen to our podcasts
        </Text>
        
        {/* Search Bar */}
        <View style={{
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}>
          <Ionicons name="search" size={20} color={Colors.white} style={{ marginRight: 12 }} />
          <TextInput
            style={{
              flex: 1,
              color: Colors.white,
              ...Typography.textStyles.bodySmall,
            }}
            placeholder={activeTab === 'social' ? 'Search social platforms...' : 'Search episodes...'}
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={{ paddingHorizontal: 16, backgroundColor: Colors.background }}>
      <View style={{
        flexDirection: 'row',
          alignItems: 'center',
          marginTop: -16,
          backgroundColor: Colors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: Colors.lightGray,
          overflow: 'hidden',
        }}>
          <TouchableOpacity
            onPress={() => setActiveTab('social')}
            style={{
              flex: 1,
              paddingVertical: 12,
              alignItems: 'center',
              borderRightWidth: 1,
              borderRightColor: Colors.lightGray,
              backgroundColor: activeTab === 'social' ? Colors.primary + '08' : 'transparent',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="share-social-outline" size={18} color={activeTab === 'social' ? Colors.primary : Colors.textSecondary} />
              <Text style={{
                ...Typography.textStyles.bodySmall,
                color: activeTab === 'social' ? Colors.primary : Colors.textSecondary,
                fontWeight: activeTab === 'social' ? Typography.fontWeight.semiBold : 'normal',
                marginLeft: 6,
              }}>
                Social Media
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('podcasts')}
            style={{
              flex: 1,
              paddingVertical: 12,
              alignItems: 'center',
              backgroundColor: activeTab === 'podcasts' ? Colors.primary + '08' : 'transparent',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="headset-outline" size={18} color={activeTab === 'podcasts' ? Colors.primary : Colors.textSecondary} />
              <Text style={{
                ...Typography.textStyles.bodySmall,
                color: activeTab === 'podcasts' ? Colors.primary : Colors.textSecondary,
                fontWeight: activeTab === 'podcasts' ? Typography.fontWeight.semiBold : 'normal',
                marginLeft: 6,
              }}>
                Podcasts
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ height: 2, backgroundColor: Colors.lightGray, marginTop: 8 }} />
      </View>

      {/* Intro blurb */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
        <Text style={{
          ...Typography.textStyles.bodySmall,
          color: Colors.textSecondary,
          textAlign: 'center',
        }}>
          Connect with our community, get updates on services and events, and reach out directly via your preferred platform.
        </Text>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="always"
      >
        {activeTab === 'social' ? (
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{
            ...Typography.textStyles.h5,
            color: Colors.textPrimary,
            marginBottom: 16,
          }}>
              Social Platforms
            {searchQuery && ` for "${searchQuery}"`}
          </Text>

            {filteredLinks.length === 0 ? (
            <View style={{
              backgroundColor: Colors.surface,
              borderRadius: 16,
              padding: 24,
              alignItems: 'center',
              marginTop: 32,
            }}>
              <Ionicons name="search" size={48} color={Colors.textSecondary} style={{ marginBottom: 16 }} />
              <Text style={{
                ...Typography.textStyles.h6,
                color: Colors.textPrimary,
                marginBottom: 8,
                textAlign: 'center',
              }}>
                  No platforms found
              </Text>
              <Text style={{
                ...Typography.textStyles.bodySmall,
                color: Colors.textSecondary,
                textAlign: 'center',
              }}>
                  Try searching a different platform name
              </Text>
            </View>
          ) : (
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
                {filteredLinks.map((link) => (
                  <LinkButton key={link.id} link={link} />
              ))}
            </View>
          )}
        </View>
        ) : (
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={{
              ...Typography.textStyles.h5,
              color: Colors.textPrimary,
              marginBottom: 12,
            }}>
              Our Podcasts
            </Text>

        <View style={{
          backgroundColor: Colors.surface,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: Colors.lightGray,
              shadowColor: Colors.shadow.light,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 6,
              elevation: 2,
              marginBottom: 16,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Image 
                  source={require('../../../assets/icon.png')}
                  style={{ width: 44, height: 44, borderRadius: 22, marginRight: 12 }}
                  resizeMode="contain"
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ ...Typography.textStyles.h6, color: Colors.textPrimary }}>
                    {podcast.title}
                  </Text>
                  <Text style={{ ...Typography.textStyles.caption, color: Colors.textSecondary }}>
                    Hosted by {podcast.host}
                  </Text>
                </View>
                <Text style={{ ...Typography.textStyles.caption, color: Colors.textSecondary }}>
                  {podcast.videos} episodes
                </Text>
              </View>

              <Text style={{ ...Typography.textStyles.bodySmall, color: Colors.textSecondary, marginBottom: 12 }}>
                Weekly conversations about mental wellness, spiritual growth, and personal transformation
              </Text>

              <Text style={{ ...Typography.textStyles.caption, color: Colors.textLight, marginBottom: 12 }}>
                {podcast.subscribers} subscribers • {podcast.videos} videos
              </Text>

              <TouchableOpacity onPress={() => Linking.openURL(podcast.channelUrl)} activeOpacity={0.9}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ ...Typography.textStyles.bodySmall, color: Colors.primary, fontWeight: Typography.fontWeight.semiBold }}>
                    Listen on YouTube
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color={Colors.primary} style={{ marginLeft: 6 }} />
                </View>
              </TouchableOpacity>

              {/* Latest episode (from YouTube feed if available) */}
              <Text style={{ ...Typography.textStyles.h6, color: Colors.textPrimary, marginTop: 16, marginBottom: 8 }}>
                Latest Episode
              </Text>
              {loadingVideos ? (
                <View style={{
                  backgroundColor: Colors.surfaceSecondary,
                  borderRadius: 12,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: Colors.lightGray,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 90,
                }}>
                  <Text style={{ ...Typography.textStyles.caption, color: Colors.textSecondary }}>
                    Loading latest videos...
                  </Text>
                </View>
              ) : (videos[0]) ? (
                <TouchableOpacity
                  onPress={() => Linking.openURL(videos[0].link)}
                  activeOpacity={0.9}
                  style={{
                    backgroundColor: Colors.surfaceSecondary,
                    borderRadius: 12,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: Colors.lightGray,
                  }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: 110, height: 70, borderRadius: 8, overflow: 'hidden', marginRight: 12 }}>
                      <Image source={{ uri: videos[0].thumbnail }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                      {typeof videos[0].durationSeconds === 'number' && (
                        <View style={{ position: 'absolute', right: 6, bottom: 6, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                          <Text style={{ ...Typography.textStyles.caption, color: '#fff' }}>
                            {`${Math.floor(videos[0].durationSeconds/60)}:${String(videos[0].durationSeconds%60).padStart(2,'0')}`}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                        <Ionicons name="play-circle" size={20} color={Colors.primary} />
                        <Text numberOfLines={2} style={{ ...Typography.textStyles.bodySmall, color: Colors.textPrimary, marginLeft: 8, flex: 1 }}>
                          {videos[0].title}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ ...Typography.textStyles.caption, color: Colors.textSecondary }}>
                          {new Date(videos[0].published).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </Text>
                        {typeof videos[0].views === 'number' && (
                          <Text style={{ ...Typography.textStyles.caption, color: Colors.textSecondary }}>
                            {Intl.NumberFormat('en', { notation: 'compact' }).format(videos[0].views)} views
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => Linking.openURL(podcast.channelUrl)}
                  activeOpacity={0.9}
                  style={{
                    backgroundColor: Colors.surfaceSecondary,
                    borderRadius: 12,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: Colors.lightGray,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Ionicons name="play-circle" size={20} color={Colors.primary} />
                    <Text numberOfLines={1} style={{ ...Typography.textStyles.bodySmall, color: Colors.textPrimary, marginLeft: 8, flex: 1 }}>
                      Listen on YouTube
                    </Text>
                  </View>
                  <Text style={{ ...Typography.textStyles.caption, color: Colors.textSecondary }}>
                    Tap to view latest episodes on YouTube
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Recent two videos (excluding latest) */}
            {videos.length > 1 && (
              <View style={{ marginTop: 8, marginBottom: 16 }}>
                <Text style={{ ...Typography.textStyles.h6, color: Colors.textPrimary, marginBottom: 8 }}>
                  Recent Videos
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  {videos.slice(1, 3).map((v) => (
                    <TouchableOpacity
                      key={v.id}
                      onPress={() => Linking.openURL(v.link)}
                      style={{ width: '48%', backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.lightGray, marginBottom: 12, overflow: 'hidden' }}
                      activeOpacity={0.9}
                    >
                      <View>
                        <Image source={{ uri: v.thumbnail }} style={{ width: '100%', height: 100 }} resizeMode="cover" />
                        {typeof v.durationSeconds === 'number' && (
                          <View style={{ position: 'absolute', right: 6, bottom: 6, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                            <Text style={{ ...Typography.textStyles.caption, color: '#fff' }}>
                              {`${Math.floor(v.durationSeconds/60)}:${String(v.durationSeconds%60).padStart(2,'0')}`}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View style={{ padding: 8 }}>
                        <Text numberOfLines={2} style={{ ...Typography.textStyles.captionBold, color: Colors.textPrimary }}>
                          {v.title}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                          <Text style={{ ...Typography.textStyles.caption, color: Colors.textSecondary }}>
                            {new Date(v.published).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </Text>
                          {typeof v.views === 'number' && (
                            <Text style={{ ...Typography.textStyles.caption, color: Colors.textSecondary }}>
                              {Intl.NumberFormat('en', { notation: 'compact' }).format(v.views)} views
                            </Text>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Contact options */}
        <View style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingTop: 16,
          gap: 12,
          marginBottom: 32,
        }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: Colors.surface,
              borderRadius: 16,
              padding: 16,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: Colors.lightGray,
            }}
            onPress={() => Linking.openURL('tel:+27310350208')}
            activeOpacity={0.95}
          >
            <Ionicons name="call-outline" size={24} color={Colors.primary} style={{ marginBottom: 8 }} />
            <Text style={{
              ...Typography.textStyles.captionBold,
              color: Colors.textPrimary,
            }}>
              Call Us
            </Text>
          </TouchableOpacity>
            <TouchableOpacity
              style={{
              flex: 1,
              backgroundColor: Colors.surface,
              borderRadius: 16,
              padding: 16,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: Colors.lightGray,
            }}
            onPress={() => Linking.openURL('https://wa.me/27310350208')}
            activeOpacity={0.95}
          >
            <Ionicons name="logo-whatsapp" size={24} color={'#25D366'} style={{ marginBottom: 8 }} />
              <Text style={{
              ...Typography.textStyles.captionBold,
              color: Colors.textPrimary,
              }}>
              WhatsApp
              </Text>
            </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingTop: 16,
          gap: 12,
        }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: Colors.surface,
              borderRadius: 16,
              padding: 16,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: Colors.lightGray,
            }}
            onPress={() => navigation.navigate('Bookmarks')}
            activeOpacity={0.95}
          >
            <Ionicons name="bookmark-outline" size={24} color={Colors.primary} style={{ marginBottom: 8 }} />
            <Text style={{
              ...Typography.textStyles.captionBold,
              color: Colors.textPrimary,
            }}>
              Bookmarks
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: Colors.surface,
              borderRadius: 16,
              padding: 16,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: Colors.lightGray,
            }}
            onPress={() => navigation.navigate('Downloads')}
            activeOpacity={0.95}
          >
            <Ionicons name="download-outline" size={24} color={Colors.primary} style={{ marginBottom: 8 }} />
            <Text style={{
              ...Typography.textStyles.captionBold,
              color: Colors.textPrimary,
            }}>
              Downloads
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

export default ResourcesScreen
