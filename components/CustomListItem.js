import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { ListItem, Avatar } from "react-native-elements"
import { auth, db } from "../config/firebase";

export default function CustomListItem({ id, chatName, enterChat }) {
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        const unsubscribe = db
            .collection("chats")
            .doc(id)
            .collection("messages")
            .orderBy("timestamp", "desc")
            .onSnapshot(snapshot => 
                setChatMessages(snapshot.docs.map(doc => doc.data()))
            );

        return unsubscribe;
    }, [])

    return (
        <ListItem 
            bottomDivider
            key={id} 
            onPress={() => enterChat(id, chatName)}
        >
            <Avatar 
                rounded
                size={40}
                source={{
                    uri:
                        chatMessages?.[0]?.photoUrl || auth?.currentUser?.photoURL ||
                        "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png"
                }}
            />
            <ListItem.Content>
                <ListItem.Title style={{fontWeight: "700"}}>{chatName}</ListItem.Title>
                <ListItem.Subtitle ellipsizeMode="tail" numberOfLines={1}>
                    {chatMessages?.[0]?.displayName}: {chatMessages?.[0]?.message}
                </ListItem.Subtitle>
            </ListItem.Content>
            
        </ListItem>
    )
}

const styles = StyleSheet.create({})
