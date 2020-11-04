import React, { PureComponent } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '@config';

export default class LoadingView extends PureComponent {
  render() {
    const { isLoading, showBlur, style, ...otherProps } = this.props;
    if (isLoading) {
      return (
        <View style={style} {...otherProps}>
          {showBlur ? this.props.children : null}
          <View
            style={{
              position: 'absolute',
              backgroundColor: showBlur ? '#000' : "transparent",
              top: 0,
              left: 0,
              right: 0,
              opacity: 0.9,
              bottom: 0,
              padding: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={{ margin: 20 }}
            />
          </View>
        </View>
      );
    }
    return (
      <View style={style} {...otherProps}>
        {this.props.children}
      </View>
    );
  }
}

LoadingView.defaultProps = {
  isLoading: false,
};
