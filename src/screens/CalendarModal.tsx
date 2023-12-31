import { Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar, CalendarUtils, DateData } from "react-native-calendars";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList, Hotel, HotelList, GeoCode } from "../constants/types";
import { useMemo, useState } from "react";

type Props = NativeStackScreenProps<StackParamList, "CalendarModal">;

const CalendarModal = ({ navigation }: Props) => {
  const [markedDates, setMarkedDates] = useState<string[]>([]);

  const dateToday = CalendarUtils.getCalendarDateString(new Date());

  const [minDate, setMinDate] = useState(dateToday);

  console.log("marked dates: " + markedDates);

  const getDaysInBetween = (firstDay: string, secondDay: string) => {
    const daysArray = [firstDay];

    while (!daysArray.includes(secondDay)) {
      daysArray.forEach((day) => {
        const date = new Date(day);
        const newDate = date.setDate(date.getDate() + 1);
        const newDay = CalendarUtils.getCalendarDateString(newDate);
        console.log("new day = " + newDay);
        daysArray.push(newDay);
        console.log("days array = " + daysArray);
        const newArray = [...new Set(daysArray)];
        const calendarArray = Array.from(newArray);
        setMarkedDates(calendarArray);
      });
    }
  };

  if (markedDates.length === 2) {
    console.log("running days ");
    getDaysInBetween(markedDates[0], markedDates[1]);
  }

  const dayPress = (day: DateData) => {
    if (markedDates.length > 2 || markedDates[0] > day.dateString) {
      setMarkedDates([day.dateString]);

      console.log("refreshing list");
    } else {
      setMarkedDates((prev) => [...prev, day.dateString]);
    }
  };

  const marked = useMemo(() => {
    const marks = {};
    markedDates.map((day, index) => {
      if (index === 0) {
        marks[`${markedDates[0]}`] = {
          color: "hsl(38.82352941176471, 100%, 50%)",
          startingDay: true,
        };
      } else if (index === markedDates.length - 1) {
        marks[`${markedDates[index]}`] = {
          color: "hsl(38.82352941176471, 100%, 50%)",
          endingDay: true,
        };
      } else {
        marks[`${markedDates[index]}`] = {
          color: "hsl(38.82352941176471, 100%, 60%)",
          textColor: "black",
        };
      }
    });

    return marks;
  }, [markedDates]);

  return (
    <View style={{ justifyContent: "flex-end", flex: 1 }}>
      <Pressable
        style={{ flex: 1 }}
        onPress={() => navigation.goBack()}
      ></Pressable>
      <View
        style={{
          height: 20,
          backgroundColor: "orange",
          borderTopRightRadius: 15,
          borderTopLeftRadius: 15,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            height: 6,
            width: 100,
            borderRadius: 100,
          }}
        />
      </View>

      <Calendar
        style={{ height: "50%" }}
        onDayPress={dayPress}
        markingType="period"
        markedDates={marked}
        minDate={minDate}
      />
    </View>
  );
};

export default CalendarModal;

const styles = StyleSheet.create({});
