import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { KeyboardAvoidingView, TouchableOpacity, SafeAreaView, StyleSheet, Text, View, Platform } from 'react-native'
import { Avatar } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native';
import { TextInput } from 'react-native';
import { Keyboard } from 'react-native';
import firebase from "firebase";
import { auth, db } from '../config/firebase';
import ChatBox from '../components/ChatBox';
import colors from "../config/colors";

export default function ChatScreen({ navigation, route }) {
    const [inputMsg, setInputMsg] = useState("");
    const [messages, setMessages] = useState([]);
    const scrollViewRef = useRef();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitleVisible: false,
            headerTitle: () => (
                <View 
                    style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                >
                    <Avatar 
                        rounded
                        source={{
                            uri: 
                                messages?.[messages.length - 1]?.data?.photoUrl || 
                                "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png"
                        }}
                    />
                    <Text style={{color: "white", marginLeft: 10, fontSize: 16, fontWeight: "700", letterSpacing: 0.8}}>{route.params.chatName}</Text>
                </View>
            ),
            headerTitleAlign: "left",
            headerRight: () => (
                <View style={{width: 70, flexDirection: "row", justifyContent: "space-between", marginRight: 15}}>
                    <TouchableOpacity>
                        <MaterialIcons name="video-call" size={27} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="call" size={25} color="white" />
                    </TouchableOpacity>
                </View>
            )
        })
    }, [navigation, messages]);

    const sendMessage = () => {
        Keyboard.dismiss();

        db.collection("chats").doc(route.params.id).collection("messages").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: inputMsg,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoUrl: auth.currentUser.photoURL
        });

        setInputMsg("");
    }


    useLayoutEffect(() => {
        const unsubscribe = db
            .collection('chats')
            .doc(route.params.id).
            collection('messages').
            orderBy('timestamp', 'asc').
            onSnapshot(snapshot => {
                setMessages(snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
                })))
        });

        return unsubscribe;
    }, [route]);

    const chatColors = {};

    const findChatColor = (email, index) => {
        if( !chatColors.hasOwnProperty(email) ) {
            let ind = index % 10;
            chatColors[email] = colors.labels[ind];
        }
        return chatColors[email];
    }
    

    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={styles.chatContainer}
                keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}
            >
                <>
                    <ScrollView 
                        contentContainerStyle={{ paddingTop: 10 }} 
                        ref={scrollViewRef}
                        onContentSizeChange={() => {scrollViewRef.current.scrollToEnd({animated: true})}}
                    >
                        {messages.map(({id, data}, index) => (
                            <ChatBox key={id} id={id} data={data} chatColor={findChatColor(data.email, index)} />   
                        ))}
                    </ScrollView>
                    <View style={styles.footer}>
                        <TextInput 
                            placeholder="Write anything"
                            style={styles.textInput}
                            value={inputMsg}
                            onChangeText={text => setInputMsg(text)}
                            onSubmitEditing={sendMessage}
                        />
                        <TouchableOpacity activeOpacity={0.5} onPress={sendMessage} style={styles.sendBtn}>
                            <MaterialIcons name="flight-takeoff" size={26} color={colors.headerColor} />
                        </TouchableOpacity>
                    </View>
                </>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "white"
    },
    chatContainer: {
        flex: 1,
    
    },
    footer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
    },
    textInput: {
        bottom: 0,
        height: 45,
        flex: 1,
        marginRight: 15,
        borderColor: "transparent",
        backgroundColor: "#ECECEC",
        borderWidth: 1,
        padding: 10,
        color: "grey",
        borderRadius: 25,
        fontSize: 16
    },
    sendBtn: {
        width: 40,
        height: 40,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ECECEC"
    },
})
