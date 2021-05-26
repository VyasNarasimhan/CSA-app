import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { AsyncStorage, Button, FlatList, SectionList, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

var allReminders = null;
getAllReminders();

export default function Reminders({route, navigation}) {
    if (route.params != null) {
        allReminders.pin = route.params.pin;
        allReminders.unpin = route.params.unpin;
    } else {
        ids = allReminders.pin.map(object => object.id);
        allReminders.pin = allReminders.pin.filter(({id}, index) => !ids.includes(id, index+1));
        ids = allReminders.unpin.map(object => object.id);
        allReminders.unpin = allReminders.unpin.filter(({id}, index) => !ids.includes(id, index+1));
    }
    return (
        <View style={styles.listContainer}>
            <Button title="New Reminder" onPress={() => navigation.push("SingleReminder", {reminder: {"id": null, "text": "", "pinned": false, "date": ""}})} />
        <SectionList
            sections = {[
                {title: 'Pinned', data: allReminders.pin},
                {title: 'Unpinned', data: allReminders.unpin}
            ]}
            renderItem={({item}) => 
                <View style={{paddingVertical: 15,
                    paddingHorizontal: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center", 
                    borderBottomWidth: StyleSheet.hairlineWidth}}>
                    <View>
                        <Text style={styles.item}>{item.text}</Text>
                        <Text style={styles.dateDisplay}>{item.date}</Text>
                    </View>
                    <Icon name="edit" size={50} color="#000" style={{margin: 10}} onPress= {() => { navigation.push("SingleReminder", {reminder: item, reminders: allReminders}) }}/>
                </View>}
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
    fontSize: 25,
    height: 44,
  },
  dateDisplay: {
      fontSize: 10,
      padding: 10,
  }
});

function getColor(reminder) {
    if (reminder.pinned) {
        return "#000";
    } else {
        return "#fff";
    }
}

async function getAllReminders() {
    pinned = [];
    unpinned = [];
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