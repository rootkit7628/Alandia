//Imports des components react de sa librairies [export par défaut] 
import 'react-native-gesture-handler';
import React from 'react';
import { Avatar, Accessory, Divider} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';


import logo from '../assets/image/logo.png';
//Importer les components React-native de sa librairie [export nommés]
import {StyleSheet,ImageBackground, Text, TouchableOpacity, Image, View } from 'react-native'
// import { Image } from 'react-native';

// import bgImg from '../assets/green.jpg'

const background = { uri: "https://i.pinimg.com/originals/b6/46/15/b64615c7838f17461b43955494206baf.jpg" }
// const bgImgUri = Image.resolveAssetSource(bgImg).uri

class Dashboard extends React.Component {
    //metthode render de la classe React.Component
    render(){
        //Les propriétés title et onPress !import
        return(
            <View style={styles.container}>
              <ImageBackground source={background} style={styles.backgroundImg}>
              <View style={styles.logoApp}>
                <Image source={logo} style={{width:50, height:50}} />
                <Text style={styles.nameApp}>Alandia</Text>
              </View>
        {/* ----------------------------------------------------------- */}
              <View style={styles.menuContainer}>
                <Avatar size="large" rounded source={{uri:'https://lh3.googleusercontent.com/ogw/ADGmqu_RJ9e4rIflxe32mUzkb6WoqxhDX54YXCMOZeiZ=s83-c-mo'}}><Accessory /></Avatar>
                <Text style={styles.titre}>Arleme J.</Text>
              </View>
        {/* ----------------------------------------------------------- */}
                <TouchableOpacity style={styles.button} onPress={() => {}}>
                  <Icon name="map-marker" size={15} />
                  <Text style={styles.text}>   Sarintany</Text>
                </TouchableOpacity>

                <Divider style={styles.divider} />

                <TouchableOpacity style={styles.button} onPress={() => {}}>
                  <Icon name="list" size={15} />
                  <Text style={styles.text}>  Lisitra</Text>
                </TouchableOpacity>

                <Divider style={styles.divider} />

                <TouchableOpacity style={styles.button} onPress={() => {}}>
                  <Icon name="comments" size={15} />  
                  <Text style={styles.text}>  Resaka</Text>
                </TouchableOpacity>

                <Divider style={styles.divider} />

                <TouchableOpacity style={styles.button} onPress={() => {}}>
                  <Icon name="users" size={15} />
                  <Text style={styles.text}>  Izahay</Text>
                </TouchableOpacity>
                <Divider style={styles.divider} />
        {/* ----------------------------------------------------------- */}
                <View style={styles.containerCopyright}>
                  <Text style={styles.copyright}>copyright ESTIX  </Text>
                  <Icon name="copyright" size={10} />
                </View>
        {/* ----------------------------------------------------------- */}

            </ImageBackground>
          </View>
        )
      }
    }
      const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: "center",
          paddingTop:20
        },
        logoApp:{
          paddingLeft:5,
          backgroundColor:"white",
          opacity:0.5,
          flexDirection:"row",
          fontFamily:"Times New Romain"
        },
        nameApp:{
          paddingTop:20,
          fontSize:25
        },
        titre:{
            paddingTop:20,
            paddingBottom: 30,
            fontSize:25,
            fontWeight:"bold",
            opacity:0.7
          },
        divider:{
          alignSelf:"center",
          backgroundColor: 'black',
          opacity: 0.5,
          height:2,
          width:150
        },
        text:{
          fontWeight:"bold",
          fontSize: 20
        },
        backgroundImg: {
          flex: 1,
          resizeMode: "cover",
          justifyContent: "center"
        },
        button: {
          backgroundColor:"white",
          flexDirection:"row",
          padding: 10,
          marginTop: 20,
          width:140,
          alignSelf:"center",
          borderTopEndRadius:20,
          opacity:0.5,
          shadowColor: 'rgba(55, 200, 134, 1)',
          shadowOpacity: 0.8,
          elevation: 6,
          shadowRadius: 10,
          shadowOffset : { width: 1, height: 5}
        },
        menuContainer: {
          alignItems: "center",
          paddingTop: 50
        },
        containerCopyright: {
          flex : 1,
          flexDirection:"row",
          justifyContent:"flex-end",
          paddingTop:50,
          marginRight:10

        },
        copyright:{
            fontSize:10
        }
      })

      //     React.createElement(View, {style : {alignItems:"center", marginTop:200}}, 
        //         React.createElement(Button, {style :styles.boutton, title : 'Sarintany',onPress : () => {}}),
        //         React.createElement(Button, {style :styles.boutton, title : 'Tsidika',onPress : () => {}}),
        //         React.createElement(Button, {style :styles.boutton, title : 'Resaka',onPress : () => {}}),
        //         React.createElement(Button, {style :styles.boutton, title : 'Izahay',onPress : () => {}})
        // ))
//On l'export pour l'utilisaer ailleur
export default Dashboard