import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { AsyncStorage, Button, FlatList, SectionList, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

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
                    <Icon name="star" size={50} color={getColor(item)} style={{margin: 10}} onPress= {() => { changePinStatus(item); navigation.reset({index: 1, routes: [{name: "Home"}, {name: "Reminders"}],}) }}/>
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
    fontSize: 18,
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

async function changePinStatus(reminder) {
    id = reminder.id;
    done = false;
    for (var i = 0; i < allReminders.pin.length; i++) {
        if (allReminders.pin[i].id == id) {
            allReminders.pin[i].pinned = !allReminders.pin[i].pinned;
            allReminders.unpin.push(allReminders.pin[i]);
            allReminders.pin.splice(i, 1);
            done = true;
            break;
        }
    }
    if (!done) {
        for (var i = 0; i < allReminders.unpin.length; i++) {
            if (allReminders.unpin[i].id == id) {
                allReminders.unpin[i].pinned = !allReminders.unpin[i].pinned;
                allReminders.pin.push(allReminders.unpin[i]);
                allReminders.unpin.splice(i, 1);
                break;
            }
        }
    }
    const both = allReminders.pin.concat(allReminders.unpin);
    try {
        await AsyncStorage.setItem('reminders', JSON.stringify(both));
    } catch (error) {
        console.log(1);
    }
}