// app/(tabs)/profile.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/Colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateProfile({ name, email });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setIsEditing(false);
  };

  const MenuItem = ({
    icon,
    title,
    subtitle,
    onPress,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon as any} size={20} color={Colors.primary} />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileContent}>
            <Avatar source={user?.profile_image} name={user?.name} size="xl" />
            {!isEditing ? (
              <>
                <Text style={styles.profileName}>{user?.name}</Text>
                <Text style={styles.profileEmail}>{user?.email}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>{user?.role}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={styles.editButton}
                >
                  <Ionicons name="create-outline" size={16} color={Colors.gray700} />
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.editForm}>
                <Input
                  label="Name"
                  value={name}
                  onChangeText={setName}
                  leftIcon={
                    <Ionicons name="person-outline" size={20} color={Colors.gray400} />
                  }
                  containerStyle={styles.input}
                />
                <Input
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon={
                    <Ionicons name="mail-outline" size={20} color={Colors.gray400} />
                  }
                  containerStyle={styles.input}
                />
                <View style={styles.editActions}>
                  <Button
                    title="Cancel"
                    variant="outline"
                    onPress={handleCancelEdit}
                    style={styles.actionButton}
                  />
                  <Button
                    title="Save"
                    onPress={handleSaveProfile}
                    loading={loading}
                    style={styles.actionButton}
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        {/* General Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>General</Text>
          <MenuItem
            icon="settings-outline"
            title="Settings"
            subtitle="App preferences and configuration"
            onPress={() => Alert.alert('Settings', 'Coming soon!')}
          />
          <MenuItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage notification preferences"
            onPress={() => Alert.alert('Notifications', 'Coming soon!')}
          />
          <MenuItem
            icon="book-outline"
            title="Reading History"
            subtitle="View your reading activity"
            onPress={() => router.push('/(tabs)/bookshelf')}
          />
        </View>

        {/* Support Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          <MenuItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get help and contact us"
            onPress={() => Alert.alert('Help', 'Coming soon!')}
          />
          <MenuItem
            icon="shield-checkmark-outline"
            title="Privacy Policy"
            subtitle="Read our privacy policy"
            onPress={() => Alert.alert('Privacy', 'Coming soon!')}
          />
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Puskata v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.gray900,
  },
  profileCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileContent: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.gray900,
    marginTop: 16,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.gray600,
    marginTop: 4,
  },
  roleBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    textTransform: 'capitalize',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 16,
  },
  editButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray700,
  },
  editForm: {
    width: '100%',
    marginTop: 16,
  },
  input: {
    marginBottom: 16,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
  menuSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray700,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  menuIconContainer: {
    backgroundColor: Colors.gray100,
    padding: 12,
    borderRadius: 12,
  },
  menuContent: {
    flex: 1,
    marginLeft: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray900,
  },
  menuSubtitle: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 4,
  },
  logoutContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    padding: 16,
    borderRadius: 12,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
  },
  versionContainer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  versionText: {
    fontSize: 12,
    color: Colors.gray400,
  },
});