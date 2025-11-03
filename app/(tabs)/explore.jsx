import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { useCart } from "@/contexts/CartContext";
import { IconSymbol } from "@/components/ui/icon-symbol";

// Sample products data
const products = [
  {
    id: "1",
    name: "Premium Mutton Curry Cut",
    price: 650,
    category: "Fresh Mutton",
    description: "Tender curry cuts from Kashmir farms",
    weight: "1 kg",
    emoji: "🥩",
    rating: "4.8⭐",
    deliveryTime: "30 mins",
    badge: "Most Popular",
  },
  {
    id: "2",
    name: "Farm Chicken Whole",
    price: 320,
    category: "Farm Chicken",
    description: "Organic, free-range chicken",
    weight: "1.2 kg",
    emoji: "🐔",
    rating: "4.7⭐",
    deliveryTime: "25 mins",
  },
  {
    id: "3",
    name: "Fresh Beef Steak Cut",
    price: 580,
    category: "Fresh Beef",
    description: "High-quality beef for grilling",
    weight: "500g",
    emoji: "🐄",
    rating: "4.9⭐",
    deliveryTime: "35 mins",
  },
  {
    id: "4",
    name: "Fresh Trout Fish",
    price: 480,
    category: "Fresh Fish",
    description: "Fresh catch from Kashmir waters",
    weight: "800g",
    emoji: "🐟",
    rating: "4.6⭐",
    deliveryTime: "40 mins",
    badge: "New",
  },
  {
    id: "5",
    name: "Mutton Biryani Cut",
    price: 720,
    category: "Fresh Mutton",
    description: "Perfect cuts for biryani",
    weight: "1 kg",
    emoji: "🥩",
    rating: "4.8⭐",
    deliveryTime: "30 mins",
  },
  {
    id: "6",
    name: "Chicken Leg Pieces",
    price: 280,
    category: "Farm Chicken",
    description: "Fresh chicken leg pieces",
    weight: "1 kg",
    emoji: "🐔",
    rating: "4.7⭐",
    deliveryTime: "25 mins",
  },
];

export default function MenuScreen() {
  const { addItem } = useCart();
  const router = useRouter();

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      weight: product.weight,
    });

    Alert.alert(
      "Added to Cart!",
      `${product.name} has been added to your cart.`,
      [{ text: "OK" }]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={["#E23744", "#CB202D"]} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerContent}>
            <ThemedText style={styles.headerTitle}>Our Menu</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Fresh • Premium • Kashmir
            </ThemedText>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/profile")}
          >
            <IconSymbol name="person.circle.fill" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Products Grid */}
        <View style={styles.productsSection}>
          {products.map((product) => (
            <View key={product.id} style={styles.productCard}>
              {product.badge && (
                <View style={styles.productBadge}>
                  <ThemedText style={styles.productBadgeText}>
                    {product.badge}
                  </ThemedText>
                </View>
              )}

              <View style={styles.productHeader}>
                <View style={styles.productIconContainer}>
                  <ThemedText style={styles.productIcon}>
                    {product.emoji}
                  </ThemedText>
                </View>
                <View style={styles.productInfo}>
                  <ThemedText style={styles.productTitle}>
                    {product.name}
                  </ThemedText>
                  <ThemedText style={styles.productCategory}>
                    {product.category}
                  </ThemedText>
                  <ThemedText style={styles.productDescription}>
                    {product.description}
                  </ThemedText>
                  <View style={styles.productMeta}>
                    <ThemedText style={styles.productWeight}>
                      {product.weight}
                    </ThemedText>
                    <ThemedText style={styles.productRating}>
                      {product.rating}
                    </ThemedText>
                  </View>
                  <View style={styles.productFooter}>
                    <ThemedText style={styles.productPrice}>
                      ₹{product.price}
                    </ThemedText>
                    <ThemedText style={styles.productDelivery}>
                      • {product.deliveryTime}
                    </ThemedText>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={() => handleAddToCart(product)}
              >
                <ThemedText style={styles.addToCartButtonText}>
                  Add to Cart
                </ThemedText>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <ThemedText style={styles.infoIcon}>🚚</ThemedText>
          <ThemedText style={styles.infoTitle}>Free Delivery</ThemedText>
          <ThemedText style={styles.infoText}>
            Free delivery on orders above ₹500. Cold chain delivery guaranteed!
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
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
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
  profileButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  productsSection: {
    gap: 16,
  },
  productCard: {
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
  productBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#E23744",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  productBadgeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  productHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  productIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: "#fff5f5",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  productIcon: {
    fontSize: 28,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: "#E23744",
    fontWeight: "500",
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 18,
  },
  productMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  productWeight: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  productRating: {
    fontSize: 12,
    fontWeight: "600",
    color: "#E23744",
  },
  productFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E23744",
  },
  productDelivery: {
    fontSize: 12,
    color: "#666",
  },
  addToCartButton: {
    backgroundColor: "#E23744",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addToCartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  infoBanner: {
    backgroundColor: "#e8f5e8",
    marginTop: 30,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c3e6c3",
  },
  infoIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d5a2d",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#2d5a2d",
    textAlign: "center",
    lineHeight: 20,
  },
});
