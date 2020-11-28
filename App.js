import React from "react";
import {
    createSwitchNavigator,
    createAppContainer,
} from "react-navigation";
import { Image, Platform } from 'react-native'
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import { constants, colors, images } from "@config";


import {
    SplashScreen,
    LoginScreen,
    RegisterScreen,
    TagsScreen,
    TestScreen,
    CollectionScreen,
    BookmarkScreen,
    WatchedVideosScreen,
    LikedVideosScreen,
    SearchScreen,
    MenuScreen,
    FullScreenVideo,
    ListScreen
} from "@screens";
import HomeScreen from "./src/screens/HomeScreen";

const navigationOptions = {
    ...TransitionPresets.SlideFromRightIOS,
    headerShown: false
};

const HomeStack = createStackNavigator(
    {
        Home: HomeScreen,
    },
    {
        initialRouteName: "Home",
        defaultNavigationOptions: navigationOptions
    }
)

const BookmarkStack = createStackNavigator(
    {
        Bookmark: BookmarkScreen,
        Collection: CollectionScreen,
        List: ListScreen,
    },
    {
        initialRouteName: "Bookmark",
        mode: "card",
        headerMode: "none",
        defaultNavigationOptions: navigationOptions
    }
)

const MenuStack = createStackNavigator(
    {
        Menu: MenuScreen,
        LikedVideos: LikedVideosScreen,
        WatchedVideos: WatchedVideosScreen,
    },
    {
        initialRouteName: "Menu",
        mode: "card",
        headerMode: "none",
        defaultNavigationOptions: navigationOptions
    }
)


BookmarkStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }

    return {
        tabBarVisible
    };
};


const TabNavigator = createMaterialBottomTabNavigator({
    Home: {
        screen: HomeStack,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Image
                    source={images.home}
                    tintColor={tintColor}
                    style={{ tintColor: tintColor }}
                />
            )
        }
    },
    Search: {
        screen: SearchScreen,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Image
                    source={images.search}
                    tintColor={tintColor}
                    style={{ tintColor: tintColor }}
                />
            )
        }
    },

    Bookmark: {
        screen: BookmarkStack,
        navigationOptions: {
            mode: "card",
            tabBarIcon: ({ tintColor }) => (
                <Image
                    source={images.profile}
                    tintColor={tintColor}
                    style={{ tintColor: tintColor }}
                />
            )
        }
    },
    Menu: {
        screen: MenuStack,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Image
                    source={images.menu}
                    tintColor={tintColor}
                    style={{ tintColor: tintColor }}
                />
            )
        }

    }
}, {
    initialRouteName: "Home",
    activeColor: colors.red,
    barStyle: { backgroundColor: 'white', paddingBottom: Platform.OS == "ios" ? 0 : 10, justifyContent: "flex-start" },
    labeled: false,
    tabBarOptions: {
        showLabel: false,

        activeTintColor: colors.red,
        inactiveTintColor: colors.tabInactive
    }
});


const GeneralStack = createStackNavigator(
    {
        Home: TabNavigator,
        FullScreen: FullScreenVideo
    },
    {
        initialRouteName: "Home",
        defaultNavigationOptions: navigationOptions
    }
)

const AuthStack = createStackNavigator(
    {
        LoginScreen,
        RegisterScreen,
        TagsScreen
    },
    { defaultNavigationOptions: navigationOptions, initialRouteName: 'LoginScreen' },
);

export default createAppContainer(
    createSwitchNavigator(
        {
            Splash: SplashScreen,
            Auth: AuthStack,
            Home: GeneralStack,
            Test: TestScreen,
        },
        {
            initialRouteName: 'Splash',
        },
    )
)