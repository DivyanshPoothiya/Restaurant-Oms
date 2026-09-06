import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import HomeScreen    from '../screens/Home';
import MenuScreen    from '../screens/MenuScreen';
import CartScreen    from '../screens/Cart';
import ProfileScreen from '../screens/Profile';
import AboutScreen   from '../screens/About';
import ContactScreen from '../screens/Contact';
import TopBar        from './TopTabNavigator';

const Tab = createBottomTabNavigator();

const withTopBar = (ScreenComponent) => (props) => (
  <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
    <TopBar />
    <ScreenComponent {...props} />
  </View>
);

const HomeWithBar    = withTopBar(HomeScreen);
const MenuWithBar    = withTopBar(MenuScreen);
const CartWithBar    = withTopBar(CartScreen);
const ProfileWithBar = withTopBar(ProfileScreen);
const AboutWithBar   = withTopBar(AboutScreen);
const ContactWithBar = withTopBar(ContactScreen);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: { display: 'none' },
    }}
  >
    <Tab.Screen name="Home"    component={HomeWithBar} />
    <Tab.Screen name="Menu"    component={MenuWithBar} />
    <Tab.Screen name="About"   component={AboutWithBar} />
    <Tab.Screen name="Contact" component={ContactWithBar} />
    <Tab.Screen name="Cart"    component={CartWithBar} />
    <Tab.Screen name="Profile" component={ProfileWithBar} />
  </Tab.Navigator>
);

export default TabNavigator;
