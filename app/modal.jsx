import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function ContactScreen() {
  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={["#D32F2F", "#FF5722"]} style={styles.header}>
        <ThemedText style={styles.headerIcon}>📞</ThemedText>
        <ThemedText style={styles.headerTitle}>Contact Us</ThemedText>
      </LinearGradient>

      <ThemedView style={styles.content}>
        <ThemedView style={styles.contactCard}>
          <ThemedText style={styles.contactIcon}>📱</ThemedText>
          <ThemedText style={styles.contactTitle}>Phone</ThemedText>
          <ThemedText style={styles.contactDetail}>+91-XXXX-XXXX-XX</ThemedText>
          <ThemedText style={styles.contactDescription}>
            Call us for orders and inquiries
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.contactCard}>
          <ThemedText style={styles.contactIcon}>📧</ThemedText>
          <ThemedText style={styles.contactTitle}>Email</ThemedText>
          <ThemedText style={styles.contactDetail}>
            hello@pujjkaak.com
          </ThemedText>
          <ThemedText style={styles.contactDescription}>
            Send us your feedback and suggestions
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.contactCard}>
          <ThemedText style={styles.contactIcon}>📍</ThemedText>
          <ThemedText style={styles.contactTitle}>Location</ThemedText>
          <ThemedText style={styles.contactDetail}>
            Srinagar, Kashmir
          </ThemedText>
          <ThemedText style={styles.contactDescription}>
            Serving across Jammu & Kashmir
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.comingSoonNote}>
          <ThemedText style={styles.comingSoonText}>
            🚀 We're launching soon!
          </ThemedText>
          <ThemedText style={styles.comingSoonDescription}>
            Contact details will be updated once we go live. Stay tuned for
            Kashmir's freshest meat delivery service!
          </ThemedText>
        </ThemedView>

        <TouchableOpacity style={styles.closeButton}>
          <Link href="/" dismissTo style={styles.closeLink}>
            <LinearGradient
              colors={["#FF5722", "#D32F2F"]}
              style={styles.closeGradient}
            >
              <ThemedText style={styles.closeText}>Back to Home</ThemedText>
            </LinearGradient>
          </Link>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  content: {
    backgroundColor: "transparent",
    padding: 20,
    gap: 20,
    flex: 1,
  },
  contactCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#FF5722",
  },
  contactIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D32F2F",
    marginBottom: 8,
    textAlign: "center",
  },
  contactDetail: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF5722",
    marginBottom: 8,
    textAlign: "center",
  },
  contactDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  comingSoonNote: {
    backgroundColor: "rgba(255, 193, 7, 0.1)",
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 193, 7, 0.3)",
    alignItems: "center",
  },
  comingSoonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F57C00",
    textAlign: "center",
    marginBottom: 8,
  },
  comingSoonDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  closeButton: {
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 20,
  },
  closeLink: {
    width: "100%",
  },
  closeGradient: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
