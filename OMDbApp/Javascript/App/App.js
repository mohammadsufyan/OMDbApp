import { StackNavigator } from 'react-navigation';
import HomeScreen from '../Screens/Home';
import DetailScreen from '../Screens/Detail';

const AppRoutes = StackNavigator({
  Home: { screen: HomeScreen },
  Detail: { screen: DetailScreen },
}
);

export default AppRoutes;

