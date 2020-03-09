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
    }

    handleDateChange = (res) => {
        this.setState({
            date: moment(res).format(DATE_FORMAT),
        }, () => {
            this.submitForm();
        });
    }

    handleTimeChange = (res) => {
        this.setState({
            time: moment(res).format(TIME_FORMAT),
        }, () => {
            this.submitForm();
        });
    }

    submitForm = () => {
        const { date, time } = this.state;

        if (date != DEFAULT_STRING && time != DEFAULT_STRING) {
            NetInfo.fetch().then(state => {
                if (!state.isConnected) {
                    Alert.alert('No network connection');
                } else {
                    this.setState({
                        roomList: [], // clear existing list
                        roomListSorted: []
                    }, () => {
                        this.loadData();
                    });
                }
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
            Alert.alert('call api error');
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

    showModal = () => {
        this.setState({ isShowModal: true });
    };

    hideModal = () => {
        this.setState({ isShowModal: false });
    };

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
                    />

                    <CustomDateTimePicker
                        label='Timeslot'
                        placeholder={time}
                        mode='time'
                        date={time == DEFAULT_STRING ? new Date() : moment(time, TIME_FORMAT).toDate()}
                        display='clock'
                        onChange={(e) => this.handleTimeChange(e)}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                        <Text style={styles.text}>Rooms</Text>

                        <TouchableWithoutFeedback onPress={()=>{this.showModal()}}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold' }}>Sort </Text>
                                <Icon name='sort' />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <ScrollView>
                        {
                            roomListSorted.length > 0 && roomListSorted.map((l, i) => (
                                <ListItem
                                    key={i}
                                    roomName={l.name}
                                    isAvailable={l.availability == 1}
                                    roomLevel={l.level}
                                    roomCapacity={l.capacity}
                                />
                            ))
                        }
                    </ScrollView>
                </View>

                <ModalOption
                    isVisible={isShowModal} //todo
                    title='Sort'
                    options={SORT_OPTIONS}
                    action={(e)=>this.handleSort(e)}
                    hideModal={()=>this.hideModal()}
                />
            </>
        );
    }
};

const styles = StyleSheet.create({
    text: {
        color: '#a0a0a0',
    }
});