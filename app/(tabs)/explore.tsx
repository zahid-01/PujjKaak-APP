import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

export default function MenuScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={["#E23744", "#CB202D"]} style={styles.header}>
        <ThemedText style={styles.headerTitle}>Our Menu</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Fresh • Premium • Kashmir
        </ThemedText>
      </LinearGradient>

      <View style={styles.content}>
        {/* Menu Categories */}
        <View style={styles.categoriesSection}>
          <TouchableOpacity style={styles.menuCard}>
            <View style={styles.menuCardHeader}>
              <View style={styles.menuIconContainer}>
                <ThemedText style={styles.menuIcon}>🥩</ThemedText>
              </View>
              <View style={styles.menuCardInfo}>
                <ThemedText style={styles.menuTitle}>Fresh Mutton</ThemedText>
                <ThemedText style={styles.menuSubtitle}>
                  Premium cuts from Kashmir farms
                </ThemedText>
                <View style={styles.menuStats}>
                  <ThemedText style={styles.menuRating}>4.8⭐</ThemedText>
                  <ThemedText style={styles.menuDelivery}>• 30 mins</ThemedText>
                </View>
              </View>
            </View>
            <View style={styles.menuBadge}>
              <ThemedText style={styles.menuBadgeText}>Most Popular</ThemedText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard}>
            <View style={styles.menuCardHeader}>
              <View style={styles.menuIconContainer}>
                <ThemedText style={styles.menuIcon}>🐔</ThemedText>
              </View>
              <View style={styles.menuCardInfo}>
                <ThemedText style={styles.menuTitle}>Farm Chicken</ThemedText>
                <ThemedText style={styles.menuSubtitle}>
                  Organic, free-range chicken
                </ThemedText>
                <View style={styles.menuStats}>
                  <ThemedText style={styles.menuRating}>4.7⭐</ThemedText>
                  <ThemedText style={styles.menuDelivery}>• 25 mins</ThemedText>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard}>
            <View style={styles.menuCardHeader}>
              <View style={styles.menuIconContainer}>
                <ThemedText style={styles.menuIcon}>🐄</ThemedText>
              </View>
              <View style={styles.menuCardInfo}>
                <ThemedText style={styles.menuTitle}>Fresh Beef</ThemedText>
                <ThemedText style={styles.menuSubtitle}>
                  High-quality beef cuts
                </ThemedText>
                <View style={styles.menuStats}>
                  <ThemedText style={styles.menuRating}>4.9⭐</ThemedText>
                  <ThemedText style={styles.menuDelivery}>• 35 mins</ThemedText>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard}>
            <View style={styles.menuCardHeader}>
              <View style={styles.menuIconContainer}>
                <ThemedText style={styles.menuIcon}>🐟</ThemedText>
              </View>
              <View style={styles.menuCardInfo}>
                <ThemedText style={styles.menuTitle}>Fresh Fish</ThemedText>
                <ThemedText style={styles.menuSubtitle}>
                  Daily fresh catch from Kashmir waters
                </ThemedText>
                <View style={styles.menuStats}>
                  <ThemedText style={styles.menuRating}>4.6⭐</ThemedText>
                  <ThemedText style={styles.menuDelivery}>• 40 mins</ThemedText>
                </View>
              </View>
            </View>
            <View style={styles.menuBadge}>
              <ThemedText style={styles.menuBadgeText}>New</ThemedText>
            </View>
          </TouchableOpacity>
        </View>

        {/* Coming Soon Banner */}
        <View style={styles.comingSoonBanner}>
          <ThemedText style={styles.comingSoonIcon}>🚀</ThemedText>
          <ThemedText style={styles.comingSoonTitle}>
            Full Menu Coming Soon!
          </ThemedText>
          <ThemedText style={styles.comingSoonText}>
            We&apos;re preparing detailed product listings with prices, cuts,
            and ordering options.
          </ThemedText>
        </View>
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
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    fontWeight: "500",
  },
  content: {
    padding: 20,
  },
  categoriesSection: {
    gap: 16,
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: "relative",
  },
  menuCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: "#fff5f5",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuIcon: {
    fontSize: 28,
  },
  menuCardInfo: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 18,
  },
  menuStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuRating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E23744",
  },
  menuDelivery: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  menuBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#E23744",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  menuBadgeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  comingSoonBanner: {
    backgroundColor: "#fff3cd",
    marginTop: 30,
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
