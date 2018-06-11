import React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { GiftedChat, Actions, Bubble, SystemMessage } from 'react-native-gifted-chat'

import CustomActions from './CustomActions'
import CustomView from './CustomView'
import LoadEarlier from './LoadEarlier'

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
})

export default class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
    }

    this._isMounted = false
    this.onSend = this.onSend.bind(this)
    this.onReceive = this.onReceive.bind(this)
    this.renderCustomActions = this.renderCustomActions.bind(this)
    this.renderBubble = this.renderBubble.bind(this)
    this.renderSystemMessage = this.renderSystemMessage.bind(this)
    this.renderFooter = this.renderFooter.bind(this)

    // ---------------//
    this.onLoadEarlier = this.onLoadEarlier.bind(this)
    this.onEndReached = this.onEndReached.bind(this)
    this.renderLoadEarlier = this.renderLoadEarlier.bind(this)
    // ---------------//

    this._isAlright = null
  }

  componentWillMount() {
    this._isMounted = true
    this.setState({
      messages: require('./data/messages.js'),
    })
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  // ---------------//

  onEndReached() {
    if (this.state.loadEarlier !== true) return
    this.onLoadEarlier()
  }

  onLoadEarlier() {
    this.setState((previousState) => ({
      isLoadingEarlier: true,
    }))

    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState((previousState) => ({
          messages: GiftedChat.prepend(previousState.messages, require('./data/old_messages.js')),
          loadEarlier: false,
          isLoadingEarlier: false,
        }))
      }
    }, 1000) // simulating network
  }

  renderLoadEarlier() {
    return <LoadEarlier onLoadEarlier={this.onLoadEarlier} isLoadingEarlier={this.state.isLoadingEarlier} />
  }
  // ---------------//

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))

    // for demo purpose
    this.answerDemo(messages)
  }

  answerDemo(messages) {
    if (messages.length > 0) {
      if (messages[0].image || messages[0].location || !this._isAlright) {
        this.setState((previousState) => ({
          typingText: 'React Native is typing',
        }))
      }
    }

    setTimeout(() => {
      if (this._isMounted === true) {
        if (messages.length > 0) {
          if (messages[0].image) {
            this.onReceive('Nice picture!')
          } else if (messages[0].location) {
            this.onReceive('My favorite place')
          } else if (!this._isAlright) {
            this._isAlright = true
            this.onReceive('Alright')
          }
        }
      }

      this.setState((previousState) => ({
        typingText: null,
      }))
    }, 1000)
  }

  onReceive(text) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, {
        _id: Math.round(Math.random() * 1000000),
        text,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://avatars3.githubusercontent.com/u/12763048?s=460&v=4',
        },
      }),
    }))
  }

  renderCustomActions(props) {
    if (Platform.OS === 'ios') {
      return <CustomActions {...props} />
    }
    const options = {
      'Action 1': (props) => {
        alert('option 1')
      },
      'Action 2': (props) => {
        alert('option 2')
      },
      Cancel: () => {},
    }
    return <Actions {...props} options={options} />
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          },
        }}
      />
    )
  }

  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
    )
  }

  renderCustomView(props) {
    return <CustomView {...props} />
  }

  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>{this.state.typingText}</Text>
        </View>
      )
    }
    return null
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        // ---------------//
        listViewProps={{
          onEndReached: this.onEndReached,
          onEndReachedThreshold: -100,
        }}
        loadEarlier={this.state.loadEarlier}
        renderLoadEarlier={this.renderLoadEarlier}
        // ---------------//

        user={{
          _id: 1, // sent messages should have same user._id
        }}
        renderBubble={this.renderBubble}
        renderSystemMessage={this.renderSystemMessage}
        renderFooter={this.renderFooter}
        // send location or image action
        renderActions={this.renderCustomActions}
        // location view
        renderCustomView={this.renderCustomView}
      />
    )
  }
}
