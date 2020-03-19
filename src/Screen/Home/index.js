import React, { Component } from 'react';
import { View, Text, Alert, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';
import API from 'Utils/API.js';
import { Icon } from 'react-native-elements';
import CustomHeader from 'Component/CustomHeader';
import CustomDateTimePicker from 'Component/CustomDateTimePicker';
import ListItem from 'Component/ListItem';
import ModalOption from 'Component/ModalOption';

const DATE_FORMAT = 'Do MMM YYYY';
const TIME_FORMAT = 'hh:mm A';
const DEFAULT_STRING = 'Please select';
const SORT_OPTIONS = ['Location', 'Capacity', 'Availability'];

export default class Home extends Component {
    constructor() {
        super();
        this.state = {
            time: DEFAULT_STRING,
            date: DEFAULT_STRING,
            roomList: [],
            roomListSorted: [],
            sortType: null, // location, capacity, availability
            isShowModal: false,
        };

        this.timePicker = React.createRef();
        this.datePicker = React.createRef();
    }

    handleDateChange = (res) => {
        this.datePicker.current.hidePicker();
        this.setState({
            date: moment(res).format(DATE_FORMAT),
        }, () => {
            this.submitForm();
        });
    }

    handleTimeChange = (res) => {
        const MIN_TIME = moment('08:00 AM', TIME_FORMAT);
        const MAX_TIME = moment('07:30 PM', TIME_FORMAT);

        //check if selected time within range
        if (res < MIN_TIME || res > MAX_TIME) {
            return this.showAlert('Info', 'Operating hours: ' + MIN_TIME.format(TIME_FORMAT) + ' to ' + MAX_TIME.format(TIME_FORMAT), this.timePicker);
        }

        //check if selected time end with 00 or 30 minutes
        const minutes = moment(res).minutes();

        if (minutes != '00' && minutes != '30') {
            return this.showAlert('Info', 'Please select time that ends with 00 or 30 ' + minutes, this.timePicker);
        }

        const time = moment(res).format(TIME_FORMAT);
        this.timePicker.current.hidePicker();

        this.setState({
            time: time,
        }, () => {
            this.submitForm();
        });
    }

    showAlert = (alertTitle, alertMsg, ref) => { //for alert in pickers
        return Alert.alert(alertTitle, alertMsg, [
            {
                text: 'OK', onPress: () => ref.current.hidePicker()
            }]);
    }

    submitForm = () => {
        const { date, time } = this.state;

        if (date != DEFAULT_STRING && time != DEFAULT_STRING) {
            NetInfo.fetch().then(state => {
                if (!state.isConnected) {
                    return Alert.alert('Error', 'No network connection');
                }
                this.setState({
                    roomList: [], // clear existing list
                    roomListSorted: []
                }, () => {
                    this.loadData();
                });
            });
        }
    }

    loadData = async () => {
        const { sortType, time } = this.state;
        try {
            let response = await fetch(
                API.apiUrl,
            );
            let responseJson = await response.json();

            if (responseJson.length > 0) {
                const updatedArray = responseJson.map(i => {
                    let temp = Object.assign({}, i);
                    temp.availability = i.availability[moment(time, TIME_FORMAT).format('HH:mm')];
                    return temp;
                });

                const arrayCopy = updatedArray.slice(0); //duplicate the array before sorting
                const roomList = sortType ? this.sortList(updatedArray, sortType) : arrayCopy;
                this.setState({
                    roomList: arrayCopy,
                    roomListSorted: roomList
                });
            }
        } catch (error) {
            console.log('call api error');
        }
    }

    handleSort = (res = null) => {
        const { roomList } = this.state;

        const arrayCopy = roomList.slice(0); //duplicate the array before sorting
        const isReset = (res == null);
        const sortedArr = isReset ? roomList : this.sortList(arrayCopy, res);

        this.setState({
            sortType: isReset ? null : res,
            roomListSorted: sortedArr
        }, () => {
            this.hideModal();
            this.goToTop();
        });
    }

    sortList = (arr, sort) => {
        let sortType = sort.toLowerCase();

        if (sortType == 'availability') {
            return arr.sort((a, b) => parseFloat(a[sortType]) - parseFloat(b[sortType])).reverse(); //sorting for 1 to 0
        }

        if (sortType == 'location') {
            sortType = 'level';
        }
        return arr.sort((a, b) => parseFloat(a[sortType]) - parseFloat(b[sortType])); //sorting for numbers
    }

    handleBooking = (room) => {
        if (room.availability == '1') {
            Alert.alert('Success', 'You\'ve successfully booked room  ' + room.name);
        }
    }

    showModal = () => {
        this.setState({ isShowModal: true });
    };

    hideModal = () => {
        this.setState({ isShowModal: false });
    };

    goToTop = () => {
        this.scroll.scrollTo({x: 0, y: 0, animated: true});
     }

    render() {
        const { time, date, roomListSorted, isShowModal } = this.state;

        return (
            <>
                <CustomHeader cameraBtn title='Book a Room' navigation={this.props.navigation} />

                <View style={{ flex: 1, padding: 15 }}>
                    <CustomDateTimePicker
                        label='Date'
                        placeholder={date}
                        mode='date'
                        date={date == DEFAULT_STRING ? new Date() : moment(date, DATE_FORMAT).toDate()}
                        onChange={(e) => this.handleDateChange(e)}
                        ref={this.datePicker}
                    />

                    <CustomDateTimePicker
                        label='Timeslot'
                        placeholder={time}
                        mode='time'
                        date={time == DEFAULT_STRING ? new Date() : moment(time, TIME_FORMAT).toDate()}
                        display='clock'
                        onChange={(e) => this.handleTimeChange(e)}
                        ref={this.timePicker}
                    />
                    <View style={styles.listHeader}>
                        <Text style={styles.text}>Rooms</Text>

                        <TouchableWithoutFeedback onPress={() => { this.showModal() }}>
                            <View style={styles.sortBtn}>
                                <Text style={{ fontWeight: 'bold' }}>Sort </Text>
                                <Icon name='sort' />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <ScrollView ref={(c) => {this.scroll = c}}>
                        {
                            roomListSorted.length > 0 && roomListSorted.map((l, i) => (
                                <ListItem
                                    key={i}
                                    roomName={l.name}
                                    isAvailable={l.availability == 1}
                                    roomLevel={l.level}
                                    roomCapacity={l.capacity}
                                    onPress={() => this.handleBooking(l)}
                                />
                            ))
                        }
                    </ScrollView>
                </View>

                <ModalOption
                    isVisible={isShowModal}
                    title='Sort'
                    options={SORT_OPTIONS}
                    action={(e) => this.handleSort(e)}
                    hideModal={() => this.hideModal()}
                />
            </>
        );
    }
};

const styles = StyleSheet.create({
    text: {
        color: '#a0a0a0',
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 15
    },
    sortBtn: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});