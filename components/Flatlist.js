import React, {Component} from 'react';
import { StyleSheet, Text, View, FlatList,Image, TouchableOpacity,Alert} from 'react-native';


 
export default class App extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      dataSource:[]
     };
   }
  componentDidMount(){
    fetch("http://127.0.0.1:5000/list_film")
    .then(response => response.json())
    .then((responseJson)=> {
      this.setState({
       dataSource: responseJson
      })
    })
    .catch(error=>console.log(error)) //to catch the errors if any
    }
 
    render(){
     return(
      <View style={{padding:10}}>
      <FlatList
      padding ={30}
         data={this.state.dataSource}
         renderItem={({item}) => 
         <TouchableOpacity>
            <View style={styles.main_container}>
            <Image
              style={styles.image}
              source={require('../assets/image/'+item.id_parc+'.jpg')}
            />
              <View style={styles.content_container}>
                  <View style={styles.header_container}>
                      <Text style={styles.title_text}>{item.nom_parc}</Text>  
                  </View>
                  <View style={styles.description_container}>
                      <Text style={styles.description_text} numberOfLines={6}>{item.description.slice(0,130)+"...."}</Text>
              {/* La propriété numberOfLines permet de couper un texte si celui-ci est trop long, il suffit de définir un nombre maximum de ligne */}
                  </View>
                  <View style={styles.date_container}>
                      <Text style={styles.date_text}>{item.nom_province}</Text>
                  </View>
              </View>
            </View>
          </TouchableOpacity>
        }
       />
     </View>
     )}
}

const styles = StyleSheet.create({
  main_container: {
    height: 190,
    flexDirection: 'row'
  },
  image: {
    width: 100,
    height: 100,
    borderRadius:20,
    marginRight:4
  },
  content_container: {
    width:290,
    paddingRight:10,
    margin: 5
  },
  header_container: {
    flex: 3
  },
  title_text: {
    fontWeight: 'bold',
    fontSize: 15,
    flex: 1,
    flexWrap: 'wrap',
    paddingRight: 5,
    color:"#007549"
  },
  description_container: {
    position:"relative",
    flex: 6
  },
  description_text: {
    fontSize:12,
    color: '#666666'
  },
  date_container: {
    flex: 1
  },
  date_text: {
    textAlign: 'right',
    fontSize: 14
  }
})