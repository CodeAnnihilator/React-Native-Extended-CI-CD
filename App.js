import React, { useState, useEffect } from 'react';
import Config from "react-native-config";
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';

import { View, SafeAreaView, Text, StyleSheet } from 'react-native';

export default function App() {

	const [fcmToken, setFemToken] = useState(null);

	useEffect(() => {
		checkPermission()
	});

	async function checkPermission() {
		const enabled = await firebase.messaging().hasPermission();
		enabled ? getToken() : requestPermission();
	}

	async function getToken() {
		let fcmToken = await AsyncStorage.getItem('fcmToken');
		if (!fcmToken) {
			fcmToken = await firebase.messaging().getToken();
			if (fcmToken) await AsyncStorage.setItem('fcmToken', fcmToken);
		}
		setFemToken(fcmToken)
	}

	async function requestPermission() {
		try {
			await firebase.messaging().requestPermission();
			getToken();
		} catch (error) {
			console.log('permission rejected');
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.wrapper}>
				<Text>Current env variables are:</Text>
				<View style={styles.innerWrapper}>
					<Text style={styles.text}>{JSON.stringify(Config, null, 4)}</Text>
				</View>
			</View>
			<View style={styles.wrapper}>
				<Text>Device FCM Token is:</Text>
				<View style={styles.innerWrapper}>
					<Text style={styles.text} selectable>{fcmToken}</Text>
				</View>
			</View>
		</SafeAreaView>
	)
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center'
	},
	wrapper: {
		padding: 20
	},
	innerWrapper: {
		marginTop: 20,
		backgroundColor: 'rgb(40, 44, 52)',
		borderRadius: 20,
		padding: 20,
	},
	text: {
		fontWeight: 'bold',
		color: 'silver',
	},
});