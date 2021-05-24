import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import HelloWorld from './HelloWorld.js';

export default function Reminders({navigation}) {
  return (
    <View style={styles.listContainer}>
      <FlatList
        data={[
          {key: "HelloWorld"},
        ]}
        renderItem={({item}) => <Button title={item.key} onPress={() => navigation.navigate(item.key)} />}
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
