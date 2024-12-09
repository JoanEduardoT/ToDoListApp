import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, ScrollView, SafeAreaView } from 'react-native';
import FloatingButton from '../components/FloatingButton';

const TaskListScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([
    { id: '1', name: 'A', description: '', date: '2024-12-06', time: '10:00', completed: false },
    { id: '2', name: 'B', description: '', date: '2024-12-07', time: '14:00', completed: true },
    { id: '3', name: 'C', description: '', date: '2024-12-08', time: '09:00', completed: false },
    { id: '4', name: 'D', description: '', date: '2024-12-10', time: '16:00', completed: false },
    { id: '5', name: 'E', description: '', date: '', time: '', completed: false },
  ]);

  const handleAddTask = (newTask) => {
    setTasks([...tasks, { id: Date.now().toString(), ...newTask }]);
  };

  const handleEditTask = (updatedTask) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const groupTasksByDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const manana = new Date(today);
    manana.setDate(manana.getDate() + 1);

    const groupedTasks = {
      atrasadas: [],
      hoy: [],
      manana: [],
      masTarde: [],
      sinFecha: [],
    };

    tasks.forEach((task) => {
      if (!task.date || task.date.trim() === '') {
        groupedTasks.sinFecha.push(task);
      } else {
        const taskDate = new Date(task.date);

        if (isNaN(taskDate)) {
          groupedTasks.sinFecha.push(task);
        } else {
          const normalizedTaskDate = new Date(taskDate);
          normalizedTaskDate.setHours(0, 0, 0, 0);

          if (normalizedTaskDate < today) {
            groupedTasks.atrasadas.push(task);
          } else if (normalizedTaskDate.getTime() === today.getTime()) {
            groupedTasks.hoy.push(task);
          } else if (normalizedTaskDate.getTime() === manana.getTime()) {
            groupedTasks.manana.push(task);
          } else if (normalizedTaskDate > manana) {
            groupedTasks.masTarde.push(task);
          }
        }
      }
    });

    return groupedTasks;
  };

  const formatTimeTo12Hour = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12;
    return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const groupedTasks = groupTasksByDate();

  const renderSection = (title, tasks) => (
    tasks.length > 0 && (
      <View key={title}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {tasks.map((task) => (
          <Pressable
            key={task.id}
            style={styles.task}
            onPress={() =>
              navigation.navigate('EditTask', {
                task: task,
                onSave: handleEditTask,
                onDelete: handleDeleteTask,
              })
            }
          >
            <Pressable onPress={() => toggleTaskStatus(task.id)}>
              <Text style={task.completed ? styles.checkMark : styles.xMark}>
                {task.completed ? '✓' : '✗'}
              </Text>
            </Pressable>
            <View style={styles.taskDetails}>
              <Text style={styles.taskName}>{task.name}</Text>
              <Text style={styles.taskDate}>
                {task.date || 'Sin Fecha'} {task.time && `- ${formatTimeTo12Hour(task.time)}`}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    )
  );

  return (
    <View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {renderSection('ATRASADAS', groupedTasks.atrasadas)}
        {renderSection('HOY', groupedTasks.hoy)}
        {renderSection('MAÑANA', groupedTasks.manana)}
        {renderSection('MAS TARDE', groupedTasks.masTarde)}
        {renderSection('SIN FECHA', groupedTasks.sinFecha)}
      </ScrollView>
      <FloatingButton
        onPress={() => navigation.navigate('AddTask', { onSave: handleAddTask })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    overflow: 'scroll',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 16,
    color: '#333',
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  checkMark: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 10,
  },
  xMark: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 10,
  },
  taskDetails: {
    flex: 1,
  },
  taskName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskDate: {
    color: '#888',
    marginTop: 5,
  },
});

export default TaskListScreen;
