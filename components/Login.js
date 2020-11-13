import React , {Component} from 'react';
import  {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInputComponent
} from 'react-native';
import logo from '../assets/image/logo.png';
import bgImage from '../assets/image/leaf.jpg'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class Example extends Component{
  constructor(props){
    super(props)
    this.state ={
      showPass:true,
      press : false
    }
  }
  showPass=()=>{
    if(this.state.press===false){
      this.setState({
        showPass :false,press:true})
      }else{
        this.setState({
          showPass :true,press:false})
      }
    
  }
    render (){
      return (
        <ImageBackground source={bgImage} style={styles.backgroundContainer}>
            <View style ={styles.logoContainer}>
              <Image source={logo} style={styles.logoImage} />            
              <Text style={styles.logoText}>Alandia</Text>
            </View>
            <View style={styles.loginContainer}>
                <View style={styles.inputContainer}>
                  <Icon name={'user'} size={30}  style={styles.inputIcon}/>
                  <TextInput style={styles.input} placeholder={"nom d'utilisateur"} placeholderTextColor={'rgba(255,255,255,0.7'} underlineColorAndroid =  'transparent'/>
                </View>
                <View style={styles.inputContainer}>
                  <Icon name={'lock'} size={30} style={styles.inputIcon }/>  
                    <TextInput  style={styles.input} placeholder={'mot de passe'} secureTextEntry={this.state.showPass} placeholderTextColor={'rgba(255,255,255,0.7'} underlineColorAndroid =  'transparent'/>
                      <TouchableOpacity style={styles.btnEye} onPress={this.showPass.bind(this)}>
                          <Icon name={this.state.press==false ?'eye':'eye-slash'} size={20} color={'rgba(22,55,44,0.7)'}/>
                      </TouchableOpacity>
                </View>
                <View style={styles.inputContainer}>
                      <TouchableOpacity style={styles.btnLogin} onPress={()=>this.props.navigation.navigate('Dashboard')}>
                        <Text style={styles.textLogin}> Se connecter</Text>
                      </TouchableOpacity>
                </View>
            </View>
        </ImageBackground> 
      );
    }
}
const styles =StyleSheet.create({
     backgroundContainer:{
      flex:1,
      position:"relative",
      alignItems: 'center'
    },
    logoContainer :{
      alignItems:'center'
    },
    loginContainer:{
      marginTop:20,
      textAlignVertical:"center"
    },
    inputContainer:{
      flexDirection:"row",
      marginTop:30
    },
    logoImage:{
      width:150,
      height:150
    },
    logoText:{
      fontSize:41   
    },
    input :{
      marginLeft:40,
      color:'#55547',  
      backgroundColor:"white",
      textAlign:"center",
      backgroundColor:"white",
      flexDirection:"row",
      width:200,
      height: 40,
      alignSelf:"center",
      opacity:0.5,
      shadowColor: 'rgba(55, 200, 134, 1)',
      shadowOpacity: 0.8,
      borderRadius:10,
      elevation: 6,
      shadowRadius: 10,
      shadowOffset : { width: 1, height: 5}
    },
    inputIcon :{
      paddingTop:8,
      position:'absolute'
    },
    btnEye:{
      position :'absolute',
      paddingTop:10,
      right:10
    },
    btnLogin: {
      alignSelf:"center",
      backgroundColor:"black",
      flexDirection:"row",
      padding: 10,
      marginTop: 20,
      width:150,
      borderRadius:20,
      opacity:0.5,
      shadowColor: 'rgba(55, 200, 134, 1)',
      shadowOpacity: 0.8,
      elevation: 6,
      shadowRadius: 10,
      shadowOffset : { width: 1, height: 5},
      marginLeft:70
    },
    textLogin:{
      color:'white',
      fontSize:16,
      textAlign:'center',
      paddingLeft:5,
      fontWeight:"bold"
    }
})  ;