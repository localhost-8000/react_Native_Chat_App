import React, { useEffect, useLayoutEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Avatar } from 'react-native-elements';
import CustomListItem from "../components/CustomListItem";
import { auth, db } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import colors from "../config/colors";


export default function HomeScreen({ navigation }) {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection("chats").onSnapshot(snapshot => {
            setChats(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
        });
        return unsubscribe;
    }, []);


    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Let's Chat",
            headerStyle: { backgroundColor: colors.headerColor },
            // headerTitleAlign: "center",
            headerTitleStyle: { color: "white" },
            headerTintColor: "black",
            headerRight: () => (
                <View style={{marginLeft: 20}}>
                    <TouchableOpacity activeOpacity={0.5} onPress={enterProfile}>
                        <Avatar 
                            rounded
                            size={40}
                            source={{
                                uri: auth?.currentUser?.photoURL ||
                                "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png"
                            }}
                        />
                    </TouchableOpacity>
                </View>
            )
        })
    }, []);

    const enterProfile = () => {
        let displayName = auth.currentUser.displayName;
        let email = auth.currentUser.email;
        let photoUrl = auth.currentUser.photoURL;

        navigation.navigate("Profile", {
            displayName,
            email,
            photoUrl
        })
    }

    const enterChat = (id, chatName) => {
        navigation.navigate("Chat", {
            id,
            chatName
        })
    }


    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar style="dark" />
            <ScrollView style={styles.scrollContainer}>
                {chats.map(({id, data: {chatName}}) => (
                    <CustomListItem 
                        key={id} 
                        id={id} 
                        chatName={chatName} 
                        enterChat={enterChat}
                    />
                ))}
            </ScrollView>
            <TouchableOpacity 
                style={styles.createBtnContainer}
                activeOpacity={0.7}
                onPress={() => navigation.navigate("AddChat")}
            >
                <Ionicons name="chatbubble-ellipses" size={30} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    scrollContainer: {
        height: "100%"
    },
    createBtnContainer: {
        position: "absolute",
        width: 65,
        height: 65,
        bottom: 15,
        right: 15,
        borderRadius: 75,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.headerColor
    }
});
