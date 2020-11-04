import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, Image } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { images } from "@config"


export default class SplashScreen extends Component {
    async checkToken() {
        try {
            const token = await AsyncStorage.getItem('USER_TOKEN');
            if (token !== null) {
                // value previously stored
                this.props.navigation.navigate('Home');
            } else {
                this.props.navigation.navigate('Auth');
            }
        } catch (e) {
            // error reading value
        }
    }

    componentDidMount() {
        this.checkToken();
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Image
                    source={images.logo}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
})
