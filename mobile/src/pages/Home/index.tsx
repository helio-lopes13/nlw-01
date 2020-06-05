import React, { useState, useEffect } from 'react';
import { View, Image, ImageBackground, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { Feather as Icon } from '@expo/vector-icons'
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import axios from 'axios';

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const Home = () => {
    const navigation = useNavigation();

    const [uf, setUF] = useState('');
    const [city, setCity] = useState('');

    const [selectedUF, setSelectedUF] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    const [ufs, setUFs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);

            setUFs(ufInitials);
        });
    }, []);

    useEffect(() => {
        if (selectedUF === '0') {
            return;
        }
        
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
        .then(response => {
            const cityNames = response.data.map(city => city.nome);

            setCities(cityNames);
        });
    }, [selectedUF]);

    function handleNavigateToPoints() {
        navigation.navigate('Points', {
            uf,
            city
        });
    }

    // function handleSelectUF(event: ChangeEvent<HTMLSelectElement>) {
    //     const uf = event.target.value;

    //     setSelectedUF(uf);
    // }

    // function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    //     const city = event.target.value;

    //     setSelectedCity(city);
    // }

    return (
        <KeyboardAvoidingView style={ {flex: 1} } behavior={Platform.OS === 'ios' ? "padding" : undefined}>
            <ImageBackground
                source={require("../../assets/home-background.png")}
                style={styles.container}
                imageStyle={{width: 274, height: 368}}
            >
                <View style={styles.main}>
                    <Image source={require("../../assets/logo.png")}/>
                    <View>
                        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <RNPickerSelect
                        placeholder={{
                            label: 'Selecione uma UF',
                            value: '0'
                        }}
                        value={selectedUF}
                        style={pickerStyles}
                        useNativeAndroidPickerStyle={false}
                        onValueChange={(value: string) => setSelectedUF(value)}
                        items={ufs.map(uf => ({label: uf, value: uf, key: uf}) )}
                    />
                    <RNPickerSelect
                        placeholder={{
                            label: 'Selecione uma cidade',
                            value: '0'
                        }}
                        value={selectedCity}
                        style={pickerStyles}
                        useNativeAndroidPickerStyle={false}
                        onValueChange={(value: string) => setSelectedCity(value)}
                        items={cities.map(city => ({label: city, value: city, key: city}))}
                    />
                    
                    {/* <TextInput
                        style={styles.input}
                        placeholder="Digite a UF"
                        value={uf}
                        onChangeText={setUF}
                        maxLength={2}
                        autoCapitalize='characters'
                        autoCorrect={false}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Digite a cidade"
                        value={city}
                        autoCorrect={false}
                        onChangeText={setCity}
                    /> */}
                    
                    <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                        <View style={styles.buttonIcon}>
                            <Text>
                                <Icon name="arrow-right" color="#FFF" size={24} />
                            </Text>
                        </View>
                        <Text style={styles.buttonText}>
                            Entrar
                        </Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },
    
    main: {
        flex: 1,
        justifyContent: 'center',
    },
    
    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },
    
    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },
    
    footer: {},
    
    select: {},
    
    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },
    
    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },
    
    buttonIcon: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        height: 60,
        width: 60,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    
    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});

const pickerStyles = StyleSheet.create({
    inputIOS: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16, // to ensure the text is never behind the icon
    },
});

export default Home;