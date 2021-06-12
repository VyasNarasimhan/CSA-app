import React, {useState} from 'react';
import { KeyboardAvoidingView, Text, View, StyleSheet, Button, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import {NavigationContainer, useNavigation, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from 'react-native';

const NotesApp = () => {

  const [noteText, setNoteText] = useState("note");

  return (
    <View style={styles.mainView}>

      <Text style={styles.text}>Notes</Text>
      <ScrollView style={styles.contentArea}>
        <TaskCard internalText='Ingredients for pineapple pizza: pineapple, cheese, ham, flour, and love 🥰' val='1'/>
        <TaskCard internalText='Make sure to tell exterminator about the animal making noises in the crawl space' val='2'/>
        <TaskCard internalText='Remember to turn in all late work for Mr. Caudle' val='3'/>
        <TaskCard internalText="Make sure to study for the AP Calculus and Physics exams - DON'T CRAM LAST MINUTE!" val='4'/>
        <TaskCard internalText="Ideas for t-shirt: a cat (wearing sunglasses) standing on a burrito covered in cheese and mice" val='5'/>
        
        
      </ScrollView>
      <KeyboardAvoidingView style={styles.lowerBar}>
        <TextInput 
          style={styles.input} 
          placeholder="  Type a note"
          onChangeText={(input) => setNoteText(input)}
        />
      </KeyboardAvoidingView>

    </View>
  );
  
};

export default NotesApp;

const TaskCard = (props) => {

  return (
    <View style={styles.card} key={props.key}>
      <Text style={styles.cardText}>{props.internalText}</Text>
    </View>
  )
}

function CreateNote(){

  const [text, setText] = useState('');
  const navigation = useNavigation();

  const saveNote = async ()  => {
    const value = await AsyncStorage.getItem("Notes");
    const _note = value ? JSON.parse(value) : [];
    _note.push(text);
    await AsyncStorage.setItem("Notes", JSON.stringify(n)).then(() => navigation.navigate("All Notes"));
    setText("")
  }

  return (
    <View>
      <TextInput 
        value={text}
        onChangeText={setText}
        multiline autoFocus
      />
      <KeyboardAvoidingView>
        <Button onpress={saveNote}>Type note</Button>
      </KeyboardAvoidingView>
    </View>
  );

}

function AllNotes(){

  const [notes, setNotes] = useState('');
  const navigation2 = useNavigation();

  useFocusEffect(
    React.useCallback(() => {getNotes()}, [])
  );

  const getNotes = () => {
    AsyncStorage.getItem("Notes").then((notes) => {
      setNotes(JSON.parse(notes));
    })
  }

}

const styles = StyleSheet.create({

  mainView: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#1f1d2b',
  },

  text: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
  }, 

  contentArea: {

  },

  lowerBar: {
    height: 60,
    marginTop: 10,
    marginBottom: 5,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    borderRadius: 20,
    backgroundColor: '#ffd414',
    padding: 20,
    marginVertical: 10,
  },

  cardText: {
    color: 'black',
    fontSize: 18,
  },

  input: {
    borderRadius: 20,
    height: 50,
    width: 370,
    backgroundColor: '#f2f2f2',
  },

});
