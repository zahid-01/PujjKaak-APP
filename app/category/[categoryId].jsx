import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import axios from "axios";

import { ThemedText } from "@/components/themed-text";
import { useCart } from "@/contexts/CartContext";
import { BASE_URI } from "@/constants/baseUri";
import { IconSymbol } from "@/components/ui/icon-symbol";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function CategoryProductsScreen() {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams();
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [imageIndexes, setImageIndexes] = useState({});

  // Helper function to fix image URLs (replace localhost with actual IP)
  const fixImageUrl = (url) => {
    if (!url) return url;
    const baseUrl = BASE_URI.replace("/api/v1", "");
    return url.replace("http://localhost:5050", baseUrl);
  };

  useEffect(() => {
    if (!categoryId) return;

    axios
      .get(`${BASE_URI}/products/${categoryId}`)
      .then((res) => {
        console.log("Products Response:", res.data);
        if (res.data.success && res.data.data) {
          if (res.data.data.category) {
            setCategoryName(res.data.data.category.categoryName);
          }
          if (res.data.data.products) {
            // Fix image URLs for each product
            const productsWithFixedUrls = res.data.data.products.map(
              (product) => ({
                ...product,
                photos: product.photos ? product.photos.map(fixImageUrl) : [],
              })
            );
            setProducts(productsWithFixedUrls);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err.message);
        setLoading(false);
      });
  }, [categoryId]);

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: categoryName || "Category",
      description: product.description,
      weight: product.weight ? `${product.weight}g` : undefined,
    });

    Alert.alert("Added to Cart!", `${product.name} has been added to your cart.`, [
      { text: "OK" },
    ]);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#E23744", "#CB202D"]} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.backButtonText}>← Back</ThemedText>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <ThemedText style={styles.headerTitle}>
              {categoryName || "Products"}
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E23744" />
          <ThemedText style={styles.loadingText}>Loading products...</ThemedText>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyIcon}>📦</ThemedText>
          <ThemedText style={styles.emptyTitle}>No products found</ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            This category doesn't have any products yet.
          </ThemedText>
        </View>
      ) : (
        <ScrollView
          style={styles.productsContainer}
          showsVerticalScrollIndicator={false}
        >
          {products.map((product) => (
            <View key={product.id} style={styles.productCard}>
              {product.photos && product.photos.length > 0 ? (
                <View style={styles.imageCarouselContainer}>
                  <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(event) => {
                      const imageWidth = SCREEN_WIDTH - 40;
                      const index = Math.round(
                        event.nativeEvent.contentOffset.x / imageWidth
                      );
                      setImageIndexes((prev) => ({
                        ...prev,
                        [product.id]: index,
                      }));
                    }}
                    style={styles.imageCarousel}
                  >
                    {product.photos.map((photo, photoIndex) => (
                      <View key={photoIndex} style={{ width: SCREEN_WIDTH - 40 }}>
                        <Image
                          source={{ uri: photo }}
                          style={styles.productImage}
                          contentFit="cover"
                        />
                      </View>
                    ))}
                  </ScrollView>
                  {product.photos.length > 1 && (
                    <View style={styles.imagePagination}>
                      {product.photos.map((_, index) => (
                        <View
                          key={index}
                          style={[
                            styles.paginationDot,
                            (imageIndexes[product.id] ?? 0) === index &&
                              styles.paginationDotActive,
                          ]}
                        />
                      ))}
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.productImagePlaceholder}>
                  <ThemedText style={styles.productEmoji}>🍖</ThemedText>
                </View>
              )}

              <View style={styles.productInfo}>
                <ThemedText style={styles.productName}>{product.name}</ThemedText>
                {product.description && (
                  <ThemedText style={styles.productDescription}>
                    {product.description}
                  </ThemedText>
                )}
                <View style={styles.productDetails}>
                  {product.weight && (
                    <ThemedText style={styles.productWeight}>
                      {product.weight}g
                    </ThemedText>
                  )}
                  <ThemedText style={styles.productPrice}>
                    ₹{product.price}
                  </ThemedText>
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
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    marginBottom: 0,
    flex: 1,
  },
  profileButton: {
    padding: 4,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  headerTitleContainer: {
    flex: 2,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  productsContainer: {
    flex: 1,
    padding: 20,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageCarouselContainer: {
    position: "relative",
  },
  imageCarousel: {
    height: 200,
  },
  productImage: {
    width: "100%",
    height: 200,
  },
  imagePagination: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: "#fff",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  productImagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#fff5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  productEmoji: {
    fontSize: 48,
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  productDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  productWeight: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E23744",
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
});

