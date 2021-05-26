import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { AsyncStorage, Button, TextInput, StyleSheet, Text, View } from 'react-native';
import { CheckBox } from 'react-native-elements'

var allReminders = null;
getAllReminders();

export default function SingleReminder({route, navigation}) {
    const { reminder } = route.params;
    const [text, onChangeText] = useState(reminder.text);
    const [date, onChangeDate] = useState(reminder.date);
    const [pinned, changePinned] = useState(reminder.pinned);
    const addReminder = async function() {
        var id = 0;
        for (var i = 0; i < allReminders.pin.length; i++) {
            if (allReminders.pin[i].id > id) {
                id = allReminders.pin[i].id;
            }
        }
        for (var i = 0; i < allReminders.unpin.length; i++) {
            if (allReminders.unpin[i].id > id) {
                id = allReminders.unpin[i].id;
            }
        }
        id++;
        if (pinned) {
            allReminders.pin.push({"id": id, "text": text, "pinned": pinned, "date": date});
        } else {
            allReminders.unpin.push({"id": id, "text": text, "pinned": pinned, "date": date});
        }
        ids = allReminders.pin.map(object => object.id);
        allReminders.pin = allReminders.pin.filter(({id}, index) => !ids.includes(id, index+1));
        ids = allReminders.unpin.map(object => object.id);
        allReminders.unpin = allReminders.unpin.filter(({id}, index) => !ids.includes(id, index+1));
        const both = allReminders.pin.concat(allReminders.unpin);
        try {
            await AsyncStorage.setItem('reminders', JSON.stringify(both));
        } catch (error) {
            console.log(1);
        }
        console.log(both);
        navigation.reset({index: 1, routes: [{name: "Home"}, {name: "Reminders", params: {pin: allReminders.pin, unpin: allReminders.unpin}}],});
    }
    const deleteReminder = async function() {
        if (reminder.id == null) {
            navigation.reset({index: 1, routes: [{name: "Home"}, {name: "Reminders"}],})
            return;
        }
        id = reminder.id;
        for (var i = 0; i < allReminders.pin.length; i++) {
            if (allReminders.pin[i].id == id) {
                allReminders.pin.splice(i, 1);
                i--;
            }
        }
        for (var i = 0; i < allReminders.unpin.length; i++) {
            if (allReminders.unpin[i].id == id) {
                allReminders.unpin.splice(i, 1);
                i--;
            }
        }
        ids = allReminders.pin.map(object => object.id);
        allReminders.pin = allReminders.pin.filter(({id}, index) => !ids.includes(id, index+1));
        ids = allReminders.unpin.map(object => object.id);
        allReminders.unpin = allReminders.unpin.filter(({id}, index) => !ids.includes(id, index+1));
        const both = allReminders.pin.concat(allReminders.unpin);
        try {
            await AsyncStorage.setItem('reminders', JSON.stringify(both));
        } catch (error) {
            console.log(1);
        }
        console.log(both);
        navigation.reset({index: 1, routes: [{name: "Home"}, {name: "Reminders", params: {pin: allReminders.pin, unpin: allReminders.unpin}}],});
    }
    const saveReminder = async function() {
        if (reminder.id == null) {
            addReminder();
            return;
        }
        id = reminder.id;
        newReminder = {"id": id, "text": text, "pinned": pinned, "date": date};
        var done = false;
        for (var i = 0; i < allReminders.pin.length; i++) {
            if (allReminders.pin[i].id == id) {
                allReminders.pin.splice(i, 1);
                i--;
                done = true;
            }
        }
        if (!done) {
            for (var i = 0; i < allReminders.unpin.length; i++) {
                if (allReminders.unpin[i].id == id) {
                    allReminders.unpin.splice(i, 1);
                    i--;
                }
            }
        }
        if (pinned) {
            allReminders.pin.push(newReminder);
        } else {
            allReminders.unpin.push(newReminder);
        }
        ids = allReminders.pin.map(object => object.id);
        allReminders.pin = allReminders.pin.filter(({id}, index) => !ids.includes(id, index+1));
        ids = allReminders.unpin.map(object => object.id);
        allReminders.unpin = allReminders.unpin.filter(({id}, index) => !ids.includes(id, index+1));
        const both = allReminders.pin.concat(allReminders.unpin);
        try {
            await AsyncStorage.setItem('reminders', JSON.stringify(both));
        } catch (error) {
            console.log(1);
        }
        console.log(allReminders.pin);
        navigation.reset({index: 1, routes: [{name: "Home"}, {name: "Reminders", params: {pin: allReminders.pin, unpin: allReminders.unpin}}],});
    }
    return (
        <View style={styles.listContainer}>
            <Text style={{fontSize: 20, textAlign: 'center'}}>Title</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={onChangeText}
                value={text}
            />
            <Text style={{fontSize: 16, textAlign: 'center'}}>Date and Time</Text>
            <TextInput
                style={styles.dateInput}
                onChangeText={onChangeDate}
                value={date}
            />
            <CheckBox
                center
                title='Pinned'
                checked={pinned}
                onPress={() => changePinned(!pinned)}
            />
            <Button
                title="Save"
                onPress={() => saveReminder()}
            />
            <Button
                title="Delete"
                onPress={() => deleteReminder()}
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
  textInput: {
    height: 80,
    margin: 12,
    borderWidth: 1,
    fontSize: 30,
    textAlign: 'center',
  },
  dateInput: {
    height: 60,
    margin: 12,
    borderWidth: 1,
    fontSize: 24,
    textAlign: 'center',
  },
});

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