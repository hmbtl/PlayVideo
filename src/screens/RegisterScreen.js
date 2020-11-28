import React, { Component } from 'react'
import { Text, StyleSheet, SafeAreaView, ImageBackground, Image, View } from 'react-native'
import Snackbar from 'react-native-snackbar';
import { images, utils, colors } from "@config"
import { CardView, Button, InputText } from "@component/views"
import api from "@service/api"
import AsyncStorage from '@react-native-community/async-storage';
import { verticalScale, scale } from "react-native-size-matters"


export default class RegisterScreen extends Component {


    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            verify: "",
            name: "",
            isLoading: false,
            fields: {},
            errors: {},
            result: {},
        }

        this.onRegister = this.onRegister.bind(this);
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
        const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        let fields = this.state.fields;
        let errors = {}
        let isFormValid = true;

        if (!fields['email']) {
            errors['email'] = 'Type your email.'
            isFormValid = false;
        } else if (!emailRegex.test(fields['email'])) {
            errors['email'] = 'Wrong email address.'
            isFormValid = false;
        }

        if (!fields['name']) {
            errors['name'] = 'Type your name.'
            isFormValid = false;
        }

        if (!fields['password']) {
            errors['password'] = 'Type your password'
            isFormValid = false;
        }

        if (!fields['verify']) {
            errors['verify'] = 'Verify your password.'
            isFormValid = false;
        } else if (fields['verify'] !== fields['password']) {
            errors['verify'] = 'Passwords do not match.'
            isFormValid = false;
        }

        this.setState({
            errors, fields
        })

        return isFormValid
    }

    onRegister() {
        const isValid = this.validate();
        const fields = this.state.fields;

        if (isValid) {
            this.setState({ isLoading: true });

            api.register(fields['email'], fields['password'], fields['name'])
                .then(data => {
                    this.setState({
                        isLoading: false,
                    });

                    if (data.status == 'error') {
                        let code = data.error.code;
                        if (code == 403) {
                            Snackbar.show({
                                text: 'User already exists please, user different email',
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
        /*
                if (!utils.validateEmail(this.state.email)) {
                    Snackbar.show({
                        text: 'Please check your email address',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                } else if (this.state.name.length < 1) {
                    Snackbar.show({
                        text: 'Please type your name.',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                } else if (this.state.password.length < 5) {
                    Snackbar.show({
                        text: 'Password should be at least 5 character long.',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                } else if (this.state.verify !== this.state.password) {
                    Snackbar.show({
                        text: "Passwords don't match.",
                        duration: Snackbar.LENGTH_SHORT,
                    });
                } else {
                    this.setState({
                        isLoading: true,
                    });
        
                    api.register(this.state.email, this.state.password, this.state.name)
                        .then(data => {
                            this.setState({
                                isLoading: false,
                            });
        
                            if (data.status == 'error') {
                                let code = data.error.code;
                                if (code == 403) {
                                    Snackbar.show({
                                        text: 'User already exists please, user different email',
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
                */
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

                            <Text style={styles.text}> Please, use your email and password to register. </Text>


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
                                label="name"
                                style={styles.inputText}
                                autoCapitalize="none"
                                onChangeText={(text) => this.onChangeField("name", text)}
                                value={this.state.fields["name"]}
                                error={this.state.errors["name"]}
                            />


                            <InputText
                                label="password"
                                style={styles.inputText}
                                secureTextEntry={true}
                                blurOnSubmit={false}
                                onChangeText={(text) => this.onChangeField("password", text)}
                                value={this.state.fields["password"]}
                                error={this.state.errors["password"]}
                            />


                            <InputText
                                label="verify"
                                style={styles.inputText}
                                secureTextEntry={true}
                                onChangeText={(text) => this.onChangeField("verify", text)}
                                value={this.state.fields["verify"]}
                                error={this.state.errors["verify"]}
                            />


                        </View>

                        <Button
                            style={styles.button}
                            isLoading={this.state.isLoading}
                            onPress={this.onRegister}
                            text="Register"
                        />
                        <View
                            style={{ height: 10 }}
                        />
                        <Text style={styles.textButton} onPress={() => this.props.navigation.navigate("LoginScreen")}> Already own an account? <Text style={{ fontWeight: "bold" }}>Login here. </Text></Text>
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
        marginBottom: 30,
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
        marginRight: scale(20),
    },
    button: {
        width: "100%"
    },
    inputText: {
        width: "100%",
    }
})
