import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react";
import { BASE_URI } from "@/constants/baseUri";
import axios from "axios";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";

// Sample products for quick add
const quickProducts = [
  {
    id: "quick-1",
    name: "Premium Mutton Curry Cut",
    price: 650,
    category: "Fresh Mutton",
    description: "Tender curry cuts from Kashmir farms",
    weight: "1 kg",
  },
  {
    id: "quick-2",
    name: "Farm Chicken Whole",
    price: 320,
    category: "Farm Chicken",
    description: "Organic, free-range chicken",
    weight: "1.2 kg",
  },
  {
    id: "quick-3",
    name: "Fresh Beef Steak Cut",
    price: 580,
    category: "Fresh Beef",
    description: "High-quality beef for grilling",
    weight: "500g",
  },
  {
    id: "quick-4",
    name: "Fresh Trout Fish",
    price: 480,
    category: "Fresh Fish",
    description: "Fresh catch from Kashmir waters",
    weight: "800g",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { addItem } = useCart();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to fix image URLs (replace localhost with actual IP)
  const fixImageUrl = (url) => {
    if (!url) return url;
    // Extract base URL from BASE_URI (remove /api/v1)
    const baseUrl = BASE_URI.replace("/api/v1", "");
    // Replace localhost:5050 with the correct base URL
    return url.replace("http://localhost:5050", baseUrl);
  };

  useEffect(() => {
    axios
      .get(`${BASE_URI}/categories`)
      .then((res) => {
        if (res.data.success && res.data.data && res.data.data.categories) {
          // Fix image URLs for each category
          const categoriesWithFixedUrls = res.data.data.categories.map(
            (category) => ({
              ...category,
              photo: category.photo ? category.photo.map(fixImageUrl) : [],
            })
          );
          setCategories(categoriesWithFixedUrls);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  const getCategoryEmoji = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes("mutton") || name.includes("lamb")) return "🥩";
    if (name.includes("chicken")) return "🐔";
    if (name.includes("beef")) return "🐄";
    if (name.includes("fish")) return "🐟";
    return "🍖";
  };

  const handleCategoryPress = (category) => {
    router.push(`/category/${category.id}`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <LinearGradient
          colors={["#E23744", "#CB202D"]}
          style={styles.headerGradient}
        >
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/logo-DsY4IKTI.png")}
                style={styles.logoImage}
                contentFit="contain"
              />
            </View>
            <View style={styles.headerRight}>
              <View style={styles.locationContainer}>
                <ThemedText style={styles.locationText}>
                  📍 Srinagar, Kashmir
                </ThemedText>
              </View>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => router.push("/profile")}
              >
                <IconSymbol name="person.circle.fill" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for meat, chicken..."
              placeholderTextColor="#999"
            />
          </View>
        </LinearGradient>
      </View>
      {/* Welcome Banner */}
      <View style={styles.welcomeBanner}>
        <ThemedText style={styles.welcomeTitle}>
          Pujj Kaak Tender Cuts
        </ThemedText>
        <ThemedText style={styles.welcomeSubtitle}>
          Kashmir&apos;s Premium Meat Delivery • Fast • Fresh • Reliable
        </ThemedText>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>30min</ThemedText>
          <ThemedText style={styles.statLabel}>Delivery</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>4.8★</ThemedText>
          <ThemedText style={styles.statLabel}>Rating</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>100%</ThemedText>
          <ThemedText style={styles.statLabel}>Fresh</ThemedText>
        </View>
      </View>

      {/* Categories Section */}
      <View style={styles.sectionContainer}>
        <ThemedText style={styles.sectionTitle}>Our Categories</ThemedText>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ThemedText style={styles.loadingText}>
              Loading categories...
            </ThemedText>
          </View>
        ) : categories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              No categories available
            </ThemedText>
          </View>
        ) : (
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
              >
                {category.photo &&
                category.photo.length > 0 &&
                category.photo[0] ? (
                  <View style={styles.categoryImageContainer}>
                    <Image
                      source={{ uri: category.photo[0] }}
                      style={styles.categoryImage}
                      contentFit="cover"
                    />
                  </View>
                ) : (
                  <View style={styles.categoryImageContainer}>
                    <ThemedText style={styles.categoryEmoji}>
                      {getCategoryEmoji(category.categoryName)}
                    </ThemedText>
                  </View>
                )}
                <ThemedText style={styles.categoryName}>
                  {category.categoryName}
                </ThemedText>
                <ThemedText style={styles.categoryDesc}>
                  Browse products
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Why Choose Us */}
      <View style={styles.sectionContainer}>
        <ThemedText style={styles.sectionTitle}>
          Why Choose Pujj Kaak?
        </ThemedText>
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <ThemedText style={styles.featureIcon}>🚚</ThemedText>
            <View style={styles.featureContent}>
              <ThemedText style={styles.featureTitle}>
                Super Fast Delivery
              </ThemedText>
              <ThemedText style={styles.featureDesc}>
                Fresh cuts delivered in 30 minutes
              </ThemedText>
            </View>
          </View>

          <View style={styles.featureItem}>
            <ThemedText style={styles.featureIcon}>❄️</ThemedText>
            <View style={styles.featureContent}>
              <ThemedText style={styles.featureTitle}>
                Cold Chain Delivery
              </ThemedText>
              <ThemedText style={styles.featureDesc}>
                Temperature controlled for freshness
              </ThemedText>
            </View>
          </View>

          <View style={styles.featureItem}>
            <ThemedText style={styles.featureIcon}>✅</ThemedText>
            <View style={styles.featureContent}>
              <ThemedText style={styles.featureTitle}>
                Quality Guaranteed
              </ThemedText>
              <ThemedText style={styles.featureDesc}>
                Handpicked from trusted local farms
              </ThemedText>
            </View>
          </View>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <View style={styles.ctaCard}>
          <ThemedText style={styles.ctaTitle}>Ready to Order?</ThemedText>
          <ThemedText style={styles.ctaSubtitle}>
            Get the freshest cuts delivered to your doorstep
          </ThemedText>
          <TouchableOpacity style={styles.ctaButton}>
            <ThemedText style={styles.ctaButtonText}>Start Shopping</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Coming Soon Banner */}
      <View style={styles.comingSoonBanner}>
        <ThemedText style={styles.comingSoonIcon}>🚀</ThemedText>
        <ThemedText style={styles.comingSoonTitle}>Launching Soon!</ThemedText>
        <ThemedText style={styles.comingSoonText}>
          We&apos;re preparing to bring you Kashmir&apos;s freshest meat
          delivery experience
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#E23744",
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainer: {
    flex: 1,
  },
  logoImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  locationContainer: {
    alignItems: "flex-end",
  },
  locationText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  profileButton: {
    padding: 4,
  },
  searchContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    height: 45,
    fontSize: 16,
    color: "#333",
  },
  welcomeBanner: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E23744",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E23744",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  sectionContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  categoryCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: "relative",
  },
  categoryImageContainer: {
    width: 60,
    height: 60,
    backgroundColor: "#fff5f5",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    textAlign: "center",
  },
  categoryDesc: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
  },
  quickAddBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#E23744",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  quickAddText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 40,
    textAlign: "center",
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
  },
  ctaSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  ctaCard: {
    backgroundColor: "#E23744",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: "#E23744",
    fontSize: 16,
    fontWeight: "bold",
  },
  comingSoonBanner: {
    backgroundColor: "#fff3cd",
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 30,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffeaa7",
  },
  comingSoonIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#856404",
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 14,
    color: "#856404",
    textAlign: "center",
    lineHeight: 20,
  },
});
