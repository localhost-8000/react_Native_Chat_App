import React, { useEffect, useLayoutEffect, useState } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, View } from 'react-native'

import { Button, Input } from "react-native-elements";
import { StatusBar } from "expo-status-bar"
import { auth } from '../config/firebase';

import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { Keyboard } from 'react-native';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: "center"
        })
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(authUser => {
            if(authUser) {
                navigation.replace("Home");
            }
        });

        return unsubscribe;
    }, []);

    const signin = () => {
        Keyboard.dismiss();
        setLoading(true);
        auth
        .signInWithEmailAndPassword(email, password)
        .catch(err => {
            alert(err.message);
            setLoading(false);
        });
    }

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
        <KeyboardAvoidingView 
            style={styles.mainContainer}
            behavior={Platform.OS === "ios" ? "padding" : null} 
            keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}
        >
            <StatusBar style="light" />
            <View style={styles.inputContainer}>
                <Input 
                    placeholder="Email" 
                    autoFocus 
                    textContentType="emailAddress"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    leftIcon={
                        <MaterialIcons name="mail" size={24} color="black" />
                    }
                    leftIconContainerStyle={{
                        marginRight: 5
                    }}
                />
                <Input 
                    placeholder="Password" 
                    textContentType="password" 
                    secureTextEntry={true}
                    value={password}
                    onChangeText={text => setPassword(text)}    
                    leftIcon={
                        <MaterialIcons name="lock" size={24} color="black" />
                    }
                    leftIconContainerStyle={{
                        marginRight: 5
                    }}
                />
            </View>
            <View style={styles.btnContainer}>
                <Button style={styles.btn} title="Login" onPress={signin}/>
                <Button style={styles.btn} type="outline" title="Register" onPress={() => navigation.navigate("Register")}/>
            </View>
            {maybeRenderUploadingOverlay()}
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        padding: 10
    },
    inputContainer: {
        width: 300,
    },
    btnContainer: {
        marginVertical: 10,
        width: 200,
        height: 140,
        justifyContent: "space-evenly"
    },
    btn: {
        // marginTop: 10
    }
})
