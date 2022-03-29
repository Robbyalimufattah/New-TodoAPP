import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import colors from "./src/exports/Colors";
import TodoList from "./components/TodoList";
import AddListModal from "./components/AddListModal";
import Fire from "./Fire";


export default class App extends Component {

  state = {
    addToDoVisible: false,
    lists: [],
    user: {},
    loading: true
  };

  componentDidMount() {
    firebase = new Fire((error, user) => {
      if (error) {
        return alert("Uh oh, something went wrong")
      }

      firebase.getLists(lists => {
        this.setState({ lists, user }, () => {
          this.setState({ loading: false });
        })
      })

      this.setState({ user })
    });
  }

  componentWillUnmount() {
    firebase.detach();
    return () => {
      firebase.detach();
    };
  }



  toggleAddToDoModal() {
    this.setState({ addToDoVisible: !this.state.addToDoVisible })
  }

  renderList = list => {
    return <TodoList list={list} updateList={this.updateList} />
  }

  // addList = list => {
  //   this.setState({ lists: [...this.state.lists, {...list, id: this.state.lists.length + 1, todos: [] }] })
  // };
  addList = (list) => {
    firebase.addList({
      name: list.name,
      color: list.color,
      todos: [],
    });
  };

  updateList = (list) => {
    firebase.updateList(list);
  };

  render() {
    return (
      <View style={styles.container}>
        <Modal 
          animationType="slide" 
          visible={this.state.addToDoVisible}
          onRequestClose={() => this.toggleAddToDoModal()}
        >
          <AddListModal closeModal={() => this.toggleAddToDoModal()} addList={this.addList} />
        </Modal>

        <View style={{flexDirection:"row"}}>
          <View style={styles.divider} />
            <Text style={styles.title}>
              Todo <Text style={styles.list}>Lists</Text>
            </Text>
          <View style={styles.divider} />
        </View>

        <View style={{marginVertical: 48}}>
          <TouchableOpacity style={styles.addList} onPress={() => this.toggleAddToDoModal()}>
            <AntDesign name="plus" size={16} color={colors.blue} />
          </TouchableOpacity>

          <Text style={styles.add}>Add List</Text>
        </View>

        <View style={{height: 275, paddingLeft: 32}}>
          <FlatList 
            data={this.state.lists}
            keyExtractor={item => item.name}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (this.renderList(item))}
            keyboardShouldPersistTaps="always"
          />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  divider: {
    backgroundColor: colors.lightBlue,
    height: 1,
    flex: 1,
    alignSelf: "center"
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: colors.black,
    paddingHorizontal: 64 
  },
  list: {
    fontWeight: "300",
    color: colors.blue
  },
  addList: {
    borderWidth: 2,
    borderColor: colors.lightBlue,
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  add: {
    color: colors.blue,
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8
  }
});