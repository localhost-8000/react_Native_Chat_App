import React, { useLayoutEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { Input, Button } from "react-native-elements"
import { FontAwesome } from '@expo/vector-icons';
import { db } from '../config/firebase';
import { Keyboard } from 'react-native';

export default function AddChatScreen({ navigation }) {
    const [chatName, setChatName] = useState("");
    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Create new chat"
        })
    }, [navigation]);

    const createChat = async () => {
        Keyboard.dismiss();
        setLoading(true);
        await db.collection("chats").add({
            chatName: chatName
        })
        .then(() => {
            navigation.goBack();
        })
        .catch(err => {
            alert(err.message);
            setLoading(false);
        })
    };

    const maybeRenderUploadingOverlay = () => {
        if ( loading ) {
          return (
            <View
                style={[
                    StyleSheet.absoluteFill,
                    {
                        backgroundColor: "rgba(0,0,0,0.4)",
                        alignItems: "center",
                        justifyContent: "center",
                    },
                ]}
            >
              <ActivityIndicator color="#fff" animating size="large" />
            </View>
          );
        }
      };

    return (
        <View style={styles.mainContainer}>
            <Input 
                placeholder="Chat name"
                leftIcon={
                    <FontAwesome name="wechat" size={24} color="black" />
                }
                leftIconContainerStyle={styles.leftIcon}
                value={chatName}
                onChangeText={text => setChatName(text)}
            />
            <Button 
                title="Create new chat"
                onPress={createChat}
                containerStyle={styles.button}
                disabled={chatName.length < 6}
            />
            {maybeRenderUploadingOverlay()}
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 30,
        height: "100%"
    },
    leftIcon: {
        marginRight: 5
    },
    button: {
        marginTop: 10
    }
})
