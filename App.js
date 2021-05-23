import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={List} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const HelloWorld = () => {
  return(
    <View style={styles.container}>
      <Text>Open up Appjs to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const List = () => {
  return(
    <View style={styles.listContainer}>
      <FlatList
        data={[
          {key: "Notes"},
          {key: "Reminders"},
          {key: "Calendar"},
        ]}
        renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    flex: 1,
    paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  }
});
