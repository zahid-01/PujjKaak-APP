import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/contexts/AuthContext";
import { BASE_URI } from "@/constants/baseUri";

export default function LoginScreen() {
  const router = useRouter();
  const { login, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // "phone" or "otp"
  const [loading, setLoading] = useState(false);

  // Development: Clear storage on mount (remove this in production)
  useEffect(() => {
    const clearStorage = async () => {
      // Uncomment the line below to clear storage every time you open login screen
      // await AsyncStorage.multiRemove(['authToken', 'user']);
    };
    // clearStorage(); // Uncomment to enable
  }, []);

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid 10-digit phone number"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URI}/auth/genOtp`, {
        countryCode,
        phone: phoneNumber,
      });

      if (response.data.success) {
        Alert.alert(
          "OTP Sent",
          `OTP has been sent to ${countryCode}${phoneNumber}`
        );
        setStep("otp");
      } else {
        Alert.alert("Error", response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("OTP Error:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    console.log("=== handleVerifyOtp CALLED ===");
    console.log("OTP value:", otp);
    console.log("OTP length:", otp?.length);

    if (!otp || otp.length !== 6) {
      console.log("OTP validation failed");
      Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP");
      return;
    }

    console.log("OTP validation passed, starting request...");
    setLoading(true);

    const requestUrl = `${BASE_URI}/auth/verifyOtp`;
    const requestData = {
      countryCode,
      phone: phoneNumber,
      otp,
    };

    console.log("=== VERIFY OTP REQUEST ===");
    console.log("URL:", requestUrl);
    console.log("Data:", requestData);
    console.log("BASE_URI:", BASE_URI);

    await axios({
      method: "POST",
      url: `${BASE_URI}/auth/verifyOtp`,
      data: requestData,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log("Verify OTP Response:", JSON.stringify(res.data, null, 2));
      })
      .catch((err) => {
        console.error("Error verifying OTP:", err);
      });

    try {
      const response = await axios.post(requestUrl, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(
        "Verify OTP Response:",
        JSON.stringify(response.data, null, 2)
      );

      if (
        response.data.success &&
        response.data.data &&
        response.data.data.token
      ) {
        // Store token and user data
        const token = response.data.data.token;
        const user = response.data.data.user || response.data.data;

        console.log("Token:", token ? "Present" : "Missing");
        console.log("User:", user);

        if (!token) {
          Alert.alert("Error", "Token not received from server");
          setLoading(false);
          return;
        }

        // Save to AuthContext
        try {
          await login(token, user);
          console.log("Auth data saved successfully");

          // Give the context time to update, then navigate
          setTimeout(() => {
            router.replace("/(tabs)");
          }, 500);
        } catch (loginError) {
          console.error("Error saving auth data:", loginError);
          Alert.alert("Error", "Failed to save login data. Please try again.");
          setLoading(false);
        }
      } else {
        console.error("OTP verification failed - no token in response");
        Alert.alert(
          "Error",
          response.data.message || "OTP verification failed"
        );
        setLoading(false);
      }
    } catch (error) {
      console.error("=== VERIFY OTP ERROR ===");
      console.error("Error Type:", error.name);
      console.error("Error Message:", error.message);
      console.error("Error Code:", error.code);

      if (error.response) {
        // Server responded with error status
        console.error("Response Status:", error.response.status);
        console.error("Response Data:", error.response.data);
        Alert.alert(
          "Error",
          error.response.data?.message ||
            `Server error: ${error.response.status}`
        );
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received from server");
        console.error("Request:", error.request);
        Alert.alert(
          "Network Error",
          "Could not reach the server. Please check:\n1. Server is running\n2. Correct IP address\n3. Network connection"
        );
      } else {
        // Something else happened
        console.error("Error setting up request:", error.message);
        Alert.alert("Error", error.message || "Something went wrong");
      }
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    setOtp("");
    handleSendOtp();
  };

  return (
    <>
      <StatusBar style="light" />
      <LinearGradient colors={["#E23744", "#CB202D"]} style={styles.container}>
        <View style={{ paddingTop: insets.top + 60, flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.content}>
                <ThemedText style={styles.title}>
                  {step === "phone" ? "Welcome to PujjKaak" : "Enter OTP"}
                </ThemedText>
                <ThemedText style={styles.subtitle}>
                  {step === "phone"
                    ? "Enter your phone number to continue"
                    : `OTP sent to ${countryCode}${phoneNumber}`}
                </ThemedText>

                {step === "phone" ? (
                  <View style={styles.form}>
                    <View style={styles.phoneInputContainer}>
                      <View style={styles.countryCodeContainer}>
                        <TextInput
                          style={styles.countryCodeInput}
                          value={countryCode}
                          onChangeText={setCountryCode}
                          placeholder="+91"
                          placeholderTextColor="rgba(255, 255, 255, 0.5)"
                          keyboardType="phone-pad"
                          editable={true}
                        />
                      </View>
                      <TextInput
                        style={styles.phoneInput}
                        value={phoneNumber}
                        onChangeText={(text) =>
                          setPhoneNumber(text.replace(/[^0-9]/g, ""))
                        }
                        placeholder="Enter your phone number"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        keyboardType="phone-pad"
                        maxLength={10}
                        autoFocus
                      />
                    </View>

                    <TouchableOpacity
                      style={[styles.button, loading && styles.buttonDisabled]}
                      onPress={handleSendOtp}
                      disabled={loading || phoneNumber.length !== 10}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <ThemedText style={styles.buttonText}>
                          Send OTP
                        </ThemedText>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.form}>
                    <TextInput
                      style={styles.otpInput}
                      value={otp}
                      onChangeText={(text) =>
                        setOtp(text.replace(/[^0-9]/g, ""))
                      }
                      placeholder="Enter 6-digit OTP"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      keyboardType="number-pad"
                      maxLength={6}
                      autoFocus
                    />

                    <TouchableOpacity
                      style={[styles.button, loading && styles.buttonDisabled]}
                      onPress={handleVerifyOtp}
                      disabled={loading || otp.length !== 6}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <ThemedText style={styles.buttonText}>
                          Verify OTP
                        </ThemedText>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.resendButton}
                      onPress={handleResendOtp}
                      disabled={loading}
                    >
                      <ThemedText style={styles.resendText}>
                        Didn't receive OTP? Resend
                      </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => {
                        setStep("phone");
                        setOtp("");
                      }}
                      disabled={loading}
                    >
                      <ThemedText style={styles.backText}>
                        ← Change Phone Number
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
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
    paddingTop: 0,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 32,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  phoneInputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  countryCodeContainer: {
    width: 80,
  },
  countryCodeInput: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  phoneInput: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  otpInput: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    letterSpacing: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#E23744",
    fontSize: 18,
    fontWeight: "600",
  },
  resendButton: {
    padding: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  resendText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  backButton: {
    padding: 12,
    alignItems: "center",
  },
  backText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
});
