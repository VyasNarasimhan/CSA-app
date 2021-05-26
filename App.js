import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AsyncStorage, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Reminders from './Reminders.js'; 
import HelloWorld from './HelloWorld.js';
import SingleReminder from './SingleReminder.js';

const Stack = createStackNavigator();
setup();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={List} />
        <Stack.Screen name="Reminders" component={Reminders} />
        <Stack.Screen name="SingleReminder" component={SingleReminder} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const List = ({navigation}) => {
  return(
    <View style={styles.listContainer}>
      <FlatList
        data={[
          //{key: "Notes"},
          {key: "Reminders"},
          //{key: "Calendar"},
        ]}
        renderItem={({item}) => <Button title={item.key} onPress={() => navigation.navigate(item.key)} />}
      />
    </View>
  );
}

async function setup() {
  try {
      const temp = await AsyncStorage.getItem('reminders')
      if (temp === null) {
          try {
              await AsyncStorage.setItem('reminders', JSON.stringify([{}]));
          } catch (error) {
              console.log(1);
          }
      }
  } catch (error1) {
      console.log(2);
  }
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
