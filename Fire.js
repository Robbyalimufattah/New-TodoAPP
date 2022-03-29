import firebase from "firebase"
import "@firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyB--qBfSYExMwQLOzs9A16Rkr1TOfrjFpk",
    authDomain: "todo-app-70405.firebaseapp.com",
    projectId: "todo-app-70405",
    storageBucket: "todo-app-70405.appspot.com",
    messagingSenderId: "915821852680",
    appId: "1:915821852680:web:1e4aa0461b5184c53139bd"
};

export default class Fire {

    constructor(callback) {
        this.init(callback)
    }

    init(callback) {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig)
        }

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                callback(null, user)
            } else {
                firebase
                .auth()
                .signInAnonymously()
                .catch(error => {
                    callback(error)
                })
            }
        })
    }

    getLists(callback) {
        let ref = this.ref.orderBy("name");
    
        this.unsubscribe = ref.onSnapshot((snapshot) => {
          lists = [];
    
          snapshot.forEach((doc) => {
            lists.push({ id: doc.id, ...doc.data() });
          });
    
          callback(lists);
        });
        }
    
      addList(list) {
        let ref = this.ref;
    
        ref.add(list);
        }
    
      updateList(list) {
        let ref = this.ref;
    
        ref.doc(list.id).update(list);
      }
    
      deleteList(list) {
        let ref = this.ref;
    
        ref.doc(list.id).delete();
      }
    
      get userId() {
        return firebase.auth().currentUser.uid;
      }
    
      get ref() {
        return firebase
          .firestore()
          .collection("users")
          .doc(this.userId)
          .collection("lists");
      }
    
      detach() {
        this.unsubscribe();
        }
}