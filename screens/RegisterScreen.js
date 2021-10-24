import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Platform } from 'react-native';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native'
import { Input, Button, Text, Avatar } from 'react-native-elements';
import { auth, db, storage } from '../config/firebase';
import * as ImagePicker from "expo-image-picker";
import uuid from "uuid";
import { ActivityIndicator } from 'react-native';
import { Keyboard } from 'react-native';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Back to Login",
            headerTitleAlign: "center"
        })
    }, [navigation]);

    useEffect(() => {
        const initializeImagePicker = async () => {{
            if(Platform.OS !== "web") {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if(status !== "granted") {
                    alert("Sorry, we need camera roll permissions to make this work!");
                }
            }
        }}
        initializeImagePicker();
    }, [])

//===========create and register user===========================================
    const createUser = async (email, name) => {
        await db.collection(`users`).add({
            email: email,
            displayName: name,
            bio: "",
            groups: []
        });
    }

    const register = () => {
        Keyboard.dismiss();
        setLoading(true);
        auth.createUserWithEmailAndPassword(email, password)
        .then(async authUser => {
            authUser.user.updateProfile({
                displayName: name,
                photoURL: imageUrl
            });
            await createUser(email, name);
        })
        .catch(err => {
            alert(err.message);
            setLoading(false);
        });
    }

//==============================================================================

    const maybeRenderUploadingOverlay = () => {
        if (uploading || loading) {
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


//======== image select and upload section....==========================

    const pickImage = async () => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 4],
            mediaTypes: ImagePicker.MediaTypeOptions.Images
        });

        handleImagePicked(pickerResult);
    };

    const handleImagePicked = async (pickerResult) => {
        try {
            setUploading(true);

            if (!pickerResult.cancelled) {
                const uploadUrl = await uploadImageAsync(pickerResult.uri);
                setImageUrl(uploadUrl);
            }
        } catch (e) {
            console.log(e);
            alert("Upload failed, sorry :(");
        } finally {
            setUploading(false);
        }
    };

    const uploadImageAsync = async uri => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });
      
        const ref = storage.ref().child(uuid.v4());
        const snapshot = await ref.put(blob);
      
        blob.close();
      
        return await snapshot.ref.getDownloadURL();
      }

//=================================================================


    return (
        <KeyboardAvoidingView 
            style={styles.mainContainer}
            behavior={Platform.OS === "ios" ? "padding" : null} 
            keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}
        >
            <StatusBar style="light"/>
            <Text h3 style={styles.heading}>Create a Let's Chat account</Text>
            <Avatar 
                rounded
                size={100}
                titleStyle={{
                    color: "black"
                }}
                containerStyle={{
                    backgroundColor: "grey",
                    marginBottom: 30,
                }}
                source={{
                    uri: imageUrl || 
                    "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png"
                }}
                onPress={pickImage}
            />
            <View style={styles.inputContainer}>
                <Input 
                    autoFocus={true}
                    placeholder="Full Name"
                    value={name}
                    onChangeText={text => setName(text)}
                    textContentType="name"
                />
                <Input 
                    placeholder="mail@example.com"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    textContentType="emailAddress"
                />
                <Input 
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    textContentType="password"
                    secureTextEntry={true}
                />
            </View>
            <Button 
                containerStyle={styles.btn}
                title="Register"
                onPress={register}
            />
            {maybeRenderUploadingOverlay()}
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white"
    },
    heading: {
        marginBottom: 50,
        marginTop: -30,
        textAlign: "center"
    },
    inputContainer: {
        width: 300,
        marginTop: 20
    },
    btn: {
        width: 200,
        marginVertical: 10
    }
})
