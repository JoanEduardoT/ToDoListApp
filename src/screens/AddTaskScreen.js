import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';

const AddTaskScreen = ({ route, navigation }) => {
  const { onSave } = route.params;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSave = () => {
    if (name.trim() === '') {
      alert('El nombre de la tarea es obligatorio');
      return;
    }
  
    const newTask = {
      name,
      description,
      date: date ? date.toISOString().split('T')[0] : null,
      time: time || null,
      completed: false,
    };
    
    onSave(newTask);
    navigation.goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon
          name="checkmark"
          size={24}
          color="green"
          style={{ marginRight: 15 }}
          onPress={handleSave}
        />
      ),
    });
  }, [navigation, handleSave, name, description, date, time]);

  const renderDatePicker = () => {
    if (Platform.OS === 'web') {
      return (
        <input
          type="date"
          value={date ? date.toISOString().split('T')[0] : ''}
          onChange={(e) => setDate(new Date(e.target.value))}
          style={styles.dateInput}
        />
      );
    }
    return (
      <>
        <Text style={styles.date} onPress={() => setShowDatePicker(true)}>
          {date ? date.toISOString().split('T')[0] : 'Seleccionar Fecha'}
        </Text>
        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setDate(selectedDate || date);
              setShowDatePicker(false);
            }}
          />
        )}
      </>
    );
  };
  
  const renderTimePicker = () => {
    if (Platform.OS === 'web') {
      return (
        <input
          type="time"
          value={time || ''}
          onChange={(e) => setTime(e.target.value)}
          style={styles.timeInput}
        />
      );
    }
    return (
      <>
        <Text style={styles.time} onPress={() => setShowTimePicker(true)}>
          {time || 'Seleccionar Hora'}
        </Text>
        {showTimePicker && (
          <DateTimePicker
            value={time ? new Date(`1970-01-01T${time}`) : new Date()}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              const hours = selectedTime.getHours().toString().padStart(2, '0');
              const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
              setTime(`${hours}:${minutes}`);
              setShowTimePicker(false);
            }}
          />
        )}
      </>
    );
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la tarea"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Fecha</Text>
      {renderDatePicker()}

      <Text style={styles.label}>Hora</Text>
      {renderTimePicker()}

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.descriptionInput}
        placeholder="Descripción de la tarea"
        value={description}
        onChangeText={setDescription}
        multiline={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    height: 100,
    textAlignVertical: 'top',
  },
  date: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  time: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  dateInput: {
    border: '1px solid #ccc',
    padding: 5,
    borderRadius: 5,
  },
  timeInput: {
    border: '1px solid #ccc',
    padding: 5,
    borderRadius: 5,
  },
});

export default AddTaskScreen;
