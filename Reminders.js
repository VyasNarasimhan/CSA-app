import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AsyncStorage, Button, FlatList, SectionList, StyleSheet, Text, View } from 'react-native';
import HelloWorld from './HelloWorld.js';

var allReminders = null;
getAllReminders();

export default function Reminders({navigation}) {
    return (
        <View style={styles.listContainer}>
        <SectionList
            sections = {[
                {title: 'Pinned', data: allReminders.pin},
                {title: 'Unpinned', data: allReminders.unpin}
            ]}
            renderItem={({item}) => <View><Text style={styles.item}>{item.text}</Text><Text style={styles.dateDisplay}>{item.date}</Text></View>}
            renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
            keyExtractor={item => item.id.toString()}
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
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  dateDisplay: {
      fontSize: 10,
      padding: 10,
  }
});

async function getAllReminders() {
    pinned = [];
    unpinned = [];
    //const reminders = db.getAllReminders();
    AsyncStorage.getItem('reminders').then(result => {
        reminders = JSON.parse(result);
        for (reminder of reminders) {
            if (reminder.pinned) {
                pinned.push(reminder) ;
            } else {
                unpinned.push(reminder);
            }
        }
        allReminders = {pin: pinned, unpin: unpinned};
    }).catch(err => {
        console.log(err);
    });
  }