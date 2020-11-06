import React, { Component } from 'react'
import { Text, SafeAreaView, StyleSheet, View, Image, } from 'react-native'
import api from "@service/api"
import Snackbar from 'react-native-snackbar';
import { TextHeader, Button, Dialog, InputText, LoadingView, MenuButton } from "@component/views";
import { colors, constants, images } from "@config"
import { verticalScale, scale } from 'react-native-size-matters';
import AsyncStorage from '@react-native-community/async-storage';



export default class MenuScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            buttonLoading: false,
            editProfileModal: false,
            changePasswordModal: false,
            logoutModal: false,
            user: {
                email: ""
            },
            nameInputText: "",
            oldPasswordInputText: "",
            newPasswordInputText: "",
            passwordMatchInputText: ""
        }

        this.logout = this.logout.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.showEditUserModal = this.showEditUserModal.bind(this);
    }


    showEditUserModal() {
        this.setState({ isLoading: true, editProfileModal: true });

        api.getUser().then(data => {

            let showModal = true;
            let user = this.state.user;

            if (data.status == 'error') {

                Snackbar.show({
                    text: 'Cannot get user data. Try later.',
                });

                showModal = false;
            } else {
                user = data.data;

                showModal = true;
            }

            this.setState({
                isLoading: false,
                editProfileModal: showModal,
                user: user,
                nameInputText: user.name
            })

        }).catch(() => {
            Snackbar.show({
                text: 'Cannot get user data. Try later.',
            });

            this.setState({
                isLoading: false,
                editProfileModal: false
            })

        });
    }

    logout() {
        console.log("here")
        AsyncStorage.removeItem("USER_TOKEN");
        this.props.navigation.navigate("Auth");
    }

    changePassword() {


        if (this.state.passwordMatchInputText === "" || this.state.oldPasswordInputText === ""
            || this.state.oldPasswordInputText === "") {
            Snackbar.show({
                text: 'Passwords cannot be empty',
            });
        } else if (this.state.newPasswordInputText !== this.state.passwordMatchInputText) {
            Snackbar.show({
                text: 'Password doesnt match. Check your passwords',
            });
        } else {
            this.setState({
                buttonLoading: true
            })


            api.changeUserPassword(this.state.oldPasswordInputText, this.state.newPasswordInputText).then(data => {


                let showModal = true;

                if (data.status == 'error') {
                    if (data.error.code == 404) {
                        Snackbar.show({
                            text: 'You typed wrong password.',
                        });
                    } else {
                        Snackbar.show({
                            text: 'Cannot change password. Try later.',
                        });
                    }
                } else {
                    Snackbar.show({
                        text: 'Password changed successfully',
                        backgroundColor: "green",
                    });

                    showModal = false;
                }

                this.setState({
                    buttonLoading: false,
                    changePasswordModal: showModal
                })

            }).catch(() => {
                Snackbar.show({
                    text: 'Cannot change password. Try later.',
                });

                this.setState({
                    buttonLoading: false,
                    changePasswordModal: false
                })

            });
        }


    }

    updateProfile() {
        this.setState({
            buttonLoading: true
        })

        api.updateUser(this.state.nameInputText).then(data => {

            let showModal = true;

            if (data.status == 'error') {

                Snackbar.show({
                    text: 'Cannot update user. Try later',
                });
            } else {
                Snackbar.show({
                    text: 'User updated successfully',
                    backgroundColor: "green",
                });

                showModal = false;
            }

            this.setState({
                buttonLoading: false,
                editProfileModal: showModal
            })

        }).catch(() => {
            Snackbar.show({
                text: 'Cannot update user. Try later',
            });

            this.setState({
                buttonLoading: false,
                editProfileModal: false
            })

        });
    }




    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.headerTitle}>
                    <TextHeader textStyle={{ fontSize: constants.fonts.large }} style={{ marginLeft: 10 }} color={colors.textBlack}>Settings</TextHeader>
                </View>


                <View style={styles.categoryContainer}>
                    <Image
                        style={styles.categoryImage}
                        source={images.account}

                    />
                    <Text style={styles.categoryHeader}>
                        Account
                        </Text>
                </View>


                <View
                    style={{ height: 0.5, backgroundColor: colors.disabled, marginLeft: scale(20), marginRight: scale(20), marginTop: verticalScale(10), marginBottom: verticalScale(5) }}

                />
                <MenuButton onPress={this.showEditUserModal} text="Edit profile" />
                <MenuButton text="Change password" onPress={() => { this.setState({ changePasswordModal: true }) }} />

                <View style={styles.categoryContainer}>
                    <Image
                        style={styles.categoryImage}
                        source={images.video}
                    />
                    <Text style={styles.categoryHeader}>Activity</Text>
                </View>

                <View
                    style={{ height: 0.5, backgroundColor: colors.disabled, marginLeft: scale(20), marginRight: scale(20), marginTop: verticalScale(10), marginBottom: verticalScale(5) }}

                />

                <MenuButton
                    onPress={() => { this.props.navigation.navigate("LikedVideos") }}
                    text="Liked Videos"
                />

                <MenuButton
                    text="Watched videos"
                    onPress={() => { this.props.navigation.navigate("WatchedVideos") }}
                />


                <View
                    style={{ alignItems: "center", justifyContent: "flex-end", flex: 1, padding: 20 }}>

                    <Button
                        text="Log out"
                        color="white"
                        textColor="#414141"
                        isLoading={this.state.buttonLoading}
                        textSize={constants.fonts.xxsmall}
                        underlayColor="#f5f5f5"
                        onPress={this.logout}
                        containerStyle={{ height: scale(35), width: verticalScale(200) }} />
                </View>


                <Dialog
                    onOutsidePress={() => { this.setState({ editProfileModal: false }) }}
                    animationType="fade"
                    transparent={true}
                    visible={this.state.editProfileModal}
                    onRequestClose={() => this.setState({ editProfileModal: false })}
                    title="Edit profile"
                >

                    <View
                        style={{ alignItems: "center", paddingLeft: 20, paddingRight: 20, paddingTop: 20, paddingBottom: 40 }}
                    >

                        <LoadingView
                            isLoading={this.state.isLoading}
                            style={{ width: "100%" }}
                        >

                            <InputText
                                label="email"
                                style={styles.inputText}
                                autoCapitalize="none"
                                editable={false}
                                value={this.state.user.email}
                                bottomColor={colors.disabled}
                                focusColor={colors.primary}

                            />

                            <View
                                style={{ height: 10 }}
                            />
                            <InputText
                                label="name"
                                style={styles.inputText}
                                autoCapitalize="none"
                                onChangeText={(text) => this.setState({ nameInputText: text })}
                                value={this.state.nameInputText}
                                bottomColor={colors.disabled}
                                focusColor={colors.primary}

                            />
                        </LoadingView>


                    </View>
                    <Button
                        text="Save"
                        isLoading={this.state.buttonLoading}
                        onPress={this.updateProfile}
                        containerStyle={styles.modalButton} />
                </Dialog>


                <Dialog
                    onOutsidePress={() => { this.setState({ changePasswordModal: false }) }}
                    animationType="fade"
                    transparent={true}
                    visible={this.state.changePasswordModal}
                    onRequestClose={() => this.setState({ changePasswordModal: false })}
                    title="Change password"
                >

                    <View
                        style={{ alignItems: "center", paddingLeft: 20, paddingRight: 20, paddingTop: 20, paddingBottom: 40 }}
                    >

                        <InputText
                            label="Old password"
                            style={styles.inputText}
                            autoCapitalize="none"
                            onChangeText={(text) => this.setState({ oldPasswordInputText: text })}
                            value={this.state.oldPasswordInputText}
                            bottomColor={colors.disabled}
                            secureTextEntry={true}
                            focusColor={colors.primary}

                        />

                        <InputText
                            label="New password"
                            style={styles.inputText}
                            autoCapitalize="none"
                            onChangeText={(text) => this.setState({ newPasswordInputText: text })}
                            value={this.state.newPasswordInputText}
                            bottomColor={colors.disabled}
                            focusColor={colors.primary}
                            secureTextEntry={true}
                        />



                        <InputText
                            label="Re-type password"
                            style={styles.inputText}
                            autoCapitalize="none"
                            onChangeText={(text) => this.setState({ passwordMatchInputText: text })}
                            value={this.state.passwordMatchInputText}
                            bottomColor={colors.disabled}
                            focusColor={colors.primary}
                            secureTextEntry={true}
                        />
                    </View>
                    <Button
                        text="Save"
                        isLoading={this.state.buttonLoading}
                        onPress={this.changePassword}
                        containerStyle={styles.modalButton} />
                </Dialog>

            </SafeAreaView >
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5,
        backgroundColor: colors.background,

    },
    headerTitle: {
        paddingRight: scale(10),
        paddingLeft: scale(10),
        marginBottom: verticalScale(10),
        height: constants.headerHeight,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    categoryImage: {
        marginLeft: 10,
        marginRight: 5,
        tintColor: "#414141"
    },
    categoryHeader: {
        fontSize: constants.fonts.small
    },
    categoryContainer: {
        marginTop: 10,
        paddingLeft: scale(10),
        flexDirection: "row"
    },
    modalButton: {
        marginLeft: 40,
        height: 40,
        marginRight: 40,
        marginBottom: 20
    },
    inputText: {
        width: "100%",
    }
})
