import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Link href={{ pathname: "/details/[id]", params: { id: "1" } }}>
        View first user details
      </Link>
      <Link href={{ pathname: "/details/[id]", params: { id: "2" } }}>
        View second user details
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
