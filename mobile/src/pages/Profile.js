import React from 'react'
import { StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview';

function Profile({navigation}) {
    const scalesPageToFit = Platform.OS === 'android';

    const githubUsername = navigation.getParam('github_username')

    return (
        <WebView
            style={styles.webview}
            source={{uri: `https://github.com/${githubUsername}`}}
            scalesPageToFit={scalesPageToFit}
        />
    )
}

const styles = StyleSheet.create({
    webview: {
        flex: 1
    }
})

export default Profile;