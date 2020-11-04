import React, { Component } from 'react'
import { Text, StyleSheet, SafeAreaView, ImageBackground, Image, View } from 'react-native'
import Snackbar from 'react-native-snackbar';
import { images, colors, utils } from "@config"
import { CardView, Button, InputText } from "@component/views"
import api from "@service/api"
import { verticalScale, scale } from "react-native-size-matters"
import AsyncStorage from '@react-native-community/async-storage';



export default class LoginScreen extends Component {


    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            fields: {},
            errors: {},
            isLoading: false
        }

        this.onLogin = this.onLogin.bind(this);
        this.validate = this.validate.bind(this);
        this.onChangeField = this.onChangeField.bind(this);
    }


    onChangeField(field, value) {
        let fields = this.state.fields;
        let errors = this.state.errors;

        fields[field] = value;
        errors[field] = "";

        this.setState({
            fields, errors
        })
    }



    validate() {
        let fields = this.state.fields;
        let errors = {}
        let isFormValid = true;

        if (!fields['email']) {
            errors['email'] = 'Type your email.'
            isFormValid = false;
        }

        if (!fields['password']) {
            errors['password'] = 'Type your password'
            isFormValid = false;
        }

        this.setState({
            errors, fields
        })

        return isFormValid
    }


    onLogin() {
        const fields = this.state.fields;

        if (this.validate()) {
            this.setState({
                isLoading: true,
            });

            api.login(fields['email'], fields['password'])
                .then(data => {
                    this.setState({
                        isLoading: false,
                    });

                    if (data.status == 'error') {
                        let code = data.error.code;
                        if (code == 402) {
                            Snackbar.show({
                                text: "Email or password doesn't match.",
                            });
                        } else {
                            Snackbar.show({
                                text: 'System error. Try again later.',
                            });
                        }
                    } else {
                        let token = data.data.token;

                        AsyncStorage.setItem('USER_TOKEN', token).then(() => {
                            this.props.navigation.navigate('TagsScreen');
                        });
                    }
                })
                .catch(() => {
                    this.setState({
                        isLoading: false,
                    });
                    Snackbar.show({
                        text: 'System error. Try again later.',
                    });
                });
        }
    }

    render() {
        return (
            <ImageBackground
                style={styles.background}
                source={images.background}>
                <SafeAreaView style={styles.container}>

                    <CardView style={styles.card}
                        cornerRadius={10}
                    >
                        <Image
                            style={styles.image}
                            source={images.logo}
                        />

                        <View style={{ justifyContent: "center", marginTop: 30, marginBottom: 50 }}>

                            <Text style={styles.text}> Please, use your email and password to login. </Text>

                            <InputText
                                label="email"
                                style={styles.inputText}
                                autoCapitalize="none"
                                onChangeText={(text) => this.onChangeField("email", text)}
                                value={this.state.fields["email"]}
                                error={this.state.errors["email"]}
                                autoCompleteType="email"
                            />


                            <InputText
                                label="password"
                                style={styles.inputText}
                                secureTextEntry={true}
                                onChangeText={(text) => this.onChangeField("password", text)}
                                value={this.state.fields["password"]}
                                error={this.state.errors["password"]}
                            />




                        </View>

                        <Button
                            style={styles.button}
                            isLoading={this.state.isLoading}
                            text="Login"
                            onPress={this.onLogin}
                        />
                        <View
                            style={{ height: 10 }}
                        />
                        <Text style={styles.textButton} onPress={() => this.props.navigation.navigate('RegisterScreen')}> Don't have account? <Text style={{ fontWeight: "bold", color: "#414141" }}>Register here.</Text> </Text>
                    </CardView>

                </SafeAreaView>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%"
    },
    container: {
        flex: 1,
        justifyContent: "center"
    },
    image: {
        alignSelf: "center"
    },
    text: {
        color: colors.disabled,
        marginBottom: 30
    },
    textButton: {
        alignSelf: 'center',
        color: "#414141"
    },
    card: {
        flexDirection: "column",
        marginTop: verticalScale(60),
        marginBottom: verticalScale(60),
        marginLeft: scale(20),
        marginRight: scale(20)
    },
    button: {
        width: "100%"
    },
    inputText: {
        width: "100%",
    }
})
