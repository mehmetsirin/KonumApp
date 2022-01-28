// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, createRef, useEffect } from 'react';
import { Text, Image, View, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import ScrollViewExample from './ScrollViewExample.js'
import RNLocation from 'react-native-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isSearchBarAvailableForCurrentPlatform } from 'react-native-screens';
// import AsyncStorage from '@react-native-community/async-storage';

const Home =  ({ navigation }) => {

  const [pointList, setPointList] = useState();
  const [count, setCount] = useState()
  const [user_id, setUserId] = useState()

  AsyncStorage.getItem("user_id").then(value => { console.log(value); setUserId(value); })

  const  login =() => {
  console.log("navigate")
   setCount(c => c + 1);
     console.log("mehme")
  }

  const logout =() => {
       AsyncStorage.clear();
       navigation.navigate('App');
  }
  
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <Button title={"Çıkış"} onPress={logout} />,
      headerRight: () => (
        <Button onPress={login} title="Ekle" />
      ),
    });
    if (pointList === undefined || null) {
      pointListGet();
    }
  }, [pointList])


  const pointListGet = () => {
    fetch('http://178.18.200.116:90/api/PointList/GetUserByPointList')
      .then(response => response.json())
      .then(json => { console.log(json.data); setPointList(json.data) })
  }


  const locationPost = (location) => {
    console.log("locationPost");
    console.log(location);
    fetch('http://178.18.200.116:90/api/PointList/PointUpdate', {
      method: 'POST',
      body: JSON.stringify(location),
      headers: {
        //Header Defination
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("locationPost");
        console.log(responseJson)
        // //Hide Loader
        // setLoading(false);
        // console.log(responseJson);
        // // If server response message same as Data Matched
        // if (responseJson.status === 'success') {
        //   AsyncStorage.setItem('user_id', responseJson.data.email);
        //   console.log(responseJson.data.email);
        //   navigation.replace('DrawerNavigationRoutes');
        // } else {
        //   setErrortext(responseJson.msg);
        //   console.log('Please check your email id or password');
        // }
      })
      .catch((error) => {
        //Hide Loader
        // setLoading(false);
        console.error(error);
      });


  }

  const GetLocation = (id) => {
    console.log("GetLocation")
    try {

      RNLocation.configure({
        distanceFilter: 1.0
      })

      RNLocation.requestPermission({
        ios: "whenInUse",
        android: {
          detail: "coarse"
        }
      }).then(granted => {

        if (granted) {
          // const aa = RNLocation.getLatestLocation(y => { console.log(y); console.log("aaassa") });
          // console.log(aa);

          RNLocation.subscribeToLocationUpdates(locations => {
            console.log("GetLocation-2")
            // console.log(locations)

            /* Example location returned
            {
              speed: -1,
              longitude: -0.1337,
              latitude: 51.50998,
              accuracy: 5,
              heading: -1,
              altitude: 0,
              altitudeAccuracy: -1
              floor: 0
              timestamp: 1446007304457.029,
              fromMockProvider: false
            }
            */
             console.log("konum  bilgisis")
             console.log(locations[0]);
            if(locations===null)
            return;
            const location = { "id": parseInt(user_id), "latitude": locations[0].latitude, "longitude": locations[0].longitude };
            Alert.alert(   JSON.stringify(locations[0].latitude));
            locationPost(location)
            //   console.log(locations)
          })
        } else {
          Alert.Alert("Konumu Açık Tutunuz")
        }
      })
    } catch (error) {
      console.log(error)
      console.log("error")
    }

  }
  const GetAlert = (data) => {
    Alert.alert(
      "Alert Title",
      data,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    );
  }

  return (
    <View>
      <ScrollView>

        {
          pointList ===
            null ? <Text>Nokta Yok</Text> :
            pointList?.map((item, index) => (
              <View key={item.id} style={styles.item}>
                <Text>{item.pointName}</Text>
                <Button
                  title="Konum"
                  onPress={() => GetLocation(item?.id)}
                />
              </View>
            ))
        }
      </ScrollView>
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
    margin: 2,
    borderColor: '#2a4944',
    borderWidth: 1,
    backgroundColor: '#d2f7f1'
  }
})