import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Avatar } from 'react-native-elements'
import { auth } from '../config/firebase'
import colors from "../config/colors";
import { useNavigation } from '@react-navigation/native';

export default function ChatBox({ id, data, chatColor }) {

    const navigation = useNavigation();
    
    const enterProfile = () => {
        navigation.navigate("Profile", {
            displayName: data.displayName,
            email: data.email,
            photoUrl: data.photoUrl
        })
        
    }

    return (
        (data.email === auth.currentUser.email) ? (
            <View key={id} style={styles.sender}>
                <Avatar 
                    position="absolute"
                    bottom={-15}
                    right={-5}
                    containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        right: -5
                    }}
                    size={25}
                    source={{
                        uri: data.photoUrl ? data.photoUrl : "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png"
                    }}
                    rounded
                />
                <Text style={styles.senderText}>{data.message}</Text>
            </View>
        ) : (
            <View key={id} style={[styles.receiver, {backgroundColor: `${chatColor}89`}]}>
                <Avatar  
                    position="absolute"
                    bottom={-15}
                    left={-5}
                    containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        left: -5
                    }}
                    size={25}
                    source={{
                        uri: data.photoUrl ? data.photoUrl : "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png"
                    }}
                    rounded
                    onPress={enterProfile}
                />
                <Text style={[styles.receiverName, {backgroundColor: chatColor}]} numberOfLines={1}>{data.displayName}</Text>
                <Text style={styles.receiverText}>{data.message}</Text>
            </View>
        )
    )
}

const styles = StyleSheet.create({
    sender: {
        padding: 15,
        backgroundColor: "#ECECEC",
        alignSelf: "flex-end",
        borderRadius: 20,
        borderTopRightRadius: 0,
        margin: 15,
        minWidth: 100,
        maxWidth: "80%",
        position: "relative"
    },
    senderText: {
        color: "black",
        fontWeight: "500",
        marginRight: 5,
    },
    receiver: {
        padding: 15,
        backgroundColor: colors.secondaryColor,
        alignSelf: "flex-start",
        borderRadius: 15,
        borderTopLeftRadius: 0,
        marginHorizontal: 15,
        marginVertical: 20,
        minWidth: 120,
        maxWidth: "80%",
        position: "relative",
    },
    receiverText: {
        color: "black",
        fontWeight: "600",
        marginLeft: 5,
    },
    receiverName: {
        position: "absolute",
        top: -20,
        left: 0,
        color: "black",
        fontWeight: "700",
        fontSize: 12,
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: "tomato",
        maxWidth: "80%"
    },
})
