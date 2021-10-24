import React, { useLayoutEffect } from 'react'
import { TouchableOpacity, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { Avatar } from 'react-native-elements'
import colors from "../config/colors";
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { auth } from '../config/firebase';

export default function ProfileScreen({navigation, route}) {


    const signOutUser = () => {
        auth.signOut()
        .then(() => {
            navigation.reset({
                index: 0,
                routes: [{name: "Login"}]
            });
        })
        .catch(err => {
            alert(err.message);
        });
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                auth.currentUser.email === route.params.email &&
                <TouchableOpacity activeOpacity={0.7} style={{marginRight: 10}}>
                    <Entypo name="log-out" size={25} color="white" onPress={signOutUser}/>
                </TouchableOpacity>
            )
        })
    }, [navigation]);


    return (
        <SafeAreaView style={styles.profileContainer}>
            <Avatar 
                rounded
                size={200}
                source={{
                    uri: 
                        route.params.photoUrl || 
                        "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png"
                }}
                containerStyle={{
                    borderWidth: 2,
                    borderColor: colors.headerColor,

                }}
            />
            <View style={styles.profileContent}>
                <Text style={styles.userName}>{route.params.displayName}</Text>
                <Text style={styles.bio} numberOfLines={3}>Will be implemented soon</Text>
            </View>
            <View style={styles.mailContainer}>
                <MaterialIcons name="email" size={26} color="black" />
                <Text style={styles.mail}>{route.params.email}</Text>
            </View>
            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    profileContainer: {
        flex: 1,
        backgroundColor: "#ECECEC",
        alignItems: "center",
        padding: 20
    },
    profileContent: {
        marginTop: 10,

    },
    userName: {
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center"
    },
    bio: {
        fontSize: 15,
        textAlign: "center"
    },
    mailContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        paddingHorizontal: 10,
        borderBottomColor: "black",
        borderBottomWidth: 1
    },
    mail: {
        fontSize: 18,
        fontWeight: "700",
        marginLeft: 10
    }
});
