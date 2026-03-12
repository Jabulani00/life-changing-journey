/**
 * ExpandableText – shows truncated text with "Read more" / "Show less" for DB content.
 * Use for event descriptions, motivations, booking notes, etc.
 */
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'

const DEFAULT_TRUNCATE_LENGTH = 120

export default function ExpandableText({
  text,
  numberOfLines,
  truncateLength = DEFAULT_TRUNCATE_LENGTH,
  style,
  linkStyle,
  showReadMoreOnlyWhenLong = true,
}) {
  const [expanded, setExpanded] = useState(false)
  const str = text != null ? String(text).trim() : ''
  const isLong = str.length > truncateLength
  const shouldShowToggle = showReadMoreOnlyWhenLong ? isLong : true
  const showTruncated = !expanded && isLong
  const displayText = showTruncated ? str.slice(0, truncateLength).trim() + (str.length > truncateLength ? '…' : '') : str

  if (!str) return null

  const link = {
    ...Typography.textStyles.captionBold,
    color: Colors.primary,
    marginTop: 4,
  }

  return (
    <View>
      <Text
        style={[{ ...Typography.textStyles.body, color: Colors.textPrimary }, style]}
        numberOfLines={expanded || showTruncated ? undefined : numberOfLines}
      >
        {displayText}
      </Text>
      {shouldShowToggle && (
        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.7}
          style={{ alignSelf: 'flex-start', marginTop: 2 }}
        >
          <Text style={[link, linkStyle]}>
            {expanded ? 'Show less' : 'Read more'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
