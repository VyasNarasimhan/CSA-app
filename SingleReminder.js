import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { AsyncStorage, Button, TextInput, StyleSheet, Text, View, Platform } from 'react-native';
import { CheckBox } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

var allReminders = null;
getAllReminders();

export default function SingleReminder({route, navigation}) {
    const { reminder } = route.params;
    const [text, onChangeText] = useState(reminder.text);
    var date = new Date();
    var time = new Date();
    if (reminder.date != '') {
        date = reminder.date.split(' ')[0];
        time = moment().format('YYYY-MM-DD') + ' ' + reminder.date.split(' ')[1];
    }
    const [reminderDate, setDate] = useState(new Date(moment(date)));
    const [reminderTime, setTime] = useState(new Date(moment(time)));
    const [pinned, changePinned] = useState(reminder.pinned);
    const [color, setColor] = useState(reminder.color);
    colors = {'#fc0303': "Red", '#fc7b03': 'Orange', '#fcf403': 'Yellow', '#69f505': 'Green', '#0575f5': 'Blue', '#a905f5': 'Purple'};
    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || reminderDate;
        setDate(currentDate);
    };
    const onChangeTime = (event, selectedDate) => {
        const currentDate = selectedDate || reminderDate;
        setTime(currentDate);
    };
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
        for (var i = 0; i < allReminders.done.length; i++) {
            if (allReminders.done[i].id > id) {
                id = allReminders.done[i].id;
            }
        }
        id++;
        const date = moment(reminderDate, "YYYY-MM-DD");
        const time = moment(reminderTime, "HH:mm");
        if (pinned) {
            allReminders.pin.push({"id": id, "text": text, "pinned": pinned, "date": moment(reminderDate).format("YYYY-MM-DD") + ' ' + moment(reminderTime).format("HH:mm"), "done": false, "color": color});
        } else {
            allReminders.unpin.push({"id": id, "text": text, "pinned": pinned, "date": moment(reminderDate).format("YYYY-MM-DD") + ' ' + moment(reminderTime).format("HH:mm"), "done": false, "color": color});
        }
        ids = allReminders.pin.map(object => object.id);
        allReminders.pin = allReminders.pin.filter(({id}, index) => !ids.includes(id, index+1));
        ids = allReminders.unpin.map(object => object.id);
        allReminders.unpin = allReminders.unpin.filter(({id}, index) => !ids.includes(id, index+1));
        ids = allReminders.done.map(object => object.id);
        allReminders.done = allReminders.done.filter(({id}, index) => !ids.includes(id, index+1));
        const both = allReminders.pin.concat(allReminders.unpin.concat(allReminders.done));
        try {
            await AsyncStorage.setItem('reminders', JSON.stringify(both));
        } catch (error) {
            console.log(1);
        }
        navigation.reset({index: 1, routes: [{name: "Home"}, {name: "Reminders", params: {pin: allReminders.pin, unpin: allReminders.unpin, done: allReminders.done}}],});    
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
        for (var i = 0; i < allReminders.done.length; i++) {
            if (allReminders.done[i].id == id) {
                allReminders.done.splice(i, 1);
                i--;
            }
        }
        ids = allReminders.pin.map(object => object.id);
        allReminders.pin = allReminders.pin.filter(({id}, index) => !ids.includes(id, index+1));
        ids = allReminders.unpin.map(object => object.id);
        allReminders.unpin = allReminders.unpin.filter(({id}, index) => !ids.includes(id, index+1));
        ids = allReminders.done.map(object => object.id);
        allReminders.done = allReminders.done.filter(({id}, index) => !ids.includes(id, index+1));
        const both = allReminders.pin.concat(allReminders.unpin.concat(allReminders.done));
        try {
            await AsyncStorage.setItem('reminders', JSON.stringify(both));
        } catch (error) {
            console.log(1);
        }
        navigation.reset({index: 1, routes: [{name: "Home"}, {name: "Reminders", params: {pin: allReminders.pin, unpin: allReminders.unpin, done: allReminders.done}}],});
    }
    const saveReminder = async function() {
        if (reminder.id == null) {
            addReminder();
            return;
        }
        id = reminder.id;
        newReminder = {"id": id, "text": text, "pinned": pinned, "date": moment(reminderDate).format("YYYY-MM-DD") + ' ' + moment(reminderTime).format("HH:mm"), "done": false, "color": color};
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
                    done = true;
                }
            }
        }
        if (!done) {
            for (var i = 0; i < allReminders.done.length; i++) {
                if (allReminders.done[i].id == id) {
                    allReminders.done.splice(i, 1);
                    i--;
                    done = true;
                }
            }
        }
        if (reminder.done) {
            allReminders.done.push(newReminder);
        } else if (pinned) {
            allReminders.pin.push(newReminder);
        } else {
            allReminders.unpin.push(newReminder);
        }
        ids = allReminders.pin.map(object => object.id);
        allReminders.pin = allReminders.pin.filter(({id}, index) => !ids.includes(id, index+1));
        ids = allReminders.unpin.map(object => object.id);
        allReminders.unpin = allReminders.unpin.filter(({id}, index) => !ids.includes(id, index+1));
        ids = allReminders.done.map(object => object.id);
        allReminders.done = allReminders.done.filter(({id}, index) => !ids.includes(id, index+1));
        const both = allReminders.pin.concat(allReminders.unpin.concat(allReminders.done));
        try {
            await AsyncStorage.setItem('reminders', JSON.stringify(both));
        } catch (error) {
            console.log(1);
        }
        navigation.reset({index: 1, routes: [{name: "Home"}, {name: "Reminders", params: {pin: allReminders.pin, unpin: allReminders.unpin, done: allReminders.done}}],});
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
            <DateTimePicker
                value={reminderDate}
                mode={'date'}
                is24Hour={true}
                onChange={onChangeDate}
            />
            <DateTimePicker
                value={reminderTime}
                mode={'time'}
                is24Hour={true}
                onChange={onChangeTime}
            />
            <CheckBox
                center
                title='Pinned'
                checked={pinned}
                onPress={() => changePinned(!pinned)}
            />
            <Text style={{fontSize: 16, textAlign: 'center'}}>Color: {colors[color]}</Text>
            <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                <Button title="Red" color="#fc0303" onPress={() => setColor('#fc0303')}/>
                <Button title="Orange" color="#fc7b03" onPress={() => setColor('#fc7b03')}/>
                <Button title="Yellow" color="#f5e105" onPress={() => setColor('#fcf403')}/>
                <Button title="Green" color="#69f505" onPress={() => setColor('#69f505')}/>
                <Button title="Blue" color="#0575f5" onPress={() => setColor('#0575f5')}/>
                <Button title="Purple" color="#a905f5" onPress={() => setColor('#a905f5')}/>
            </View>
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
  colorButtons:{
    marginRight:40,
    marginLeft:40,
    marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
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