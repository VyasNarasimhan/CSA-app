import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { RefreshControl, AsyncStorage, Button, FlatList, SectionList, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements';
import moment from 'moment';

var allReminders = null;
getAllReminders();

export default function Reminders({route, navigation}) {
    const [refreshing, setRefreshing] = useState(false);
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    const refresh = React.useCallback(() => {
        setRefreshing(true);
        wait(200).then(() => setRefreshing(false));
      }, []);
    if (route.params != null) {
        allReminders.pin = route.params.pin;
        allReminders.unpin = route.params.unpin;
        allReminders.done = route.params.done;
    } else {
        ids = allReminders.pin.map(object => object.id);
        allReminders.pin = allReminders.pin.filter(({id}, index) => !ids.includes(id, index+1));
        ids = allReminders.unpin.map(object => object.id);
        allReminders.unpin = allReminders.unpin.filter(({id}, index) => !ids.includes(id, index+1));
        ids = allReminders.done.map(object => object.id);
        allReminders.done = allReminders.done.filter(({id}, index) => !ids.includes(id, index+1));
    }
    return (
        <View style={styles.listContainer}>
            <Button title="New Reminder" onPress={() => navigation.push("SingleReminder", {reminder: {"id": null, "text": "", "pinned": false, "date": ""}})} />
        <SectionList
            sections = {[
                {title: 'Pinned', data: allReminders.pin},
                {title: 'Unpinned', data: allReminders.unpin},
                {title: 'Done', data: allReminders.done}
            ]}
            renderItem={({item}) => 
                <View style={{paddingVertical: 15,
                    paddingHorizontal: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center", 
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    backgroundColor: item.color}}>
                    <CheckBox
                        checked={item.done}
                        onPress={() => { changeDone(item); refresh();}}
                    />
                    <View>
                        <Text style={styles.item}>{item.text}</Text>
                        <Text style={styles.dateDisplay}>{moment(item.date).format('dddd MMMM Do YYYY, HH:mm A')}</Text>
                    </View>
                    <Icon name="edit" size={40} color="#000" style={{margin: 10}} onPress= {() => { navigation.push("SingleReminder", {reminder: item, reminders: allReminders}) }}/>
                </View>}
            renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
            keyExtractor={item => item.id.toString()}
            refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={refresh}
                />
              }
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

async function getAllReminders() {
    pinned = [];
    unpinned = [];
    finished = [];
    AsyncStorage.getItem('reminders').then(result => {
        reminders = JSON.parse(result);
        for (reminder of reminders) {
            if (reminder.done) {
                finished.push(reminder) ;
            } else if (reminder.pinned) {
                pinned.push(reminder);
            } else {
                unpinned.push(reminder);
            }
        }
        allReminders = {pin: pinned, unpin: unpinned, done: finished};
    }).catch(err => {
        console.log(err);
    });
}

async function changeDone(item) {
    for (var i = 0; i < allReminders.pin.length; i++) {
        if (allReminders.pin[i].id == item.id) {
            allReminders.pin[i].done = !allReminders.pin[i].done;
        }
    }
    for (var i = 0; i < allReminders.unpin.length; i++) {
        if (allReminders.unpin[i].id == item.id) {
            allReminders.unpin[i].done = !allReminders.unpin[i].done;
        }
    }
    for (var i = 0; i < allReminders.done.length; i++) {
        if (allReminders.done[i].id == item.id) {
            allReminders.done[i].done = !allReminders.done[i].done;
            if (!allReminders.done[i].done) {
                if (allReminders.done[i].pinned) {
                    allReminders.pin.push(allReminders.done[i]);
                } else {
                    allReminders.unpin.push(allReminders.done[i]);
                }
                allReminders.done.splice(i, 1);
                i--;
            }
        }
    }
    const both = allReminders.pin.concat(allReminders.unpin.concat(allReminders.done));
    try {
        await AsyncStorage.setItem('reminders', JSON.stringify(both));
    } catch (error) {
        console.log(1);
    }
}