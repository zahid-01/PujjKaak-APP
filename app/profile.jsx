import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { useState } from "react";

import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/contexts/AuthContext";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { BASE_URI } from "@/constants/baseUri";
import api from "@/utils/axios";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, login } = useAuth();
  const [profileUser, setProfileUser] = useState(user);
  const [loading, setLoading] = useState(false);

  const fixImageUrl = (url) => {
    if (!url) return null;
    const baseUrl = BASE_URI.replace("/api/v1", "");
    return url.replace("http://localhost:5050", baseUrl);
  };

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`${BASE_URI}/user/profile`);
      if (response.data.success) {
        const userData = response.data.data.user;
        if (userData.photo) {
          userData.photo = fixImageUrl(userData.photo);
        }
        setProfileUser(userData);
        // Update auth context
        await login(user?.token || "", userData);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.token, login]);

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [fetchUserProfile])
  );


  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/login");
          },
        },
      ]
    );
  };

  return (
    <>
      <StatusBar style="light" />
      <LinearGradient colors={["#E23744", "#CB202D"]} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <IconSymbol name="chevron.left" size={24} color="#fff" />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>Profile</ThemedText>
            <View style={styles.placeholder} />
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Profile Section */}
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                {profileUser?.photo ? (
                  <Image
                    source={{ uri: profileUser.photo }}
                    style={styles.avatarImage}
                    contentFit="cover"
                  />
                ) : (
                  <View style={styles.avatar}>
                    <IconSymbol name="person.fill" size={48} color="#E23744" />
                  </View>
                )}
              </View>
              <ThemedText style={styles.userName}>
                {profileUser?.fullName || user?.fullName || "User"}
              </ThemedText>
              <ThemedText style={styles.userPhone}>
                {profileUser?.phoneNumber || user?.phoneNumber || "No phone number"}
              </ThemedText>
              {profileUser?.email && (
                <ThemedText style={styles.userEmail}>
                  {profileUser.email}
                </ThemedText>
              )}
            </View>

            {/* Menu Items */}
            <View style={styles.menuSection}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push("/edit-profile")}
              >
                <View style={styles.menuItemLeft}>
                  <IconSymbol name="person.circle" size={24} color="#E23744" />
                  <ThemedText style={styles.menuItemText}>
                    Edit Profile
                  </ThemedText>
                </View>
                <IconSymbol name="chevron.right" size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <IconSymbol name="location" size={24} color="#E23744" />
                  <ThemedText style={styles.menuItemText}>
                    Delivery Address
                  </ThemedText>
                </View>
                <IconSymbol name="chevron.right" size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <IconSymbol name="doc.text" size={24} color="#E23744" />
                  <ThemedText style={styles.menuItemText}>My Orders</ThemedText>
                </View>
                <IconSymbol name="chevron.right" size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <IconSymbol name="bell" size={24} color="#E23744" />
                  <ThemedText style={styles.menuItemText}>
                    Notifications
                  </ThemedText>
                </View>
                <IconSymbol name="chevron.right" size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <IconSymbol name="questionmark.circle" size={24} color="#E23744" />
                  <ThemedText style={styles.menuItemText}>Help & Support</ThemedText>
                </View>
                <IconSymbol name="chevron.right" size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <IconSymbol name="info.circle" size={24} color="#E23744" />
                  <ThemedText style={styles.menuItemText}>About</ThemedText>
                </View>
                <IconSymbol name="chevron.right" size={20} color="#999" />
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color="#E23744" />
              <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#E23744",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#E23744",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#999",
  },
  menuSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E23744",
  },
});

