import React, {Component} from 'react';
import {
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import PropTypes from 'prop-types';
import {shouldUpdate} from '../../../component-updater';

import styleConstructor from './style';
// import { constants } from 'os';

class Day extends Component {
  static displayName = 'IGNORE';
  
  static propTypes = {
    // TODO: disabled props should be removed
    state: PropTypes.oneOf(['disabled', 'today', '']),

    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    marking: PropTypes.any,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    date: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.onDayPress = this.onDayPress.bind(this);
    this.onDayLongPress = this.onDayLongPress.bind(this);
  }

  onDayPress() {
    this.props.onPress(this.props.date);
  }
  onDayLongPress() {
    this.props.onLongPress(this.props.date);
  }

  shouldComponentUpdate(nextProps) {
    return shouldUpdate(this.props, nextProps, ['state', 'children', 'marking', 'onPress', 'onLongPress']);
  }

  render() {

    const containerStyle = [this.style.base];
    const textStyle = [this.style.text];
    const dotStyle = [this.style.dot];

    let marking = this.props.marking || {};
    if (marking && marking.constructor === Array && marking.length) {
      marking = {
        marking: true
      };
    }
    const isDisabled = typeof marking.disabled !== 'undefined' ? marking.disabled : this.props.state === 'disabled';
    let dot;

    let approvedCount = 0, rejectedCount = 0, awaitingCount= 0;
    
    if(marking.itemsList){
      marking.itemsList.map(item => {
        if (item.approved == null) {
          awaitingCount++;
        }

        if (item.approved == false) {
          rejectedCount++;
        }

        if (item.approved == true) {
          approvedCount++;

        }
     });
    }

  const approvedDot = (
  <View style={{
    backgroundColor: 'green', 
    width: 12, height: 12, 
    borderRadius: 6, 
    alignItems: 'center'
  }}>
    <Text style={{fontSize: 10,color:'white'}}>
      {approvedCount}
    </Text>
  </View>)

    const rejectedDot = (
      <View style={{
        backgroundColor: 'lightgrey', 
        width: 12, height: 12, 
        borderRadius: 6, 
        alignItems: 'center'
      }}>
        <Text style={{fontSize: 10,color:'white'}}>
          {rejectedCount}
        </Text>
      </View>)
    
    const awaitingDot = (
      <View style={{
        backgroundColor: 'red', 
        width: 12, height: 12, 
        borderRadius: 6, 
        alignItems: 'center'
      }}>
        <Text style={{fontSize: 10,color:'white'}}>
          {awaitingCount}
        </Text>
      </View>)
    
    if (marking.marked) {
      dotStyle.push(this.style.visibleDot);
      if (isDisabled) {
        dotStyle.push(this.style.disabledDot);
      }
      if (marking.dotColor) {
        dotStyle.push({backgroundColor: marking.dotColor});
      }
      dot = (<View style={dotStyle}/>);
    }

    if (marking.selected) {
      containerStyle.push(this.style.selected);
      if (marking.selectedColor) {
        containerStyle.push({backgroundColor: marking.selectedColor});
      }
      dotStyle.push(this.style.selectedDot);
      textStyle.push(this.style.selectedText);
    } else if (isDisabled) {
      textStyle.push(this.style.disabledText);
    } else if (this.props.state === 'today') {
      containerStyle.push(this.style.today);
      textStyle.push(this.style.todayText);
      dotStyle.push(this.style.todayDot);
    }
    return (
      <TouchableOpacity
        testID={this.props.testID}
        style={[containerStyle]}
        onPress={this.onDayPress}
        onLongPress={this.onDayLongPress}
        activeOpacity={marking.activeOpacity}
        disabled={marking.disableTouchEvent}
      >
        <Text allowFontScaling={false} style={textStyle}>{String(this.props.children)}</Text>
        {/* {dot} */}
        <View style={{position: 'absolute', bottom: 0, left: 0, right:0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          {approvedCount > 0 ? approvedDot : null}
          {awaitingCount > 0 ? awaitingDot : null}
          {rejectedCount > 0 ? rejectedDot : null}
        </View>

      </TouchableOpacity>
    );
  }
}

export default Day;
