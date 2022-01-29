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

const Home = ({ navigation }) => {
  console.log(navigation);
  const [pointList, setPointList] = useState();
  const [count, setCount] = useState()
  const [user_id, setUserId] = useState()
  const [isModalVisible, setModalVisible] = useState(false);
  const [pointName, setPointName] = useState();
  console.log("Home")

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
    console.log(path);

    fetch(path)
      .then(response => response.json())
      .then(json => { console.log(json.data); setPointList(json.data) })
  }


  if (pointList === null || pointList === undefined) {
    AsyncStorage.getItem("user_id").then(value => {
      console.log("XXXXXXX:" + JSON.stringify(value));
      setUserId(value);
      pointListGet(value);
    }).done(err => {
      console.log("merhaba:" + err);
    })
  }

  const logOut = () => {
    AsyncStorage.clear();
    navigation.navigate('App');
    setPointList();
  }


  const GetUserId = () => {
    AsyncStorage.getItem("user_id").then(value => {
      console.log("XXXXXXX:" + JSON.stringify(value));
      setUserId(value);
      return value;

    }).done(err => {
      // Alert.alert(err)
      console.log("merhaba:err" + err + "---" + user_id);
    })

  }
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <Button title={"Çıkış"} onPress={logOut} />,
      headerRight: () => (
        <Button onPress={toggleModal} title="Ekle" />
      ),
    });
    if (user_id === undefined || user_id === null)
      navigation.navigate("App");
  }, [pointList,isModalVisible])



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

        pointListGet();
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
            if (locations === null)
              return;
            const location = { "id": parseInt(user_id), "latitude": locations[0].latitude, "longitude": locations[0].longitude };
            Alert.alert(JSON.stringify(locations[0].latitude));
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
      <Modal isVisible={isModalVisible} animationIn={'slideInLeft'}
        animationOut={'slideOutRight'}>
        <View style={{
          backgroundColor: 'rgba(0,0,0,0)',
          height: 300,
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
              <Button style={{ backgroundColor:'powderblue'}} onPress={pointSave} title="Kaydet"></Button>

            </View>

          </View>


        </View>
      </Modal>
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
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    padding: 30,
    margin: 2,
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