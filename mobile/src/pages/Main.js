import React, {useState, useEffect} from 'react'
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import MapView, {Marker, Callout} from 'react-native-maps'
import { requestPermissionsAsync, getCurrentPositionAsync} from 'expo-location'
import { MaterialIcons } from '@expo/vector-icons'

import api from '../services/api'

function Main({navigation}) {
    const [devs, setDevs] = useState([])
    const [currentRegion, setCurrentRegion] = useState(null)
    const [techs, setTechs] = useState('')

    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");

    useEffect(() => {
        async function loadInitialPosition() {
            const {granted} = await requestPermissionsAsync()

            if(granted) {
                const {coords} = await getCurrentPositionAsync({
                    enableHighAccuracy: true
                })

                const { latitude, longitude } = coords

                setLatitude(latitude);
                setLongitude(longitude);
                
                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04
                })
            }
        }
        loadInitialPosition()
    }, [])

    async function loadDeves() {
        
        const {latitude, longitude} = currentRegion

        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs
            }
        })
        
        setDevs(response.data.devs)
    }

    function handleRegionChanged(region) {
        setCurrentRegion(region)
    }

    if(!currentRegion) {
        return null
    }

    return (
        <View style={{flex:1}}>
            <MapView posionRegionChangeComplete={handleRegionChanged} initialRegion={currentRegion} style={styles.map}>

                <Marker coordinate={{longitude, latitude}} ></Marker>

                {devs.map(dev => (
                    <Marker
                     key={dev._id}
                     coordinate={{
                         longitude: dev.location.coordinates[0],
                        latitude: dev.location.coordinates[1],
                     }} 
                    >
                    <Image style={styles.avatar} source={{uri: dev.avatar_url }}/>

                    <Callout onPress={() => {
                        navigation.navigate('Profile', {github_username: dev.github_username})
                    }}>
                        <View style={styles.callout}>
                            <Text style={styles.devName}>{dev.name}</Text>
                            <Text style={styles.devBio}>{dev.bio}</Text>
                            <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                        </View>
                    </Callout>
                </Marker>
                ))}
            </MapView>
           
            <KeyboardAvoidingView
                keyboardVerticalOffset={Platform.OS === "ios" ? "55" : "70"}
                behavior="padding"
                style={styles.keyboardAvoidView}
            >
                <View style={styles.searchForm}>
                    <TextInput 
                    style={styles.searchInput}
                    placeholder="Buscar devs por techs..."
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    autoCorrect={false}
                    value={techs}
                    onChangeText={setTechs}
                    />
                    <TouchableOpacity onPress={loadDeves}style={styles.loadButton}>
                        <MaterialIcons name="my-location" size={20} color="#fff"/>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#000"
    },
    callout: {
        width: 260
    },
    devName: {
        fontWeight: 'bold',
        fontSize: 16
    },
    devBio: {
        color: '#666',
        marginTop: 5,
    },
    devTechs: {
        marginTop: 5,
    },
    keyboardAvoidView: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 5,
    },
    searchForm: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingBottom: 20
    },
    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#fff',
        color: "#333",
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4
        },
        elevation: 1 // sombra android
    },
    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: "#48a0dc",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 15
    }
})

export default Main;