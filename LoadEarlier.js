import PropTypes from 'prop-types'
import React from 'react'
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props = {
  onLoadEarlier: PropTypes.func,
  isLoadingEarlier: PropTypes.bool,
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderRadius: 15,
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
  },
  text: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: '#aaa',
    fontSize: 12,
  },
  activityIndicator: {
    marginTop: Platform.select({
      ios: -14,
      android: -16,
    }),
  },
})

export default class LoadEarlier extends React.Component<Props> {
  renderLoading() {
    if (this.props.isLoadingEarlier === false) {
      return <Text style={styles.text}>load earlier messages...</Text>
    }
    return (
      <View>
        <Text style={[styles.text, { opacity: 0 }]}>load earlier messages...</Text>
        <ActivityIndicator color="#aaa" size="small" style={styles.activityIndicator} />
      </View>
    )
  }
  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          if (this.props.onLoadEarlier) {
            this.props.onLoadEarlier()
          }
        }}
        disabled={this.props.isLoadingEarlier === true}
        accessibilityTraits="button">
        <View style={styles.wrapper}>{this.renderLoading()}</View>
      </TouchableOpacity>
    )
  }
}

LoadEarlier.defaultProps = {
  onLoadEarlier: () => {},
  isLoadingEarlier: false,
}
