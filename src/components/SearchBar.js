import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadow } from '../theme';

export default function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search beaches, cities or states...',
  autoFocus = false,
  containerStyle,
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Ionicons name="search" size={19} color={colors.ocean} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        autoFocus={autoFocus}
        autoCorrect={false}
        returnKeyType="search"
      />
      {value?.length > 0 && (
        <TouchableOpacity
          onPress={onClear || (() => onChangeText(''))}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.clearBtn}
        >
          <Ionicons name="close-circle" size={18} color={colors.muted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    ...shadow,
    borderWidth: 1,
    borderColor: colors.line,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.ink,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 2,
    marginLeft: 6,
  },
});

