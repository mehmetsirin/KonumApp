// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, createRef, useEffect } from 'react';
import { Text, Image, View, StyleSheet, ScrollView, Button, Alert, TextInput } from 'react-native';
import ScrollViewExample from './ScrollViewExample.js'
import RNLocation from 'react-native-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isSearchBarAvailableForCurrentPlatform } from 'react-native-screens';

import Modal from "react-native-modal";

const Home = ({ navigation, route }) => {
  console.log(route.params.user_id);

  const [pointList, setPointList] = useState();
  const [count, setCount] = useState()
  const [user_id, setUserId] = useState()
  const [isModalVisible, setModalVisible] = useState(false);
  const [pointName, setPointName] = useState();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setPointName();
  };
  // if(pointList=== null||pointList=== undefined)
  // AsyncStorage.getItem("user_id").then(value => 
  //   { console.log("aw------------------------"+value); 
  //   setUserId(value); 
  //   // pointListGet(value); 
  // });
  const pointListGet = (id) => {
    const path = 'http://178.18.200.116:90/api/PointList/GetUserByPointList?userId=' + id;

    fetch(path)
      .then(response => response.json())
      .then(json => {
        setPointList(json.data);
      })
  }

  if (pointList === null || pointList === undefined) {
    AsyncStorage.getItem("user_id").then(value => {
      setUserId(value);
      pointListGet(value);
    }).done(err => {

    })
  }

  const logOut = () => {
    AsyncStorage.clear();
    navigation.navigate('App');
    setPointList();
  }



  const GetUserId = () => {
    AsyncStorage.getItem("user_id").then(value => {
      setUserId(value);
      return value;

    }).done(err => {
      // Alert.alert(err)
    })

  }
  useEffect(() => {
    setUserId(route.params.user_id);

    // console.warn(JSON.stringify(navigation.getParam('itemId', 'NO-ID')));
    navigation.setOptions({
      headerLeft: () => <Button title={"Çıkış"} onPress={logOut} />,
      headerRight: () => (
        <Button onPress={toggleModal} title="Ekle" />
      ),
    });
    if (route.params.user_id === undefined || route.params.user_id === null)
      navigation.navigate("App");
  }, [pointList, isModalVisible])



  const pointSave = () => {
    const model = {
      userID: parseInt(user_id),
      pointName: pointName,
      latitude: 0,
      longitude: 0
    }
    fetch('http://178.18.200.116:90/api/PointList/PointAdd', {
      method: 'POST',
      body: JSON.stringify(model),
      headers: {
        //Header Defination
        'Content-Type': 'application/json',
      },
    }).then(res => {
      pointListGet();
      setModalVisible(!isModalVisible);

    })
  }

  const locationPost = (location) => {
    console.log( `id:${location} Zaman:${new Date()}` );
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

        pointListGet();

      })
      .catch((error) => {
        //Hide Loader
        // setLoading(false);
        Alert.Alert("Bilinmeyen bir hata oluştu-1")
      });


  }

  const GetLocation = (id) => {
    try {

      RNLocation.configure({
        distanceFilter: 1, // Meters
        desiredAccuracy: {
          ios: "best",
          android: "balancedPowerAccuracy"
        },
        // Android only
        androidProvider: "auto",
        interval: 5000, // Milliseconds
        fastestInterval: 10000, // Milliseconds
        maxWaitTime: 5000, // Milliseconds
        // iOS Only
        activityType: "other",
        allowsBackgroundLocationUpdates: false,
        headingFilter: 1, // Degrees
        headingOrientation: "portrait",
        pausesLocationUpdatesAutomatically: false,
        showsBackgroundLocationIndicator: false,
      })

      RNLocation.requestPermission({
        ios: "whenInUse",
        android: {
          detail: "coarse"
        }
      }).then(granted => {

        if (granted) {

          console.log( `id:${id} Zaman:${new Date()}` );
          // ;
          RNLocation.getLatestLocation().then( item => {
               console.log( item)
               const location = { "id": parseInt(id), "latitude":item.latitude, "longitude": item.longitude }
                locationPost(location)
          });

          // RNLocation.subscribeToLocationUpdates(locations => {
          //   if (locations === null) {
          //     Alert.alert("Konum ALINAMADI");
          //     return;
          //   }
          //   if (locations[0].latitude < 1) {
          //     Alert.alert("Konum Alırken Hata oldu-2")
          //     return;
          //   }


          //   const location = { "id": parseInt(id), "latitude": locations[0].latitude, "longitude": locations[0].longitude };


          //   locationPost(location)
          // })
        } else {
          Alert.Alert("Konumu Açık Tutunuz")
        }
      })
    } catch (error) {
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
      <Modal isVisible={isModalVisible} animationIn={'slideInLeft'}
        animationOut={'slideOutRight'}>
        <View style={{
          backgroundColor: 'rgba(0,0,0,0)',
          height: 75,
          // width:300
        }}>
          <TextInput
            style={styles.input}
            value={pointName}
            onChangeText={e => setPointName(e)}
          />
          <View style={styles.container}  >
            <View>
              <Button onPress={toggleModal} title="Kapat"></Button>

            </View>
            <View>
              <Button style={{ backgroundColor: 'powderblue' }} onPress={pointSave} title="Kaydet"></Button>

            </View>

          </View>


        </View>
      </Modal>
      <ScrollView>

        {
          pointList ===
            null ? <Text>Nokta Yok</Text> :
            pointList?.map((item, index) => (
              item.latitude === 0 ? (<View key={item.id} style={styles.noLocation}>
                <View style={{ flex:2}}>
                  <Text>{item.pointName}</Text>
                </View>
                <View>
                  <Button
                    title="Konum"
                    onPress={() => GetLocation(item?.id)}
                  />
                </View>

              </View>) : (
                <View key={item.id} style={styles.item}>
                  <View style={{ flex: 2 }}>
                    <Text>{item.pointName}</Text>

                  </View>
                  <View>
                    <Button
                      title="Konum"
                      onPress={() => GetLocation(item?.id)}
                    />
                  </View>

                </View>)

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
    padding: 20,
    margin: 1,
    borderColor: '#2a4944',
    borderWidth: 1,
    backgroundColor: 'white'
  },
  noLocation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    margin: 1,
    borderColor: '#2a4944',
    borderWidth: 1,
    backgroundColor: '#d2f7f1'
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    padding: 20,
    margin: 1,
    borderColor: '#2a4944',
    borderWidth: 1,
    backgroundColor: '#d2f7f1'
    // height: 100
  },
  input: {
    // height: 40,
    // margin: 12,
    borderWidth: 1,
    // padding: 10,
    height: 100,
    // width: 100,
    backgroundColor: 'white'
  }
})