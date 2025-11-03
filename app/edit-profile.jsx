import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useState, useEffect } from "react";
import axios from "axios";

import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/contexts/AuthContext";
import { BASE_URI } from "@/constants/baseUri";
import { IconSymbol } from "@/components/ui/icon-symbol";
import api from "@/utils/axios";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [address, setAddress] = useState(user?.address || "");
  const [photo, setPhoto] = useState(user?.photo || null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const fixImageUrl = (url) => {
    if (!url) return url;
    const baseUrl = BASE_URI.replace("/api/v1", "");
    return url.replace("http://localhost:5050", baseUrl);
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await handleUploadPhoto(result.assets[0].uri);
    }
  };

  const handleUploadPhoto = async (uri) => {
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      
      // Extract filename and type from URI
      const filename = uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";
      
      formData.append("photo", {
        uri,
        name: filename,
        type,
      });

      const response = await api.patch(`${BASE_URI}/user/profile/photo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        const photoUrl = fixImageUrl(response.data.data.user.photo);
        setPhoto(photoUrl);
        // Update user in context
        await login(user?.token || "", { ...user, photo: photoUrl });
        Alert.alert("Success", "Profile photo updated successfully!");
      }
    } catch (error) {
      console.error("Photo upload error:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!fullName.trim()) {
      Alert.alert("Validation Error", "Full name is required");
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      if (email) formData.append("email", email);
      if (address) formData.append("address", address);

      const response = await api.patch(`${BASE_URI}/user/profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        const updatedUser = response.data.data.user;
        // Fix photo URL if exists
        if (updatedUser.photo) {
          updatedUser.photo = fixImageUrl(updatedUser.photo);
        }
        // Update auth context
        await login(user?.token || "", updatedUser);
        Alert.alert("Success", "Profile updated successfully!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      console.error("Update profile error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
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
            <ThemedText style={styles.headerTitle}>Edit Profile</ThemedText>
            <View style={styles.placeholder} />
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Profile Photo */}
            <View style={styles.photoSection}>
              <TouchableOpacity
                style={styles.photoContainer}
                onPress={handlePickImage}
                disabled={uploadingPhoto}
              >
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.photo} contentFit="cover" />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <IconSymbol name="person.fill" size={48} color="#E23744" />
                  </View>
                )}
                {uploadingPhoto ? (
                  <View style={styles.uploadOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                  </View>
                ) : (
                  <View style={styles.editPhotoBadge}>
                    <IconSymbol name="camera.fill" size={20} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
              <ThemedText style={styles.photoHint}>Tap to change photo</ThemedText>
            </View>

            {/* Form */}
            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Full Name *</ThemedText>
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Email</ThemedText>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Phone Number</ThemedText>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={user?.phoneNumber || ""}
                  editable={false}
                  placeholderTextColor="#999"
                />
                <ThemedText style={styles.hint}>
                  Phone number cannot be changed
                </ThemedText>
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Address</ThemedText>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your delivery address"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleUpdateProfile}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.saveButtonText}>Save Changes</ThemedText>
              )}
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
  photoSection: {
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 20,
  },
  photoContainer: {
    position: "relative",
    marginBottom: 12,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#E23744",
  },
  editPhotoBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#E23744",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  uploadOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  photoHint: {
    fontSize: 14,
    color: "#666",
  },
  formSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#999",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  hint: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: "#E23744",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

