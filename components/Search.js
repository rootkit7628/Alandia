//Imports des components react de sa librairies [export par défaut] 
import React from 'react'
import { Avatar, Accessory } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

//Importer les components React-native de sa librairie [export nommés]
import {StyleSheet,ImageBackground, Text, TouchableOpacity, View } from 'react-native'
// import { Image } from 'react-native';

// import bgImg from '../assets/green.jpg'

const image = { uri: "https://i.pinimg.com/originals/b6/46/15/b64615c7838f17461b43955494206baf.jpg" }
// const bgImgUri = Image.resolveAssetSource(bgImg).uri

class Search extends React.Component {
    //metthode render de la classe React.Component
    render(){
        //Les propriétés title et onPress !import
        return(
            <View style={styles.container}>
              <ImageBackground source={image} style={styles.image}>
        {/* ----------------------------------------------------------- */}
              <View style={styles.countContainer}>
                <Avatar size="large" rounded source={{uri:'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'}}><Accessory /></Avatar>
              </View>
        {/* ----------------------------------------------------------- */}
                <View style={styles.countContainer}>
                  <Text style={styles.titre}>Soraya</Text>
                </View>

        {/* ----------------------------------------------------------- */}
                <TouchableOpacity style={styles.button} onPress={() => {}}>
                  <Icon name="map-marker" size={15} />
                  <Text >  Sarintany</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => {}}>
                  <Icon name="list" size={15} />
                  <Text>  lisitra</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => {}}>
                  <Icon name="comments" size={15} />  
                  <Text>  Resaka</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => {}}>
                  <Icon name="users" size={15} />
                  <Text>  Izahay</Text>
                </TouchableOpacity>
        {/* ----------------------------------------------------------- */}
                <View style={styles.containerCopyright}>
                  <Text style={styles.copyright}>copyright ESTICS</Text>
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
        },
        titre:{
            fontSize:20,
            fontWeight:"bold"

        },
        image: {
          flex: 1,
          resizeMode: "cover",
          justifyContent: "center"
        },
        button: {
          flexDirection:"row",
          alignItems: "center",
          borderTopWidth : 1,
          borderBottomWidth:1,
          padding: 10,
          marginTop: 20,
          width:200,
          alignSelf:"center"
        },
        countContainer: {
          alignItems: "center",
          padding: 20
        },
        containerCopyright: {
          alignItems: "flex-end",
          padding: 90
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
export default Search